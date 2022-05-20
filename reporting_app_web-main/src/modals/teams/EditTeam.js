import React, { useEffect, useState } from 'react'
import { Modal , Form , Input , message } from 'antd';
import { useDispatch } from "react-redux";
import { SaveFilled } from '@ant-design/icons'
import { fetchTeams  , UpdateTeam } from "../../store/actions/teams";

const EditTeam = ({ team , toggleModal , editTeamVisible }) => {
 
    const [form] = Form.useForm();
    const [confirmLoading,setLoadig] = useState(false)

    const dispatch = useDispatch()

    const handleOk = () => {
      setLoadig(true)
      form
      .validateFields()
      .then(values => {
        console.log('Received values of form: ', values);
        dispatch(UpdateTeam({data:{id:team.id , ...values}}))
        .then(()=> {
          dispatch(fetchTeams())
          setLoadig(false)
          toggleModal("editTeamVisible")
          message.success('Created successfully.')
        })
        .catch(()=> {
          message.error('oops something is wrong')
          setLoadig(false)          
        });
      })
    }

    useEffect(() => {
      if(Object.keys(team).length !== 0){
        form.setFieldsValue({
          name:team.name,
          code:team.code,
          alias:team.alias
        })
      }
      return () => {
        return "unmounting Edit Team"
      }
    }, [team,form])

    const handleCancel = () => {
      console.log('Clicked cancel button');
      toggleModal("editTeamVisible")
    }
     
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
      width={900}
      title={`Edit Team ${team.name}`}
      visible={editTeamVisible}
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
      }}>
     <Form form={form} {...formItemLayout}>
        <Form.Item name="name" {...formItemLayout} label="Name">  
           <Input size="large" placeholder="Name" />
        </Form.Item>
      </Form>
    </Modal>
    )
}


export default React.memo(EditTeam)