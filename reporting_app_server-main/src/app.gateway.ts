import { SubscribeMessage, WebSocketGateway, OnGatewayInit , OnGatewayConnection , OnGatewayDisconnect, WsResponse , MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Logger} from '@nestjs/common';
import { ListService } from './lists/lists.service';
import { ProcessService } from './processes/processes.service';
import { Worker } from 'worker_threads'
import { ResultsService } from './results/results.service';
import { SeedService } from './seeds/seeds.service';
import { exec } from 'shelljs';

interface IWorker  {
  [somekey:string]:Worker
}


@WebSocketGateway({
  cors :true
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly listService:ListService , 
    private readonly processService:ProcessService ,
    private readonly seedService:SeedService ,
    private readonly resultsService:ResultsService ,
  ) {}
  private worker : IWorker = {}

  private logger: Logger = new Logger('AppGateway');
 
  @SubscribeMessage('Start')
  async handleStart(@ConnectedSocket() client: any, @MessageBody () payload: any): Promise<WsResponse<string>> {
    this.logger.log('StartCompain');
    try {
        const compain = await this.processService.findOneProcess(payload)
        if(compain.status === "running"){
          // return {event:`running_ready_${payload}` , data:"OK"}
          client.emit(`running_ready_${payload}`)
          return
        }
        if(compain.status === "finished"){
          // return {event:`finished_ready_${payload}` , data:"OK"}
          client.emit(`finished_ready_${payload}`)
          return
        }
        await this.processService.updateProcess(compain.id,{status:"running"})
        const list = await this.listService.findOneList(compain.list.id)
        this.worker[String(payload)] = new Worker(__dirname + "/worker/run.worker.js" ,{
          workerData:{ emails:list.seeds , actions:compain.actions , compain:compain.id , file : compain.file || undefined }
        })

        this.worker[String(payload)].on('online', () => { console.log('Launching the warmup') })
        this.worker[String(payload)].on('message',async workerMessage => {
          try {
            console.log(workerMessage)
            switch(workerMessage.message){
              case 'active':
                // await this.seedRepository.updateSeedById(workerMessage.data.seedId,"running")
                await this.resultsService.updateSeedResult(workerMessage.data.seedId,workerMessage.data.compain,{feedback:"" , end:null ,start:new Date().toISOString() , status:"running"})
                break;
              case 'error':
                // await this.seedRepository.updateSeedById(workerMessage.data.seedId,"failed")
                await this.resultsService.updateSeedResult(workerMessage.data.seedId,workerMessage.data.compain,{status:"failed" , end:new Date().toISOString()})
                break;
              case 'completed':
                // await this.seedRepository.updateSeedById(workerMessage.data.seedId,"finished")
                await this.resultsService.updateSeedResult(workerMessage.data.seedId,workerMessage.data.compain,{end:new Date().toISOString() , status:"finished"})
                break;
              case 'stopped':
                await this.processService.updateProcess(workerMessage.data.compain,{status:"stopped"})
                await this.resultsService.updateResult(workerMessage.data.compain,{status:"stopped" , start:null , end:null})
                await this.worker[String(workerMessage.data.compain)].terminate()
                // await this.seedRepository.updateSeedByList(compain.list.id,"stopped")
                client.emit(`stop_done_${compain.id}`)
                break
              case 'resumed':{
                await this.processService.updateProcess(workerMessage.data.compain,{status:"running"})
                // await this.seedRepository.setSeedToWaiting(compain.list.id,"waiting")
                await this.resultsService.setToWaiting(workerMessage.data.compain,"waiting")
                break;
              }
              case 'screenshot':
                try {
                  const result = await this.resultsService.findSeedResult(workerMessage.seedId,workerMessage.process)
                  let feedback = '';
                  if(workerMessage.path.includes('-init-')){
                    feedback = workerMessage.path
                  }else{
                    feedback =  result.feedback.concat(',', workerMessage.path)  
                  }
                  // await this.seedRepository.update(seed.id,{feedback})
                  await this.resultsService.updateSeedResult(workerMessage.seedId , workerMessage.process ,{feedback})
                  break;
                } catch (error) {
                  break;
                }
              case 'paused':{
                await this.processService.updateProcess(workerMessage.data.compain,{status:"paused"})
                // await this.seedRepository.setSeedToPaused(compain.list.id,"paused")
                await this.resultsService.setToPaused(workerMessage.data.compain,"paused")
                break;
              }
              case 'failed':
                // await this.seedRepository.updateSeedById(workerMessage.data.seedId,"failed")
                await this.resultsService.updateSeedResult(workerMessage.data.seedId , workerMessage.data.compain,{status:"failed" ,end:new Date().toISOString()})
                break;
              case 'drained':
                await this.worker[String(workerMessage.data.compain)].terminate()
                await this.processService.updateProcess(workerMessage.data.compain,{status:"finished"})
                client.emit(`queue_done_${workerMessage.data.compain}`)
                break;
            }
          } catch (error) {
            console.log(error)
          }
        })
        this.worker[String(payload)].on('error', (err) => {
          console.log(err)
        })
        this.worker[String(payload)].on('exit', code => {
          if (code !== 0) {
            console.log(code)
          }
        })

        // await this.seedRepository.updateSeedByList(list.id,"waiting")
        await this.resultsService.updateResult(compain.id , {status:"waiting"})
        // return { event:`start_done_${payload}` , data:"OK" }
        client.emit(`start_done_${payload}`)
        return
    } catch (error) {
        console.log("error" ,error.message)
        return { event:"error" , data:"KO" }
    }
  }

    @SubscribeMessage('Stop')
    async handleStop(@ConnectedSocket() client: any, @MessageBody ()  payload: any): Promise<WsResponse<string>> {
      try {
          this.logger.log('Stopping ' + payload);
          if(this.worker[String(payload)]){
            this.worker[String(payload)].postMessage('stop')
            client.emit(`stop_done_${payload}`) 
          }
          const compain = await this.processService.findOneProcess(payload)
          await this.processService.updateProcess(compain.id,{status:"stopped"})
          await this.resultsService.updateResult(compain.id,{status:"stopped" , start:null , end:null})
          client.emit(`stop_done_${payload}`)
          return        
      } catch (error) {
          console.log("error" ,error.message)
          return {event:"error" , data:"KO"}
      }
    }

    @SubscribeMessage('Kill')
    async handleKill(@ConnectedSocket() client: any, payload: any): Promise<WsResponse<string>> {
      try {
          this.logger.log('Killing');
          exec('pkill chrome')
          // exec('pm2 reload all')
          this.logger.log('all chrome instances Killed');
          client.emit(`kill_done`)
          return     
      } catch (error) {
          console.log("error" ,error.message)
          return {event:"error" , data:"KO"}
      }
    }

   
    @SubscribeMessage('Pause')
    async handlePause(@ConnectedSocket() client: any, @MessageBody ()  payload: any): Promise<WsResponse<string>> {
      this.logger.log('Pausing');
      try {
          const compain = await this.processService.findOneProcess(payload)
          if(compain.status === "paused"){
            client.emit(`pause_ready_${payload}`)
            return {event:`none` , data:"OK"};
            // return {event:`pause_ready_${payload}` , data:"OK"}
          }
          if(compain.status === "stopped"){
            client.emit(`stopped_ready_${payload}`)
            return {event:`none` , data:"OK"};
          }
          if(compain.status === "finished"){
            client.emit(`finished_ready_${payload}`)
            return {event:`none` , data:"OK"};
          }
          if(this.worker[String(payload)]){
            if(compain.status === "paused"){
              // return {event:`pause_ready_${payload}` , data:"OK"}
              client.emit(`pause_ready_${payload}`)
              return {event:`none` , data:"OK"};
            }
            if(compain.status === "stopped"){
              // return {event:`stopped_ready_${payload}` , data:"OK"}
              client.emit(`stopped_ready_${payload}`)
              return {event:`none` , data:"OK"};
            }
            this.worker[String(payload)].postMessage('pause')
            return {event:`none` , data:"OK"}
          }
          // await this.seedRepository.updateSeedByList(list.id,"stopped")
          await this.resultsService.updateResult(compain.id,{status:"stopped"})
          await this.processService.updateProcess(compain.id,{status:"stopped"})
          return {event:`done` , data:"OK"}
      } catch (error) {
          console.log("error" ,error.message)
          return {event:"error" , data:"KO"}
      }
    }
   
    @SubscribeMessage('Resume')
    async handleResume(@ConnectedSocket() client: any, @MessageBody ()  payload: any): Promise<WsResponse<string>> {
      this.logger.log('Resuming');
      try {
          const compain = await this.processService.findOneProcess(payload)
          if(compain.status === "running"){
            client.emit(`resume_ready_${payload}`)
            return {event:`none` , data:"OK"}
          }
          if(compain.status === "stopped"){
            client.emit(`stopped_ready_${payload}`)
            return {event:`none` , data:"OK"}
          }
          if(this.worker[String(payload)]){
            if(compain.status === "running"){
              // return {event:`resume_ready_${payload}` , data:"OK"}
              client.emit(`resume_ready_${payload}`)
              return {event:`none` , data:"OK"}
            }
            if(compain.status === "finished"){
              client.emit(`finished_ready_${payload}`)
              return {event:`none` , data:"OK"}
            }
            this.worker[String(payload)].postMessage('resume')
            return {event:`none` , data:"OK"}
          }
          // await this.seedRepository.updateSeedByList(list.id,"stopped")
          await this.resultsService.updateResult(compain.id,{status:"stopped"})
          await this.processService.updateProcess(compain.id,{status:"stopped"})
          client.emit(`stopped_ready_${payload}`)
          return
      } catch (error) {
          console.log("error" ,error.message)
          return {event:"error" , data:"KO"}
      }
    }

  afterInit(server: any) {
    this.logger.log('Init');
  }
  
  handleDisconnect(@ConnectedSocket() client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(@ConnectedSocket() client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
