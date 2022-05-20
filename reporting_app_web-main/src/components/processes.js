import React, { Component } from 'react'
import { Table ,Button , Tag , Popconfirm , message  , Input , Space, PageHeader } from 'antd';
import { connect } from "react-redux";
import {isEmpty} from 'underscore'
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { PlusOutlined , DeleteOutlined , SyncOutlined , SearchOutlined , ReloadOutlined , CloseCircleOutlined} from '@ant-design/icons'
import io from 'socket.io-client';
import AddCompain from '../modals/processes/AddProcess';
import ProcessActions from './containers/processActions';
import EditCompain from '../modals/processes/EditProcess';
import ShowSeedsLogs from '../modals/processes/ShowSeedsLog';
import { fetchProcesses  , DeleteProcess , fetchOneProcess , loadProcesses } from "../store/actions/processes";
import { toggleIsLoading } from "../store/actions/isLoading";
import { fetchListSeeds } from "../store/actions/seeds";

message.config({
  maxCount:1
})

class ProcessList extends Component {

    state = {
        selectedRowKeys : [],
        loading : true,
        loadingb : false,
        addvisible : false,
        showvisible : false,
        editvisible : false,
        showdetails : false,
        loadingkill : false,
        disabled : true,
        loadingStart : [],
        processActive : [],
        processStop : [],
        processPaused : [],
        processFinished : [],
        activeProcess : [],
        loadingStop : [],
        loadingPause : [],
        loadingResume : [],
        process : {},
        socket : null,
        active:{},
        searchText: '',
        searchedColumn: '',
      };

      getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          return (
            <div style={{ padding: 8 }}>
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                placeholder={`Search`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}>
                  Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                  cancel
                </Button>
              </Space>
            </div>
          )
        },
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });


      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };
      
      onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys , disabled:false });
        if(isEmpty(selectedRowKeys)){
          this.setState({ disabled:true })
        }
      }
      toggleModal = (modal) => {
        this.setState(state => ({
          [modal]:!state[modal],
        }));
      }
      updateSocket(processes , socket){
        const {userId , entity} = this.props
        for (const p of processes) {
      
          for (const seed of p.list.seeds) {
            socket.off(`active_${seed.id}`)
            socket.off(`failed_${seed.id}`)
            socket.off(`done_${seed.id}`)
          }
          socket.on(`active-${p.id}`)
          socket.off(`start_done_${p.id}`)
          socket.off(`pause_done_${p.id}`)
          socket.off(`stop_done_${p.id}`)
          socket.off(`resume_done_${p.id}`)
          socket.off(`queue_done_${p.id}`)
      
          socket.off(`running_ready_${p.id}`)
          socket.off(`pause_ready_${p.id}`)
          socket.off(`resume_ready_${p.id}`)
          socket.off(`stopped_ready_${p.id}`)
                  
          const active = {
            ...this.state.active,
            [p.id]: 0,
          }
      
          this.setState({
            active,
          });
      
          socket.on(`queue_done_${p.id}`, () => {
              this.props.fetchProcesses({
                filter: {userId,entity}
              }).then(procs =>this.props.loadProcesses(procs))
              message.success(`Process ${p.id} Finished`);
              this.setState({  
                processFinished:[...new Set([...this.state.processFinished,p.id])] , 
                processActive:[...this.state.processActive.filter(cp => cp !== p.id)] 
              })
          })
      
          socket.on(`start_done_${p.id}`, () => {
            this.props.fetchProcesses({
              filter: {userId,entity}
            }).then(procs => this.props.loadProcesses(procs))
            message.success(`Process ${p.id} Started`);
            this.setState({ 
              loadingStart:[] , 
              processActive:[...new Set([...this.state.processActive,p.id])],
              processStop:[...this.state.processStop.filter(cp => cp !== p.id)]
            })
          })
      
          socket.on(`pause_done_${p.id}`, () => {
            this.props.fetchProcesses({
              filter: {userId,entity}
            }).then(procs =>this.props.loadProcesses(procs))
            message.success(`Process ${p.id} Paused`);
            this.setState({ 
              loadingPause:[] , 
              processPaused:[...new Set([...this.state.processPaused,p.id])] ,
              processActive:[...this.state.processActive.filter(cp => cp !== p.id)] 
            })
          })
      
          socket.on(`stop_done_${p.id}`, () => {
            this.props.fetchProcesses({
              filter: {userId,entity}
            }).then(procs => this.props.loadProcesses(procs))
            message.success(`Process ${p.id} Stopped`);
            this.setState({ 
              loadingStop:[] , 
              processStop:[...new Set([...this.state.processStop,p.id])],
              processFinished:[...this.state.processFinished.filter(cp => cp !== p.id)], 
              processActive:[...this.state.processActive.filter(cp => cp !== p.id)] 
             })
          })
      
          socket.on(`resume_done_${p.id}`, () => {
            this.props.fetchProcesses({
              filter: {userId,entity}
            }).then(procs =>this.props.loadProcesses(procs))
            message.success(`${p.id} Resumed`);
            this.setState({ 
              loadingResume:[] , 
              processActive:[...new Set([...this.state.processActive,p.id])] ,
              processPaused:[...this.state.processPaused.filter(cp => cp !== p.id)] ,
            })
          })
      
          socket.on(`running_ready_${p.id}`, () => {
            message.warn('Process Already Running')
            this.setState({ loadingStart:[] })
          })
      
          socket.on(`error_${p.id}`, () => {
            message.warn('Error while Starting')
            this.setState({ processStop:[...new Set([...this.state.processStop,p.id])] })
          })
      
          socket.on(`pause_ready_${p.id}`, () => {
            message.warn('Process Already Paused')
            this.setState({ loadingPause:[] })
          })
      
          socket.on(`resume_ready_${p.id}`, () => {
            message.warn('Process Already Running')
            this.setState({ loadingResume:[]  })
          })
      
          socket.on(`stopped_ready_${p.id}`, () => {
            message.warn('Process Already Stopped')
            this.setState({ loadingStop:[] })
          })
      
          socket.on(`finished_ready_${p.id}`, () => {
            message.success('Process Already Finished')
            this.setState({ loadingStart:[] })
          })
         }
      }
      componentDidUpdate(prevProps){
        if (prevProps.processes.length < this.props.processes.length) {
          console.log("updated")
          const { socket } = this.state
          const { processes } = this.props
          this.updateSocket(processes,socket)
          return null
        }
        return null;
      }
      componentDidMount(){
          console.log("setting up")
          const socket = process.env.NODE_ENV === 'development' ? io('http://localhost:5000',{transports:['websocket']}) : io('http://45.130.104.197:5000' , {transports:['websocket']});
          socket.on(`kill_done`, () => {
            message.success('Chrome Killed')
            this.setState({ loadingkill:false })
          })
          this.setState({socket})
          const {userId , entity} = this.props
          this.props.fetchProcesses({
            filter: {userId,entity},
          }).then(processes => {
            this.props.loadProcesses(processes)
            this.updateSocket(processes,socket)
            this.setState({
              loading:false
            })
          })
      }
      componentWillUnmount() {
        const { socket } = this.state
        const { processes } = this.props
        for (const p of processes) {
          for (const seed of p.list.seeds) {
            socket.off(`active_${seed.id}`)
            socket.off(`failed_${seed.id}`)
            socket.off(`done_${seed.id}`)
          }
          socket.on(`active-${p.id}`)
          socket.off(`start_done_${p.id}`)
          socket.off(`pause_done_${p.id}`)
          socket.off(`stop_done_${p.id}`)
          socket.off(`resume_done_${p.id}`)
          socket.off(`queue_done_${p.id}`)

          socket.off(`running_ready_${p.id}`)
          socket.off(`pause_ready_${p.id}`)
          socket.off(`resume_ready_${p.id}`)
          socket.off(`stopped_ready_${p.id}`)
  
        }
        socket.off(`message`)
        console.log("removed listeners")
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state , callback) => ({})
      }

      confirm = (e) => {
        const {userId , entity} = this.props
        this.props.DeleteProcess({ids:e})
        .then(()=>{
          this.props.fetchProcesses({
            filter: {userId,entity}
          }).then((proccesses)=>{
            this.props.loadProcesses(proccesses)
            message.success('Process Deleted');
            this.setState({ disabled:true ,selectedRowKeys:[]});
          })
         }).catch(()=>{
            message.error('Process not Deleted Still In Running Status');
         });
     }
     cancel = (e) => {
        message.error('Canceled');
        this.setState({ disabled:true ,selectedRowKeys:[]});
     }
     startProcess = (id) => {
       this.setState({ loadingStart:[...this.state.loadingStart,id] } , () => {
         this.state.socket.emit("Start", id)
         this.setState({ loadingStart:[] })
       })
     }
     stopProcess = (id) => {
       this.setState({ loadingStop:[...this.state.loadingStop,id]} , () => {
         this.state.socket.emit("Stop", id)
       })
     }
     pauseProcess = (id) => {
      this.setState({ loadingPause:[...this.state.loadingPause,id] } , () => {
        this.state.socket.emit("Pause", id)
        this.setState({ loadingPause:[] })
      })
     }
     resumeProcess = (id) => {
      this.setState({ loadingResume:[...this.state.loadingResume,id] } , () => {
         this.state.socket.emit("Resume", id)
         this.setState({ loadingResume:[] })
      })
     }
     editProcess = (id) => {
        let process = this.props.processes.find((compain)=> compain.id === id)
        this.setState({process},()=>{
            this.toggleModal("editvisible")
        })
     }
     showLogs = (id) => {
        let process = this.props.processes.find((compain)=> compain.id === id)
        this.setState({process},()=>{
            this.toggleModal("showdetails")
        })
     }
     switchStatus = (status) => {
       switch(status){
          case "finished":
            return "green"
          case "idle":
            return "geekblue"
          case "resumed":
            return "#d3adf7"
          case "paused":
            return "#f759ab"
          case "stopped":
            return "volcano"
          default :
            return "volcano"
       }
     }
  render() {

    const { selectedRowKeys , addvisible , editvisible , process , showdetails , loadingSeed , loadingStart , loadingPause , loadingStop , loadingResume } = this.state;
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' , ...this.getColumnSearchProps('id') },
      {
        title: 'Seed Count', dataIndex: '', key: 'x', render: ({list}) => ( 
        <span>
          <Tag color='purple'> {list.seeds?.length || 0} </Tag>
        </span>
        )
      },
      {
        title: 'UserName', dataIndex: '', key: 'x', render: ({user}) => ( 
        <span>
          <Tag color='magenta'> {user.loginu} </Tag>
        </span>
        )
      },
      {
        title: 'List', dataIndex: '', key: 'x', render: ({list}) => ( 
        <span>
          <Tag color='cyan'> {list.name} </Tag>
        </span>
        )
      },
      {
        title: 'Status', dataIndex: '', key: '', render: ({status,id}) => (
           <span>
            {
              this.state.processActive.includes(id) ? <SyncOutlined spin  style={{ fontSize: '20px' }} /> :
              this.state.processStop.includes(id) ? <Tag color='volcano'> STOPPED </Tag> :
              this.state.processFinished.includes(id) ? <Tag color='green'> FINISHED </Tag>  : 
              this.state.processPaused.includes(id) ? <Tag color='#f759ab'> PAUSED </Tag>  : 
              status === "running" ? <SyncOutlined spin  style={{ fontSize: '20px' }} /> : 
              <Tag color={this.switchStatus(status)}> {status.toUpperCase()} </Tag>
            }
           </span>
        )
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
      {
        title: 'Action', dataIndex: '', key: 'x', render: ({id}) => ( 
          <ProcessActions 
            id={id} 
            active={this.state.processActive}
            stopped={this.state.processStop}
            loadingStart={loadingStart} loadingStop={loadingStop}
            loadingPause={loadingPause} loadingResume={loadingResume}
            pauseProcess={this.pauseProcess} 
            startProcess={this.startProcess} resumeProcess={this.resumeProcess} 
            stopProcess={this.stopProcess} showLogs={this.showLogs} 
            editProcess={this.editProcess} />
        ),
      },
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [{
          key: 'all-data',
          text: 'Select All Data',
          onSelect: () => {
            this.setState({
              selectedRowKeys: [...Array(46).keys()], // 0...45
            });
          },
        }],
      };
  
    return (
      <>

        <PageHeader
          className="site-page-header"
          title="Processes"
          extra={[
              <Button size="large" key={0} type="primary" shape="round" icon={<PlusOutlined />} onClick={()=> this.toggleModal("addvisible")} >New Process</Button>,
              <Button title="Reload" size="large" key={1} type="primary" shape="round" icon={<ReloadOutlined />} onClick={() => {
                const {userId , entity} = this.props
                const { socket } = this.state
                this.setState({ loading:true })
                this.props.fetchProcesses({
                  filter: {userId,entity},
                }).then(processes => {
                  this.props.loadProcesses(processes)
                  this.updateSocket(processes,socket)
                  this.setState({
                    loading:false
                  })
                })
              }} />,
              <Button loading={this.state.loadingkill} size="large" key={3} type="danger" shape="round" icon={<CloseCircleOutlined />} onClick={() => {
                this.setState({ loadingkill:true })
                this.state.socket.emit('Kill')
              }} >Kill All Chrome Pids</Button>,
              <Popconfirm
              key={2}
              title="Are you sure?" 
              onConfirm={(e) => this.confirm(this.state.selectedRowKeys)}
              onCancel={this.cancel} 
              okText="Yes"
              cancelText="No">
                  <Button size="large" shape="round" icon={<DeleteOutlined/>} disabled={this.state.disabled} type="danger" loading={this.state.loadingb}>Delete</Button>
              </Popconfirm>

          ]}
        />
         
        {addvisible && <AddCompain toggleModal={this.toggleModal} addvisible={addvisible} />}
        {editvisible && <EditCompain process={process} toggleModal={this.toggleModal} editvisible={editvisible} />}
        {showdetails && <ShowSeedsLogs loadingSeed={loadingSeed} process={process} toggleModal={this.toggleModal} showdetails={showdetails} />}
        <Table
          style={{ marginTop : "1.5rem" }}
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.props.processes}
          rowSelection={rowSelection}
          loading={this.state.loading}
          onChange={this.handleTableChange}/>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    processes: state.processes,
    loading: state.loading,
    user: state.userAuth.user,
    userId: state.userAuth.user.userId,
    entity: state.userAuth.user.entity,
    status: state.seedsStatus
  };
}

export default connect(mapStateToProps,{ fetchProcesses , DeleteProcess , fetchOneProcess , fetchListSeeds ,toggleIsLoading , loadProcesses })(ProcessList)