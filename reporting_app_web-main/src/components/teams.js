import React, { Component } from 'react'
import { Table ,Button ,  Popconfirm , message , Tag ,  Switch, PageHeader } from 'antd';
import AddTeam from '../modals/teams/AddTeam';
import EditTeam from '../modals/teams/EditTeam';
import { connect } from "react-redux";
import moment from 'moment';
import { fetchTeams  , loadTeams , DeleteTeam } from "../store/actions/teams";
import {isEmpty} from 'underscore'
import { PlusCircleFilled , DeleteOutlined , EditOutlined } from '@ant-design/icons'

class TeamList extends Component {
    state = {
        selectedRowKeys: [],
        loading:true,
        loadingSync:false,
        loadingb:false,
        addTeamVisible:false,
        editTeamVisible:false,
        disabled:true,
        team:{}
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
      EditTeam = (id)=>{
        let team = this.props.teams.find((t)=> t.id === id)
        this.setState({team},()=>{
            this.toggleModal("editTeamVisible")
        })
      }
      componentDidMount() {
        this.props.fetchTeams()
        this.setState({ loading:false })
      }
     
       confirm = (e) => {
        this.setState({ loading: true });
        this.props.DeleteTeam({ids:e})
        .then( async ()=>{
           await this.props.fetchTeams()
          message.success('Teams Deleted');
          this.setState({ loading: false , disabled:true ,selectedRowKeys:[]});
          
        }).catch(()=>{
          message.error('Teams not Deleted');
        });
      }
     cancel = (e) => {
          message.error('Canceled');
          this.setState({ disabled:true ,selectedRowKeys:[]});
     }
      
  render() {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
            <Tag color={status === "Active" ? "green" : status === "Inactif" }>
              {status.toUpperCase()}
            </Tag>
        )
      },
      {
        title: 'Switch Status', dataIndex: '', key: '', render: ({status}) => (
           <Switch defaultChecked={status === "Active" ? true : false}  onChange={(checked) => console.log(checked) } />
        )
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
      { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt' , render: (updatedAt) => moment(updatedAt).format('DD-MM-YYYY hh:mm:ss') },
      {
        title: 'Action', dataIndex: '', key: 'x', render: ({id}) => ( <span>
          <Button size="large"  shape="circle" icon={<EditOutlined />} onClick={() => this.EditTeam(id)} />
        </span>),
        width:200
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
          title="Teams"
          extra={[
              <Button size="large"  key={0} type="primary" shape="round" icon={<PlusCircleFilled />} onClick={()=> this.toggleModal("addTeamVisible")} >New Team</Button>,
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
        {this.state.addTeamVisible && <AddTeam  toggleModal={this.toggleModal} addTeamVisible={this.state.addTeamVisible} />}
        {this.state.editTeamVisible && <EditTeam team={this.state.team} toggleModal={this.toggleModal} editTeamVisible={this.state.editTeamVisible} />}
        <Table
          style={{ marginTop : "1.5rem" }}
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.props.teams}
          rowSelection={rowSelection}
          loading={this.state.loading}
          onChange={this.handleTableChange}
       />
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams,
  };
}

export default connect(mapStateToProps, { fetchTeams  , loadTeams , DeleteTeam })(TeamList)