import React, { Component } from 'react'
import { Table , Button , Divider, Popconfirm ,message, Tag, PageHeader } from 'antd';
import { connect } from "react-redux";
import {isEmpty} from 'underscore'
import moment from 'moment';
import AddList from '../modals/lists/AddList';
import ShowListDetails from '../modals/lists/ShowSeedsList';
import EditList from '../modals/lists/EditList';
import StoreSeeds from '../modals/lists/StoreSeeds';
import { fetchLists  , loadLists  , DeleteList , fetchOneList  } from "../store/actions/lists";
import { fetchSeeds } from "../store/actions/seeds";
import { toggleIsLoading } from "../store/actions/isLoading";
import {PlusCircleFilled , PlusCircleTwoTone , DeleteOutlined , EditTwoTone , EyeTwoTone } from '@ant-design/icons'


class Lists extends Component {
    state = {
        selectedRowKeys: [],
        loading:true,
        loadingb:false,
        addvisible:false,
        editvisible:false,
        showvisible:false,
        storeSeedvisible:false,
        disabled:true,
        list : {}
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
        const {userId , entity} = this.props
        this.props.fetchLists({
          filter: {userId,entity}
        })
        this.setState({ loading:false })
      }

      componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{ return };
       }
      
      confirm = (e) => {
        const {userId , entity} = this.props
        this.setState({ loading: true });
        this.props.DeleteList({ids:e})
        .then( async ()=>{
          await this.props.fetchLists({
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name' , order: 'ASC' },
            filter: {userId,entity},
          })
          message.success('List Deleted');
          this.setState({ loading: false , disabled:true ,selectedRowKeys:[]});
        }).catch(()=>{
          message.error('List not Deleted');
        });
     }
     cancel = (e) => {
          message.error('Canceled');
          this.setState({ disabled:true ,selectedRowKeys:[]});
      }

     ShowList = async (id) => {
         let list = await this.props.fetchOneList({id})
         this.setState({list},()=>{
           this.toggleModal("showvisible")
         })
     }
     EditList = async (id) => {
        let list = await this.props.fetchOneList({id})
        this.setState({list},()=>{
          this.toggleModal("editvisible")
        })
     }
     StoreSeeds = async (id) => {
      let list = await this.props.fetchOneList({id})
      this.setState({list},()=>{
        this.toggleModal("storeSeedvisible")
      })
   }
      
  render() {
    const columns = [
      { title: 'List Name', dataIndex: 'name', key: 'name'},
      { title: 'Isp', dataIndex: 'isp', key: 'isp' },
      {
        title: 'UserName', dataIndex: '', key: 'x', render: ({user}) => ( 
        <span>
          <Tag color='geekblue'> {user ? user.loginu : ''} </Tag>
          <Tag color='blue'> {user ? user.entity?.name : ''} </Tag>
        </span>
        )
      },
      { title: 'Seeds Count', dataIndex: 'count', key: 'count'},
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' , render: (createdAt) => moment(createdAt).format('DD-MM-YYYY hh:mm:ss') },
      {
        title: 'Action', dataIndex: '', key: 'x', render: ({id}) => (
          <span>
            <Button size="large"  shape="circle" icon={<EditTwoTone />} onClick={(e)=>{this.EditList(id)}} />
            <Divider type="vertical" />
            <Button size="large"  shape="circle" icon={<PlusCircleTwoTone twoToneColor="#52c41a" />}  onClick={(e)=>{this.StoreSeeds(id)}} />
            <Divider type="vertical" />
            <Button size="large"  shape="circle" icon={<EyeTwoTone />} onClick={(e)=>{this.ShowList(id)}} />
          </span>
        ),
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
          title="Lists"
          extra={[
              <Button size="large"  key={0} type="primary" shape="round" icon={<PlusCircleFilled />} onClick={()=> this.toggleModal("addvisible")} >New List</Button>,
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
       
        {this.state.addvisible && <AddList toggleModal={this.toggleModal} addvisible={this.state.addvisible} />}
        {this.state.storeSeedvisible && <StoreSeeds list={this.state.list} toggleModal={this.toggleModal} storeSeedvisible={this.state.storeSeedvisible} />}
        {this.state.editvisible && <EditList list={this.state.list} toggleModal={this.toggleModal} editvisible={this.state.editvisible} />}
        {this.state.showvisible && <ShowListDetails list={this.state.list} toggleModal={this.toggleModal} showvisible={this.state.showvisible} />}
        <Table
          style={{marginTop:"1.5rem"}}
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.props.lists}
          rowSelection={rowSelection}
          loading={this.state.loading}
          onChange={this.handleTableChange}/>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists,
    userId: state.userAuth.user.userId,
    entity: state.userAuth.user.entity,
  };
}

export default connect(mapStateToProps,{ fetchLists , fetchSeeds  , loadLists  , DeleteList , fetchOneList , toggleIsLoading })(Lists)