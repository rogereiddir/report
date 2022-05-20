import { workerData , parentPort } from 'worker_threads'
import Queue, { Job } from 'bull';
import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis"; // not included, needs to be explicitly installed
import { exec } from 'shelljs';

let pids : number[] = [] ;
const isWin = process.platform === "win32";
const redisClient = createClient({url:"redis://localhost:6379"});

const io = new Emitter(redisClient);

const { actions , emails , compain ,   file } = workerData

const queue = new Queue(String(compain),{
  redis:{
      host:"localhost",
      port:6379,
  },
  settings:{
   maxStalledCount:0,
   stalledInterval:0
 }
})


parentPort.on('message',(value)=>{
    if(value === 'stop'){
      console.log("stopping")
      queue.pause(true,true)
      .then(() => {
        console.log("paused")
        return queue.empty()
      })
      .then(() => {
        console.log('empty')
        for (const pid of pids) {
          isWin ? exec(`taskkill /F /PID ${pid}`) : exec(`kill -9 ${pid}`)
        }
        return queue.close()
      })
      .then(() => {
        console.log('stoped')
        parentPort.postMessage({ message:"stopped" , data: {compain} })
        process.exit()
        // io.emit(`stop_done_${compain}`)
      }).catch(()=>{
        console.log('stoped catch')
        parentPort.postMessage({ message:"stopped" , data: {compain} })
        process.exit()
        // io.emit(`stopped_ready_${compain}`)
      })
    }
    if(value === 'pause'){
      console.log('pause')
        queue.pause(true,true).then(() => {
          parentPort.postMessage({ message:"paused" , data: {compain} })
          io.emit(`pause_done_${compain}`)
        }).catch(()=>  {
          io.emit(`error_${compain}`)
        })
    }
    if(value === 'resume'){
      queue.resume(true).then(() => {
         parentPort.postMessage({ message:"resumed" , data: {compain} })
         io.emit(`resume_done_${compain}`)
      }).catch(()=>  {
        io.emit(`error_${compain}`)
      })
    }
})

queue.empty()
.then(() => queue.clean(0))
.then(() => {
    let jobs = emails.map((seed:any)=> {
        let proxy = 'null'
        if(seed.proxy !== 'null'){
            proxy = seed.proxy
        }
        return { 
            data : { email:seed.email , password:seed.password , proxy , actions , seedId:seed.id , verificationemail:seed.verificationemail , compain , file },
            opts:  { removeOnComplete :true , removeOnFail:true , attempts:0 }
        }
    })
   return queue.addBulk(jobs)
}).then(()=> queue.process("*" , 4 , __dirname + '/worker.v3.processor.js'))
.catch(()=>  {
  parentPort.postMessage({ message:"error" , data: {compain} })
  io.emit(`error_${compain}`)
})
    

queue.on("failed" , (job,err) => {
    console.log(err)
    parentPort.postMessage({ message:"failed" , data:{...job.data} })
    io.emit(`failed_${compain}_${job.data.seedId}`)
    job.discard().then(() => { 
      console.log(`Job ${job.id} of queue ${job.id} failed with error ${err.message}`)
    }).catch((err)=> console.log(err))
})

queue.on("resumed" , (job:Job) => {
  console.log(job);
})


queue.on("progress" , (job : Job , progress) => {
  console.log(`Job ${job.id} has a feedback of ${progress.path}`);
  if(!progress.screenshot){
    pids.push(progress.pid)
    // pid = progress.pid
  }else{
    parentPort.postMessage({ message:"screenshot" , seedId:job.data.seedId , process : job.data.compain, path:progress.path })
  }
})


queue.on("drained" , () => {
  queue.empty()
  .then(() => queue.close())
  .then(() => {
    parentPort.postMessage({ message:"drained" , data: {compain} })
    process.exit()
  })
  .catch(() => parentPort.postMessage({ message:"drained" , data: {compain} }))
})


queue.on("completed" , (job , result) => {
  parentPort.postMessage({ message:"completed" , data:{...job.data} })
  io.emit(`done_${compain}_${job.data.seedId}`)
})

queue.on("active" , (job) => {
  parentPort.postMessage({ message:"active" , data:{...job.data} })
  io.emit(`active_${compain}_${job.data.seedId}`)
})