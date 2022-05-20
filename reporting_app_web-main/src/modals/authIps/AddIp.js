import React, { useState, useEffect } from 'react'
import { Modal , Form , Select , Input , message  } from 'antd';
import { useDispatch , useSelector } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchIps , CreateIp } from "../../store/actions/authorized";
import { fetchLists } from "../../store/actions/lists";

const { Option } = Select;


const AddIp = (props) => {

    const [form] = Form.useForm();
    const [confirmLoading,setLoadig] = useState(false)
    const dispatch = useDispatch()
    const teams = useSelector(state => state.teams)
    const entity = useSelector(state => state.userAuth.user.entity)
    const userId = useSelector(state => state.userAuth.user.userId)
    useEffect(()=>{
      dispatch(fetchLists({
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name' , order: 'ASC' },
        filter: {userId,entity},
      }))
    },[dispatch ,entity, userId])
    const onfinish = () => {
      form
      .validateFields()
      .then(values => {
      console.log(values)
      setLoadig(true)
      dispatch(CreateIp({data:{...values}}))
      .then(()=> {
        dispatch(fetchIps())
        form.resetFields();
        props.toggleModal("addvisible")
        message.success('Created successfully.')
        setLoadig(false)
      })
      .catch(()=> {
        console.log()
        message.error('oops something is wrong')
        setLoadig(false)
      })
    })
  }
    
  const handleCancel = () => {
    console.log('Clicked cancel button');
    props.toggleModal("addvisible")
  }
    
    let { addvisible } = props;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
    <Modal
      style={{borderRadius:"10%"}}
      width={800}
      title="ADD IP"
      visible={addvisible}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      onOk={onfinish}
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
    >
    <Form initialValues={{ unread:false , open: false , inbox: true , important: false , starred: false }} form={form} {...formItemLayout}>
        <Form.Item label="Entity" name="entity">
            <Select placeholder="Please select a entity">
              {
               teams.map((team , index ) => <Option key={index} value={team.id}>{team.name}</Option>)
              }
            </Select>
        </Form.Item>
        <Form.Item name="ip" {...formItemLayout} label="IP">  
           <Input placeholder="IP" />
        </Form.Item>
        <Form.Item name="type" label="Type">
            <Select placeholder="Please select a type">
               <Option key={1} value={"Server"}>{"Server"}</Option>
               <Option key={2} value={"Local"}>{"Local"}</Option>
            </Select>
        </Form.Item>
        <Form.Item name="note" label="Note">
           <Input placeholder="note" />
        </Form.Item>
      </Form>
    </Modal>
    )
}



export default React.memo(AddIp)