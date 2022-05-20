import { Component } from 'react' 
import { Table , Button , Divider, Popconfirm , message , Tag  ,PageHeader } from 'antd';
import { connect } from "react-redux";
import {isEmpty} from 'underscore'
import moment from 'moment';
import { fetchIps , DeleteIp , fetchOneIp , SyncIPs } from "../store/actions/authorized";
import { fetchTeams } from "../store/actions/teams";
import AddIp from '../modals/authIps/AddIp';
import EditIp from '../modals/authIps/EditIp';
import { PlusCircleFilled , DeleteOutlined , EditTwoTone } from '@ant-design/icons'

class IpsList extends Component {
    state = {
        selectedRowKeys: [],
        loading:true,
        loadingb:false,
        addvisible:false,
        showvisible:false,
        editvisible:false,
        disabled:true,
        ip :{}
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

      componentDidMount() {
        this.props.fetchIps()
        .then(()=> this.props.fetchTeams())
        .then(()=> this.setState({loading:false}))
      }

      componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
          
      confirm = (e) => {
        this.setState({ loading: true });
        this.props.DeleteIp({ids:e})
        .then(() => this.props.fetchIps())
        .then(() => {
          message.success('Compain Deleted');
          this.setState({ loading: false , disabled:true ,selectedRowKeys:[]});
        }).catch(()=>{
          message.error('Compain not Deleted');
        });
      }

      cancel = (e) => {
          message.error('Canceled');
          this.setState({ disabled:true ,selectedRowKeys:[]});
      }

      EditIp = async (id) => {
        let ip = this.props.ips.find((ip)=> ip.id === id)
        this.setState({ip},()=>{
            this.toggleModal("editvisible")
        })
      }
  render() {
    const columns = [
      { title: 'Ip', dataIndex: 'ip', key: 'ip' },
      { title: 'Entity', dataIndex: 'entity', key: 'entity' , render: ({name}) => (
        <Tag color={"geekblue"}>
          {name.toUpperCase()}
        </Tag>
      )},
      { title: 'Type', dataIndex: 'type', key: 'type' },
      {
        title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
            <Tag color={status === "Active" ? "green" : status === "Inactive" ? "volcano" : "volcano" }>
              {status.toUpperCase()}
            </Tag>
        )
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
      { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt' , render: (updatedAt) => moment(updatedAt).format('DD-MM-YYYY hh:mm:ss') },
      {
        title: 'Action', dataIndex: '', key: 'x', render: ({id}) => ( <span>
            <Button size="large"  shape="circle" icon={<EditTwoTone twoToneColor="#531dab" />} onClick={()=> this.EditIp(id)} />
            <Divider type="vertical" />
        </span>),
      },
    ];
    const { selectedRowKeys } = this.state;
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
          title="Manage IPs"
          extra={[
              <Button size="large"  key={0} type="primary" shape="round" icon={<PlusCircleFilled />} onClick={()=> this.toggleModal("addvisible")} >New IP</Button>,
              <Popconfirm
              key={1}
              title="Are you sure?" 
              onConfirm={(e) => this.confirm(this.state.selectedRowKeys)}
              onCancel={this.cancel} 
              okText="Yes"
              cancelText="No">
                  <Button size="large"  shape="round" icon={<DeleteOutlined/>} disabled={this.state.disabled} type="danger" loading={this.state.loadingb}>Delete</Button>
              </Popconfirm>

          ]}
        />
        {this.state.addvisible && <AddIp toggleModal={this.toggleModal} addvisible={this.state.addvisible} />}
        {this.state.editvisible && <EditIp ip={this.state.ip} toggleModal={this.toggleModal} editvisible={this.state.editvisible} />}
        <Table
          style={{ marginTop : "1.5rem" }}
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.props.ips}
          rowSelection={rowSelection}
          loading={this.state.loading}
          onChange={this.handleTableChange}/>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    ips: state.ips,
    loading: state.loading,
  };
}

export default connect(mapStateToProps,{ fetchIps  , SyncIPs  , DeleteIp , fetchOneIp , fetchTeams})(IpsList)