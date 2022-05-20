import React from 'react'
import {Layout , Typography , Popover , Avatar , message } from 'antd';
import { RobotOutlined , UserOutlined , LogoutOutlined } from '@ant-design/icons'
import { userLogout , setCurrentUser } from "../store/actions/user_auth";
import { clearData } from "../store/actions/utils";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const { Header  } = Layout;
const { Title  } = Typography;


const Navbar = () => {

    const dispatch = useDispatch()
    const history = useHistory()
    const username = useSelector(({userAuth}) => userAuth.user.username)
    const LogOut = () => {
      dispatch(userLogout({data:{userId:localStorage.getItem("uuid")}}))
      .then((res) => {
        localStorage.clear();
        dispatch(setCurrentUser({}));
        clearData(dispatch)
        history.push('/login');
        message.success(res.message)
        localStorage.clear()
      }).catch(()=>{
        message.error("Couldn't Log Out , Network Error")
      })
    }
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li onClick={LogOut}>
            <LogoutOutlined/>  logout
        </li>
      </ul>
    );
    
    return (
      <Header style={{backgroundColor:"#0C7EE8"}} title="WARMUP APP">
        <div style={{display:"flex" , flexDirection:"row" , flexWrap:"nowrap" ,justifyContent:"space-between", alignItems:"center" , cursor:"pointer"}}>
          <Title style={{ paddingTop:"1rem" , color:"#fff" }} level={2}> 
            <RobotOutlined size={50} data="WARMUP APP" content="WARMUP APP" />
          </Title>
          <Popover placement='bottomLeft' content={userMenuOptions} trigger="click">
           <span style={{ color:"#fff" , marginRight:".2rem" }}>{username}</span> <Avatar icon={<UserOutlined />} alt=""/>
          </Popover>
        </div>
      </Header>
    )
}


export default Navbar