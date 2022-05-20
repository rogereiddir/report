import React , { useState} from "react";
import Cookies from 'universal-cookie';
import jwtDecode from "jwt-decode";
import { useHistory , Redirect} from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { user_signin } from "../store/actions/user_auth";
import { setCurrentUser } from "../store/actions/user_auth";
import { UserOutlined , LockOutlined , LoginOutlined } from '@ant-design/icons'
import { Form , Input, Button , message, Modal ,Card } from "antd";

const FormItem = Form.Item;
const cookies = new Cookies();

const Login = (props) => {

  const [load, onLoad] = useState(false)
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.userAuth.isAuthenticated)
  const history = useHistory()
  const [modal, contextHolder] = Modal.useModal();
  // const error = (title,content) => {
  //     Modal.error({
  //       title,
  //       content
  //     });
  // }
  const handleSubmit = values => {   
    onLoad(true)
    dispatch(user_signin({data:values}))
    .then((res)=>{
      onLoad(false)
      console.log(res)
      message.success("")
      dispatch(setCurrentUser(jwtDecode(cookies.get('reporting_access'))))
      localStorage.setItem("uuid",jwtDecode(cookies.get('reporting_access')).userId)
      history.push('/app/processes');
    }).catch(({data})=>{
      console.log(data)
      onLoad(false)
      modal.error({
        title:data ? data.message : '',
      })
      // error(data ? data.message : '')
    })
   }
    if(isAuthenticated) {
        return <Redirect to="/app/processes" />;
     }else {
       return (
           <Card bordered={false} bodyStyle={{ padding: 40 }}>
               <Form onFinish={handleSubmit} className="login-form">
                <FormItem name="username">
                    <Input size="large" prefix={<UserOutlined style={{ fontSize: 13 }} />} placeholder="Username" />
                </FormItem>
                <FormItem name="password">
                    <Input.Password size="large" prefix={<LockOutlined style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                </FormItem>
                <FormItem>
                  <Button block loading={load} size='large' icon={<LoginOutlined />} type="primary" htmlType="submit" >
                    Log in
                  </Button>
                </FormItem>
              </Form>
              {contextHolder}
           </Card>
      );
    }
}


export default Login
