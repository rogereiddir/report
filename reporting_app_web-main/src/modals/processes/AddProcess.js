import React, { useState, useEffect } from 'react'
import { Modal, Form , Select, Switch , Button , Input , message , Divider, Col , Row, Upload } from 'antd';
import { useDispatch , useSelector } from "react-redux";
import { SaveFilled , UploadOutlined } from '@ant-design/icons'
import { fetchProcesses , CreateProcess , loadProcesses } from "../../store/actions/processes";
import { fetchLists } from "../../store/actions/lists";
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;


const props = {
  beforeUpload: file => {
    console.log(file.type)
    if (file.type.toLowerCase() !== 'application/vnd.ms-excel') {
      message.error(`${file.name} is not an .csv file`);
    }
    return false
  }
};

const AddCompain = ({toggleModal ,addvisible }) => {

    const [form] = useForm();
    const [confirmLoading,setLoading] = useState(false)
    const [image, setCategoryImage] = useState(null)
    const [show, onShowUpload] = useState(false)
    const dispatch = useDispatch()
    const lists = useSelector(state => state.lists)
    const entity = useSelector(state => state.userAuth.user.entity)
    const userId = useSelector(state => state.userAuth.user.userId)

    useEffect(()=>{
      dispatch(fetchLists({
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name' , order: 'ASC' },
        filter: {userId,entity},
      }))
     
    },[dispatch ,entity, userId, form])

    const getItemImage =   e => {
      console.log('Upload event:', e.file);
      // 
      
      switch(e.file.status){
        case "removed":
          console.log("ok")
          setCategoryImage('')
          break
        default :
          setCategoryImage(e.file)
          break
      }
      console.log('Upload event:', image);
      if (Array.isArray(e)) {
        return e;
      }
    
      return e && e.fileList;
    };


    const onChange = (value)=> {
     onShowUpload(value)
    }

    const onfinish = () => {
      form
      .validateFields()
      .then(values => {
        setLoading(true)
        const {add_contact, list , starred , open_bulk , important , inbox , open , subject , set_delete , archive , reply , verify } = values
        let actions = `${inbox?'inbox=true':'inbox=false'},${important?'important=true':'important=false'},${starred?'starred=true':'starred=false'},${open?'open=true':'open=false'},${set_delete?'set_delete=true':'set_delete=false'},${archive?'archive=true':'archive=false'},${reply?'reply=true':'reply=false'},subject=${subject},${verify?'verify=true':'verify=false'},${open_bulk ?'open_bulk=true':'open_bulk=false'},${add_contact ?'add_contact=true':'add_contact=false'}`
        console.log(actions)
        if(list){
          if(!add_contact && !open_bulk && !starred && !important && !inbox && !open && !set_delete && !archive && !reply && !verify){
            message.warning('Please select some actions')
            setLoading(false)
          }else{

            const formdata = new FormData()
            formdata.append("actions", actions);
            formdata.append("list", Number(list));
            formdata.append("entity", Number(entity));
            formdata.append("user", Number(userId));
            formdata.append("file", image);

            dispatch(CreateProcess({data:formdata}))
            .then(()=> {
              dispatch(fetchProcesses({
                filter: {userId,entity}
              })).then((proccesses)=>{
                dispatch(loadProcesses(proccesses))
                setLoading(false)
                form.resetFields();
                toggleModal("addvisible")
                message.success('Created successfully.')
              })
            }).catch((err)=> {
              console.log(err)
              setLoading(false)
              message.error(err.data? err.data.message : 'oops something is wrong')
            })
          }
        }else{
          setLoading(false)
          message.error('Please select a list',2)
        }
    })
  }
    
    const handleCancel = () => {
      console.log('Clicked cancel button');
      toggleModal("addvisible")
    }
    
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
    };

    return (
    <Modal
      width={800}
      title="Create Process"
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
      }}>
      
    <Form initialValues={{ subject:"" , unread:false , open: false , inbox: true , important: false , starred: false , archive:false }} form={form} >
        <Form.Item  label="List" name="list" labelCol={{span:2}} >
            <Select size="large" placeholder="Please select a List">
              {
               lists.map((list , index ) => <Option key={index} value={list.id}>{list.name}</Option>)
              }
            </Select>
        </Form.Item>
        <Form.Item name="subject"  label="Subject" labelCol={{span:2}}>  
           <Input size="large" placeholder="Mail Subject" />
        </Form.Item>
        
        <Divider />
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
            <Switch onChange={onChange} />
          </Form.Item>
          
         </Col>
        </Row>   
        <Row>
          {
            show ? 
            (<Form.Item
              name="file"
              label="Upload (.csv)"
              valuePropName="fileList"
              getValueFromEvent={getItemImage}>
              <Upload
                  listType="picture"
                  accept="application/vnd.ms-excel"
                  className="avatar-uploader"
                  {...props}>
                    <Button icon={<UploadOutlined />} >
                      Upload .csv file
                    </Button>
                </Upload>
            </Form.Item>) : null
          }     
        </Row>
        
      </Form>
    </Modal>
    )
}



export default React.memo(AddCompain)