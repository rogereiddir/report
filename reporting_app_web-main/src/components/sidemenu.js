import React, { useState } from 'react'
import {Layout, Menu , Avatar ,Typography , Button, message } from 'antd';
import {GoogleOutlined, UserOutlined , LogoutOutlined ,  ControlOutlined , ApartmentOutlined , FileTextOutlined , AimOutlined , UsergroupAddOutlined } from '@ant-design/icons'
import { Link , useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userLogout , setCurrentUser } from "../store/actions/user_auth";
import { clearData } from "../store/actions/utils";

const { Sider } = Layout;
const { Title } = Typography;

const SideMenu = () => {
  
    const [collapsed,setCollapsed] = useState(false)
    const role = useSelector(state => state.userAuth.user.role)
    const username = useSelector(({userAuth}) => userAuth.user.username)
    const dispatch = useDispatch()
    const history = useHistory()

    let location = useLocation()

    const onCollapse = (collapsed) => {
      setCollapsed(c => collapsed)
    }

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

    let routes = [
      {
        link : "/app/processes" ,
        name : "Processes" ,
        icon : <ControlOutlined /> ,
        roles: ["IT","Supervisor","Mailer","Delisting"]
      },
      {
        link : "/app/lists",
        name : "Lists",
        icon : <FileTextOutlined /> ,
        roles: ["IT","Supervisor","Mailer" ,"Delisting"]
      },
      {
        link : "/app/authorization",
        name : "IP authorization",
        icon : <AimOutlined/> ,
        roles: ["IT"]
      },
      {
        link : "/app/users",
        name : "Users",
        icon : <UsergroupAddOutlined /> ,
        roles: ["IT"]
      },
      {
        link : "/app/teams",
        name : "Teams",
        icon : <ApartmentOutlined /> ,
        roles: ["IT"]
      }
    ]
    let renderRoutes = (routes) => {
      return routes.map((route,index) => {
        if(route.roles.includes(role)){
        return ( 
          <Menu.Item key={route.link}>
            <Link to={`${route.link}`}>
              { route.icon }
              <span> {route.name}</span>
            </Link> 
          </Menu.Item> 
        )
        }
        return null
     }) 
    }
    return (
     <Sider
      collapsible
      breakpoint="lg"
      collapsedWidth="0"
      collapsed={collapsed}
      onCollapse={onCollapse}>
          <Link style={{color:"white"}} to="/app/" className="logo-wrapper" >
            <Title  style={{color:"white" }} level={5}><GoogleOutlined size={50} />MAIL REPORTING </Title>
          </Link>

          <div className="user-info" style={{ textAlign: 'center', marginBottom: 40 }}>
            <Avatar icon={<UserOutlined />}  size={80} />
            <Title level={2}>{username}</Title>
            <Button onClick={LogOut} icon={<LogoutOutlined />} size="small" ghost>{'Logout'}</Button>
          </div>
         <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
            {renderRoutes(routes)}
        </Menu>
    </Sider>
    )
}

export default React.memo(SideMenu)