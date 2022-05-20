import React, { useState ,useEffect } from 'react'
import { Modal , Select  ,  Form , Input , message} from 'antd';
import { useDispatch , useSelector } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchLists  , UpdateList  } from "../../store/actions/lists";
const {Option} = Select


const EditList = ({list , toggleModal , editvisible}) => {

    const [form] = Form.useForm();
    const [confirmLoading , setLoading] = useState(false)
    const dispatch = useDispatch()
    const entity = useSelector(state => state.userAuth.user.entity)
    const userId = useSelector(state => state.userAuth.user.userId)
    const handleOk = () => {
      form
      .validateFields()
      .then(values => {
        setLoading(true)
        console.log('Received values of form: ',values);
        dispatch(UpdateList({data:{...values,id:list.id}}))
        .then(async()=> {
         return dispatch(fetchLists({
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name' , order: 'ASC' },
            filter: {userId,entity},
          }))
        }).then(()=>{
          form.resetFields();
          setLoading(false)
          toggleModal("editvisible")
          message.success('Created successfully.')
        })
        .catch((err)=> {
          message.error('oops something is wrong')
          setLoading(false)
        })
      })
    }
    
    useEffect(() => {
      if(Object.keys(list).length !== 0){
        form.setFieldsValue({
          name:list.name,
          isp:list.isp
        })
      }
      return () => {
        return "ok"
      }
    }, [list,form])
    
    const  handleCancel = () => {
        console.log('Clicked cancel button');
        toggleModal("editvisible")
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
    <Modal
      width={800}
      title="Edit List"
      visible={editvisible}
      onOk={handleOk}
      okText="Save"
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
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
    <Form form={form}  {...formItemLayout}>
        <Form.Item name="name" {...formItemLayout} label="Name">
          <Input size="large" autoFocus={true} placeholder="Please enter List Name" />
        </Form.Item>
        <Form.Item name="isp" label="Isp" >
          <Select size="large" showSearch={true} placeholder="Please select an ISP">
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


export default React.memo(EditList)