import React, { useEffect, useState } from 'react'
import { Modal,Form, Select , Input , message } from 'antd';
import { useDispatch , useSelector} from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchIps  , UpdateIP } from "../../store/actions/authorized";
const { Option } = Select;

const EditIp = ({ip,toggleModal,editvisible}) => {
 
    const [form] = Form.useForm();
    const [confirmLoading,setLoadig] = useState(false)
    const teams = useSelector(state => state.teams)

    const dispatch = useDispatch()

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
          setLoadig(true)
          console.log('Received values of form: ', values);
          dispatch(UpdateIP({data:{ entity:values.entity , ip:values.ip , note:values.note , type:values.type , id:ip.id }}))
          .then(() => dispatch(fetchIps())).then(()=>{
            toggleModal("editvisible")
            message.success('Created successfully.')
            setLoadig(false)
          }).catch((err)=> {
            message.error('oops something is wrong')
            setLoadig(false)          
          });
      })
    }

    useEffect(()=>{
       if(Object.keys(ip).length !== 0){
         form.setFieldsValue({
           entity:ip.entity.id,
           ip:ip.ip,
           type:ip.type,
           note:ip.note
         })
       }
    },[ip,form])

    const handleCancel = () => {
      console.log('Clicked cancel button');
      toggleModal("editvisible")
    }
     
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
      width={900}
      title={`Edit ${ip.ip}`}
      visible={editvisible}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
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
    >
     <Form form={form} {...formItemLayout}>
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


export default React.memo(EditIp)