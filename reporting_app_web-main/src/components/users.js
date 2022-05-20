import React, { Component } from 'react'
import { Table , Button , Popconfirm , message , Tag, Switch , Input , Space, PageHeader } from 'antd';
import {PlusCircleFilled , DeleteOutlined , SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import AddUser from '../modals/users/AddUser';
import UserImport from '../modals/users/UserImport';
import { connect } from "react-redux";
import { isEmpty } from 'underscore'
import moment from 'moment';
import { fetchUsers  , loadUsers , DeleteUser , SyncUsers , UpdateUser } from "../store/actions/users";
import { fetchTeams } from "../store/actions/teams";
import { toggleIsLoading } from "../store/actions/isLoading";
// const { Option } = Select;
// const FormItem = Form.Item;
// const { Text ,Title } = Typography;

class UsersList extends Component {

    state = {
      selectedRowKeys: [],
      loading:true,
      loadingSync:false,
      loadingb:false,
      addvisible:false,
      showvisible:false,
      importuser :false,
      disabled:true,
      entity:"",
      functionteam:"",
      visible: false,
      searchText: '',
      searchedColumn: '',
      visibleDrop:false,
      currValue:'',
      filteredData:[]
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

    toggleImportModal = () => {
      this.setState({
        importuser:!this.state.importuser,
      });
    }

    toggleAddModal = () => {
      this.setState({
        addvisible:!this.state.addvisible,
      });
    }

    toggleShowModal = () => {
      this.setState({
        showvisible:!this.state.showvisible,
      });
    }
    componentDidMount() {
      this.props.fetchTeams()
      this.props.fetchUsers()
      this.setState({ loading:false , filteredData:this.props.users })
    }
    componentDidUpdate(prevProps){
      if (prevProps.users.length < this.props.users.length) {
        console.log("updated")
        this.setState({ filteredData:this.props.users })
        return null
      }
      return null;
    }

    componentWillUnmount() {
      // fix Warning: Can't perform a React state update on an unmounted component
      this.setState = (state,callback)=>{
          return;
      };
    }
     
    confirm = (e) => {
      this.setState({ loading: true });
      this.props.DeleteUser({ids:e})
      .then(() => this.props.fetchUsers()).then(()=>{
        message.success('Users Deleted');
        this.setState({ filteredData : this.props.users, loading: false , disabled:true ,selectedRowKeys:[]});
      })
      .catch(()=>{
        message.error('Users not Deleted');
      });
    }
    cancel = () => {
      message.error('Canceled');
      this.setState({ disabled:true ,selectedRowKeys:[]});
    }

    handleChange = (entity) => {
      console.log(`selected ${entity}`);
      this.setState({
        entity
      })
    }

    handleChangeRole = (functionteam) => {
      console.log(`selected ${functionteam}`);
      this.setState({
        functionteam
      })
    }

    handleChangeStatus = (id,checked) => {
      const status = checked ? "Active" : "Inactif"
      this.props.UpdateUser({data:{id,status}})
      .then(() => {
          this.setState({ loading:true })
          message.success('Updated')
          return this.props.fetchUsers()
      }).then(() =>  this.setState({ loading:false , filteredData:this.props.users }) )
    }

    handleSync = () => {
      if(this.state.entity !== 0){
        if(this.state.functionteam.length !== 0){
          this.setState({ loadingSync:true })
          SyncUsers({data:{ 
            entity:this.state.entity,
            functionteam : this.state.functionteam
          }}).then(()=> {
          this.setState({ loading:true })
          return  this.props.fetchUsers()
          }).then(()=>  this.setState({ loadingSync:false , loading:false }) ) 
          .catch((err) => {
            console.log(err)
            this.setState({ loadingSync:false , loading:false })
            const responseMessage = err.data ? err.data.message: "Error while Synchronization"
            message.error(responseMessage)
          }) 
        }else{
            message.warning("Please Select function team")
        }
      }else{
        message.warning("Please Select an Entity")
      }
    }
      
    render() {
      const FilterByLoginInput = (
        <Input
          placeholder="Search Login"
          value={this.state.currValue}
          onChange={e => {
            const currValue = e.target.value;
            this.setState({currValue})
            const filteredData = this.props.users.filter(entry =>
              entry.firstname.includes(currValue)
            );
            console.log(filteredData)
            this.setState({filteredData})
          }}
        />
      );
      const columns = [
        { title: FilterByLoginInput, dataIndex: 'username', key: 'username' ,  ...this.getColumnSearchProps('username') },
        { title: 'Access', dataIndex: 'access', key: 'access' },
        { title: 'Role', dataIndex: 'role', key: 'role' ,...this.getColumnSearchProps('role') },
        { title: 'Entity', dataIndex: 'entity', key: 'entity' , render: (record) => (
          <Tag color={"geekblue"}>
            {record?.name.toUpperCase()}
          </Tag>
        )},
        {
          title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
              <Tag color={status === "Active" ? "green" : status === "Inactif" ? "error" : "orange" }>
                {status.toUpperCase()}
              </Tag>
          )
        },
        {
          title: 'Switch Status', dataIndex: '', key: '', render: ({status,id}) => (
            <Switch defaultChecked={status === "Active" ? true : false}  onChange={(checked) => this.handleChangeStatus(id,checked) } />
          )
        },
        { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
        { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt' , render: (updatedAt) => moment(updatedAt).format('DD-MM-YYYY hh:mm:ss') },
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
                selectedRowKeys: [], // 0...45
              });
            },
          }],
        };
        
        // const roles = [
        //   'IT',
        //   'Team Leader',
        //   'Supervisor',
        //   'Mailer',
        //   'Delisting'
        // ]
        return (
          <>

        <PageHeader
          className="site-page-header"
          title="Manage Users"
          extra={[
              <Button size="large"  key={0} type="primary" shape="round" icon={<PlusCircleFilled />} onClick={this.toggleAddModal} >New User</Button>,
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
            {/* <Breadcrumb>
                <Breadcrumb.Item>
                <Title level={2}>
                    <Text code>Users</Text>
                  </Title>   
                </Breadcrumb.Item>
            </Breadcrumb>
            <Form  {...formItemLayout} layout="inline">
              <FormItem>
                <Select onChange={this.handleChange} mode="multiple" style={{ width: '20rem' }} placeholder="Please select an entity">
                {this.props.teams.map((ent)=> <Option key={ent.id} value={ent.name}>{ent.name}</Option>)}
                </Select>
              </FormItem>
              <FormItem>
                <Select onChange={this.handleChangeRole} mode="multiple" style={{ width: '15rem' }} placeholder="Please select function team">
                  {roles.map((role,i)=> <Option key={i} value={role}>{role}</Option>)}
                </Select>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleSync}>
                <SyncOutlined spin={loadingSync} />
                  SYNC
                </Button>
              </FormItem>
              <FormItem>
                <Button icon={<ImportOutlined />} onClick={() => { this.state.entity.length !== 0 && this.state.functionteam.length !== 0 ?  this.toggleImportModal() : message.warn("Please Select Entity And Role!!")}}>
                  IMPORT
                </Button>
              </FormItem>
            </Form> */}
          
            {this.state.addvisible && <AddUser toggleAddModal={this.toggleAddModal} addvisible={this.state.addvisible} />}
            {this.state.importuser && <UserImport functionteam={this.state.functionteam} entity={this.state.entity} toggleImportModal={this.toggleImportModal} importuser={this.state.importuser} />}
            <Table
              style={{ marginTop : "1.5rem" }}
              rowKey={record => record.id}
              columns={columns}
              dataSource={this.state.filteredData}
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
    users: state.users,
    teams: state.teams,
  };
}

export default connect(mapStateToProps, { fetchUsers ,toggleIsLoading , loadUsers , DeleteUser , fetchTeams , UpdateUser })(UsersList)