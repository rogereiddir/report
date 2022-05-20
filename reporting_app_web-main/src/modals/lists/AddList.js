import React, { useState } from 'react'
import { Modal , Form , Select  , Input , message} from 'antd';
import { useDispatch , useSelector } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchLists  , CreateList } from "../../store/actions/lists";
const { Option } = Select;


const AddList = (props) => {

  const [form] = Form.useForm();
  const [confirmLoading,setLoadig] = useState(false)
  const dispatch = useDispatch()
  const entity = useSelector(state => state.userAuth.user.entity)
  const userId = useSelector(state => state.userAuth.user.userId)
  const handleOk = () => {
      setLoadig(true)
      form
        .validateFields()
        .then(values => {
          form.resetFields();
          console.log('Received values of form: ', values);
          dispatch(CreateList({data:{...values ,entity, user:Number(userId)}}))
          .then(async()=> {
            await dispatch(fetchLists({
              pagination: { page: 1, perPage: 10 },
              sort: { field: 'name' , order: 'ASC' },
              filter: {userId,entity},
            }))
            setLoadig(false)
            props.toggleModal("addvisible")
            message.success('Created successfully.')
          })
          .catch((err)=> {
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
      width={800}
      title="Create List"
      visible={addvisible}
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
        <Form.Item name="name" {...formItemLayout} label="Name">
                <Input size="large" placeholder="Please enter your List Name" />
        </Form.Item>
        <Form.Item
          name="isp"
          label="Isp"
        >
            <Select size="large"  showSearch={true} placeholder="Please select an ISP">
               <Option key={1} value={"gmail"}>Gmail</Option>
               <Option key={2} value={"hotmail"}>Hotmail</Option>
               <Option key={3} value={"yahoo"}>Yahoo</Option>
               <Option key={4} value={"aol"}>Aol</Option>
            </Select>
        </Form.Item>
      </Form>
    </Modal>
    )
}

export default React.memo(AddList)