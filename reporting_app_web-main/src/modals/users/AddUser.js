import React, { Component } from 'react'
import { Modal , Form , Input , Select , message } from 'antd';
import { CreateUser , fetchUsers } from "../../store/actions/users";
import { connect } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
const { Option } = Select;


class AddUser extends Component {
  state = {
      confirmLoading:false,
  }
  handleOk = (values) => {
    this.setState({ confirmLoading: true });
    const { dispatch } = this.props;
    console.log('Received values of form: ', values);
    dispatch(CreateUser({data:values}))
    .then(() => dispatch(fetchUsers()))
    .then(() => {
      message.success('Created successfully.')
      this.setState({ confirmLoading: false });
      this.props.toggleAddModal()
    })
    .catch((err)=> {
      console.log(err)
      if(err?.data?.error && err?.data?.error ==="23505"){
        message.error('Login already exists.')
      }else{
        message.error('oops something is wrong')
      }
      this.setState({ confirmLoading: false });
    })      
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.props.toggleAddModal()
  }
  render() {
    let {addvisible} = this.props;
    const { confirmLoading } = this.state
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    return (
    <Modal
      width={800}
      title="Add User"
      visible={addvisible}
      okText="Save"
      cancelButtonProps={{
        shape:"round",
        size:"large"
      }}
      okButtonProps={{ form:'add-user-form' ,key: 'submit',shape:"round" ,  htmlType:'submit' , icon:<SaveFilled /> , size:"large"}}
      confirmLoading={confirmLoading}
      onCancel={this.handleCancel}
    >
    <Form id='add-user-form' onFinish={this.handleOk} {...formItemLayout}>
        <Form.Item name='loginu' {...formItemLayout} label="Login">
          <Input size="large" placeholder="Please enter your User Name" />
        </Form.Item>

        <Form.Item name='password' label="Password">
          <Input.Password size="large" placeholder="Please enter your User password" />
        </Form.Item>

        <Form.Item label="Entity" name="entity">
            <Select size="large" placeholder="Please select a entity">
              {
               this.props.teams.map((team , index ) => <Option key={index} value={team.id}>{team.name}</Option>)
              }
            </Select>
        </Form.Item>

        <Form.Item name='access' label="Access" hasFeedback >
            <Select size="large" placeholder="Please select a Access">
              <Option value=""></Option>
              <Option value="IT">IT</Option>
              <Option value="Mailer">mailer</Option>
              <Option value="Team Leader">Team Leader</Option>
              <Option value="Supervisor">Supervisor</Option>
            </Select>
        </Form.Item>

        <Form.Item name='role' label="Role" hasFeedback >
            <Select size="large" placeholder="Please select a Role">
              <Option value=""></Option>
              <Option value="IT">IT</Option>
              <Option value="Mailer">mailer</Option>
              <Option value="Team Leader">Team Leader</Option>
              <Option value="Supervisor">Supervisor</Option>
            </Select>
        </Form.Item>

      </Form>
    </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams
  };
}

export default connect(mapStateToProps)(AddUser)