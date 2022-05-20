import React ,{ Component } from 'react'
import { Modal , Table , Tag , Button , Tooltip } from 'antd';
import io from 'socket.io-client';
import moment from 'moment'
import ShowSeedDetail from "./ShowSeedDetail";
import { configureStore } from "../../store";
import { fetchProcessResults } from "../../store/actions/processes";
import { SyncOutlined , ExceptionOutlined , CloseCircleOutlined , CheckCircleOutlined , ClockCircleOutlined , CloudSyncOutlined } from '@ant-design/icons'

const store = configureStore();


class ShowSeedLog  extends Component {

  state = {
    loading:true,
    seed:{},
    detail:false,
    active:[],
    failed:[],
    waiting:[],
    finished:[],
    results:[],
    socket : null
  };


  componentDidMount(){
    if(Object.keys(this.props.process).length !== 0){
      console.log('set up seed listnener')
      const socket = process.env.NODE_ENV === 'development' ? io('http://localhost:5000') : io('http://45.130.104.197:5000' , {transports:['websocket']});
      this.setState({socket , loading:true})
      const active = []
      const failed = []
      const finished = []
      const waiting = []
      store.dispatch(fetchProcessResults({proc:this.props.process.id})).then(results => {
        this.setState({
          results,
          loading:false
        })
        for (const res of results) {
          switch(res.status){
            case "running" :
              active.push(res.seed.id)
              break
            case "failed" :
              failed.push(res.seed.id) 
              break
            case "finished" :
              finished.push(res.seed.id) 
              break
            case "waiting" :
              waiting.push(res.seed.id) 
              break
            default :
              break
          }
           socket.on(`active_${this.props.process.id}_${res.seed.id}`, () => {
             console.log("seed active message",res.seed)
               this.setState({
                 active:[
                   ...new Set([...this.state.active, res.seed.id])
                 ],
                 waiting:[...this.state.waiting.filter(s => s !== res.seed.id)],
                 failed:[...this.state.failed.filter(s => s !== res.seed.id)],
               })
           })
           socket.on(`done_${this.props.process.id}_${res.seed.id}`, () => {
               this.setState({
                 finished:[
                   ...new Set([...this.state.finished, res.seed.id])
                 ],
                 active:[...this.state.active.filter(s => s !== res.seed.id)]
               })
           })
           socket.on(`failed_${this.props.process.id}_${res.seed.id}`, () => {
               this.setState({
                 failed:[
                  ...new Set([...this.state.failed, res.seed.id])
                 ],
                 active:[...this.state.active.filter(s => s !== res.seed.id)]
               })
           })
       }
       this.setState({
         active,
         failed,
         finished,
         waiting
       })
      })
    }
  }


  componentWillUnmount(){
    console.log('remove seed listnener')
    const { socket , results } = this.state
    for (const res of results) {
      socket.off(`active_${this.props.process.id}_${res.seed.id}`)
      socket.off(`done_${this.props.process.id}_${res.seed.id}`)
      socket.off(`failed_${this.props.process.id}_${res.seed.id}`)
    }
    this.setState = () => ({})
  }

  toggleModal = (modal) => {
    this.setState(state => ({
      [modal]:!state[modal],
    }));
  }

  switchStatus = (status) => {
    switch(status){
       case "idle":
         return "geekblue"
       case "waiting":
         return "warning"
       case "stopped":
         return "volcano"
       case "finished":
         return "green"
       default :
         return "volcano"
    }
  }



 render(){

  const { active , failed , finished , waiting , loading , results } = this.state

  const columns = [
    { title: 'Email', dataIndex: '', key: 'email' , render :({seed}) => seed.email  },
    { title: 'Proxy', dataIndex: '', key: 'proxy' , render :({seed}) => seed.proxy },
    { title: 'Isp', dataIndex: '', key: 'isp' , render :({seed}) => seed.isp },
    {
      title: 'Status', dataIndex: '', key: '', render: ({seed,status}) => (
         <span>
          {
           active.includes(seed.id) ? <SyncOutlined spin  style={{ fontSize: '20px' }} /> : 
           failed.includes(seed.id) ? <Tag color='red'> FAILED </Tag> :
           finished.includes(seed.id) ? <Tag color='green'> FINISHED </Tag>  : 
           waiting.includes(seed.id) ? <Tag color='warning'> WAITING </Tag>  : 
           status === "running" ? <SyncOutlined spin  style={{ fontSize: '20px' }} /> : 
           <Tag color={this.switchStatus(status)}> {status.toUpperCase()} </Tag>
          }
         </span>
      ),
      filters: [
        {
          text: 'failed',
          value: 'failed',
        },
        {
          text: 'running',
          value: 'running',
        },
        {
          text: 'waiting',
          value: 'waiting',
        },
        {
          text: 'active',
          value: 'active',
        },
        {
          text: 'finished',
          value: 'finished',
        },
     ],
     onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    { title: 'Duration (minutes)' , dataIndex: '', key: '' , render :({start,end}) => {
      return <span>
        {
          start &&  end ? moment.duration(moment(end).diff(start)).asMinutes().toFixed(2) : 0
        }
      </span>
    }},
    {
      title: 'Details', dataIndex: 'seed', key: 'seed', render: (seed) => (
         <span>
          <Button size="large" onClick={()=> {
             this.setState({
              seed,
              detail:true
             })
            
          }} icon={<ExceptionOutlined color="#531dab" />} >More</Button>
         </span>
      )
    },
  ];
  return (
    <>
    {this.state.detail && <ShowSeedDetail id={this.props.process.id} seed={this.state.seed} detail={this.state.detail} toggleModal={this.toggleModal} />}
     <Modal
      width={"90%"}
      title={this.props.process.id}
      visible={this.props.showdetails}
      onCancel={() => this.props.toggleModal("showdetails")}
      footer={false}>

       <div>
        <Tooltip title="Active Seeds" color='processing' key='processing'> 
          <Tag style={{fontSize:"1.2rem" , padding:"12px"}} icon={active.length !== 0 ? <SyncOutlined spin /> : <CloudSyncOutlined/>} color='processing'>{active.length}</Tag> 
        </Tooltip>
        <Tooltip title="Failed Seeds" color='#f50' key='failed'> 
          <Tag  style={{fontSize:"1.2rem" , padding:"12px"}} icon={<CloseCircleOutlined />} color="#f50">{failed.length}</Tag>
        </Tooltip>
        <Tooltip title="Finished Seeds" color='#87d068' key='finished'> 
          <Tag  style={{fontSize:"1.2rem" , padding:"12px"}} icon={<CheckCircleOutlined />} color="#87d068">{finished.length}</Tag>
        </Tooltip>
        <Tooltip title="Waiting Seeds" color='#ffc53d' key='waiting'> 
          <Tag  style={{fontSize:"1.2rem" , padding:"12px"}} icon={<ClockCircleOutlined />} color="#ffc53d">{waiting.length}</Tag> 
        </Tooltip>
        </div>
        <Table
          style={{marginTop:"1.5rem"}}
          rowKey={record => record.id}
          columns={columns}
          dataSource={results}
          loading={loading}
        />
     </Modal>
    </>
    )
 }
}

export default ShowSeedLog