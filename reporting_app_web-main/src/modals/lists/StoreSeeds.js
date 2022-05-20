import React, { useState } from 'react'
import { Modal,Form , Input,message  ,Tooltip} from 'antd';
import { useDispatch , useSelector } from "react-redux";
import { QuestionCircleOutlined , SaveFilled } from '@ant-design/icons'
import { CreateBulkSeed } from "../../store/actions/seeds";
import {fetchLists} from "../../store/actions/lists";
const { TextArea } = Input;


const StoreSeed = (props) => {

    const [form] = Form.useForm();
    const [confirmLoading,setLoadig] = useState(false)
    const dispatch = useDispatch()
    const entity = useSelector(state => state.userAuth.user.entity)
    const userId = useSelector(state => state.userAuth.user.userId)
    const handleOk = () => {
      form
      .validateFields()
      .then(values => {
      setLoadig(true)
      console.log('Received values of form: ', values);
      const { seeds } = values
      if(seeds){
        let records = seeds.split('\n').map(seed => (
          {
            email:seed.split(',')[0].trim().toLowerCase(),
            password:seed.split(',')[1],
            user:Number(userId),
            list:props.list.id,
            isp:props.list.isp,
            proxy:seed.split(',')[2],
            verificationemail:seed.split(',')[3],
            entity
          }
        ))
        dispatch(CreateBulkSeed({data:{id:props.list.id, records}}))
        .then(()=> {
           dispatch(fetchLists({
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name' , order: 'ASC' },
            filter: {userId,entity},
          }))
          form.resetFields();
          setLoadig(false)
          props.toggleModal("storeSeedvisible")
          message.success('Created successfully.')
        })
        .catch((err)=> {
          console.log(err.data.detail)
          if(err.data?.detail){
            message.error(err.data.detail)
          }else{
            message.error('Error While Storing emails')
          }
          setLoadig(false)
        })
      } 
    })
  }
    
    const handleCancel = () => {
      console.log('Clicked cancel button');
      props.toggleModal("storeSeedvisible")
    }
     
    let { storeSeedvisible } = props;
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };
    return (
    <Modal
      width={"65%"}
      title="Store Seed"
      visible={storeSeedvisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
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

        <Form.Item
          name="seeds"
          label={
            <span>
              Seeds &nbsp;
              <Tooltip title="emails should be in this format {email},{password},{ip:port}">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <TextArea placeholder="Please place your emails in this format email,password,ip:port" rows={20} /> 
        </Form.Item>
      </Form>
    </Modal>
    )
}



export default React.memo(StoreSeed)