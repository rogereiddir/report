import React, { useState } from 'react'
import { Modal , Form , Input  , message } from 'antd';
import { SaveFilled } from '@ant-design/icons'
import { CreateTeam , fetchTeams} from "../../store/actions/teams";
import { useDispatch } from 'react-redux';

const AddTeam = (props) => {

    const [confirmLoading,setLoadig] = useState(false)
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const  handleOk = () => {
        setLoadig(true)
        form
        .validateFields()
        .then(values => {
          console.log('Received values of form: ', values);
          dispatch(CreateTeam({data:values}))
          .then(async()=> {
            dispatch(fetchTeams())
            setLoadig(false)
            props.toggleModal('addTeamVisible')
            message.success('Created successfully.')
          })
          .catch((err)=> {
            message.error('something is wrong')
            setLoadig(false)
          })
        })
    }
    const handleCancel = () => {
      console.log('Clicked cancel button');
      props.toggleModal('addTeamVisible')
    }
    let {addTeamVisible} = props;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    return (
    <Modal
      width={800}
      title="Add Team"
      visible={addTeamVisible}
      onOk={handleOk}
      okText="Save"
      cancelButtonProps={{
        shape:"round",
        size:"large"
      }}
      okButtonProps={{
        icon:<SaveFilled />,
        shape:"round",
        size:"large"
      }}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
    <Form form={form} {...formItemLayout}>
        <Form.Item name="name" {...formItemLayout} label="Name">  
           <Input size="large" placeholder="Name" />
        </Form.Item>
    </Form>
    </Modal>
    )
}
export default AddTeam