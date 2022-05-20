import React ,{ Component } from 'react'
import { Modal , Table , Button  , message , Tag } from 'antd';
import { connect } from "react-redux";
import { getRemoteUsers , CreateUser, fetchUsers } from "../../store/actions/users";
import { UserAddOutlined } from '@ant-design/icons'


class ImportUsers  extends Component {

    state = {
      loading:true,
      users:[],
    };


   componentDidMount(){
    const { entity , functionteam } = this.props
    getRemoteUsers({filter:{entity,functionteam}}).then(({users}) => {
      this.setState({loading:false , users})
    })
   }

   createUser = (user) => {
    const { dispatch , entity , functionteam } = this.props;
    this.setState({ loading: true });
    dispatch(CreateUser({data:user}))
    .then(()=> {
      dispatch(fetchUsers())
      getRemoteUsers({filter:{entity,functionteam}}).then(({users}) => {
        this.setState({loading:false , users})
      })
    }).catch(()=> {
      message.error('something is wrong')
      this.setState({ loading: false });
    })
   }
   

   render(){

    const { users, loading } = this.state
    const columns = [
        { title: 'FirstName', dataIndex: 'firstname', key: 'firstname' },
        { title: 'LastName', dataIndex: 'firstname', key: 'firstname' },
        { title: 'Login', dataIndex: 'loginu', key: 'loginu' },
        { title: 'Actions', dataIndex: '', key: '', render: (user) => (
            <span>
               {user.imported ?  <Tag color={"green"}>IMPORTED</Tag> : <Button onClick={()=> this.createUser(user)} icon={<UserAddOutlined />} >Import</Button>}
            </span>
           )
        },
    ];

    return (
        <>
        <Modal
        width={"70%"}
        title="Import Users"
        visible={this.props.importuser}
        onCancel={() => this.props.toggleImportModal()}
        footer={false}>
            <Table
            style={{marginTop:"1.5rem"}}
            rowKey={record => record.id}
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 10 }}
            loading={loading}
            />
        </Modal>
        </>
        )
   }
}

export default connect()(ImportUsers)