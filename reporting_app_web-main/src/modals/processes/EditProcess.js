import React, { useState , useEffect } from 'react'
import { Modal , Form , Switch , Input , message , Row , Col } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchProcesses  , UpdateProcess , loadProcesses } from "../../store/actions/processes";

const EditCompain = ({process , toggleModal , editvisible}) => {
 
    const [form] = Form.useForm();
    const [confirmLoading,setLoading] = useState(false)
    const entity = useSelector(state => state.userAuth.user.entity)
    const userId = useSelector(state => state.userAuth.user.userId)
    const dispatch = useDispatch()

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
          setLoading(true)
          console.log('Received values of form: ', values);
          const {add_contact, starred , open_bulk , important , inbox , open , subject , set_delete , archive , reply , verify } = values
          if(!add_contact && !open_bulk && !starred && !important && !inbox && !open && !set_delete && !reply && !verify){
            message.warning('Please select some actions')
            setLoading(false)
          }else{
            let actions = `${inbox?'inbox=true':'inbox=false'},${important?'important=true':'important=false'},${starred?'starred=true':'starred=false'},${open?'open=true':'open=false'},${set_delete?'set_delete=true':'set_delete=false'},${archive?'archive=true':'archive=false'},${reply?'reply=true':'reply=false'},subject=${subject},${verify?'verify=true':'verify=false'},${open_bulk ?'open_bulk=true':'open_bulk=false'},${add_contact ?'add_contact=true':'add_contact=false'}`
            dispatch(UpdateProcess({data:{ actions , id:process.id}}))
            .then(()=> dispatch(fetchProcesses({
              filter: {userId,entity}
            }))).then(processes =>  {
              dispatch(loadProcesses(processes))
              setLoading(false)
              toggleModal("editvisible")
              message.success('Edited successfully.')
            }).catch(()=> {
              message.error('oops something is wrong')
              setLoading(false)          
            })
          }
      })
    }

    useEffect(() => {
      if(Object.keys(process).length !== 0){
        const actionsList = Object.keys(process).length > 0 ? process.actions.split(',').map((action)=> {
          const type = action.split('=')[0]
          const value = action.split('=')[1] === "true" ? true : action.split('=')[1] === "false" ? false : action.split('=')[1]
          return  [type , value ]
       }) : []
       const actionsObj = Object.fromEntries(actionsList)

        form.setFieldsValue({
          subject:process.subject,
          ...actionsObj
        })
      }
    }, [process,form])

    const handleCancel = () => {
      console.log('Clicked cancel button');
      toggleModal("editvisible")
    }
     
    if( Object.keys(process).length > 0 ){
      const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      };
    return (
      <Modal
      width={900}
      title={`Edit Process  ${process.name}`}
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
    <Form  form={form}>
        <Row align="middle">
        <Col span={12}>
          <Form.Item name="subject" {...formItemLayout} label="Subject">  
            <Input size="large" placeholder="Mail Subject" />
          </Form.Item>
        </Col>
        </Row>
        <Row align="middle" justify="space-between">
         <Col span={12}>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="open" label="Open">
              <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="open_bulk" label="Open Bulk">
              <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout}  valuePropName="checked"  name="inbox" label="Move To Inbox">
              <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout}  valuePropName="checked"  name="archive" label="Archive">
              <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="reply" label="Reply">
            <Switch />
          </Form.Item>
         </Col>
         <Col span={12}>
         <Form.Item  {...formItemLayout} valuePropName="checked"  name="important" label="Mark as Important">
            <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="starred" label="Mark as Starred">
              <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="set_delete" label="Delete">
            <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout} valuePropName="checked"  name="verify" label="Verify">
            <Switch />
          </Form.Item>
          <Form.Item  {...formItemLayout}  valuePropName="checked"  name="add_contact" label="Import Contact">
            <Switch />
          </Form.Item>
         </Col>
        </Row> 
      </Form>
    </Modal>
    )
  }
  return null
}


export default React.memo(EditCompain)