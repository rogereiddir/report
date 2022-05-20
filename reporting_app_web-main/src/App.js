import React from 'react';
import { Switch , Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from 'antd';
import ProtectedRoute from './hocs/withAuth'
import AdminProtectedRoute from './hocs/withAuthAdmin'
import ProcessesList from './components/processes';
import IpsList from './components/authorizedIps';
import Lists from './components/lists';
import Dashboard from './components/dashboard';
import UsersList from './components/users';
import TeamList from './components/teams';
import SideMenu from './components/sidemenu';


const { Content, Footer } = Layout;
const App = () => {

  const isAuthenticated = useSelector(state =>state.userAuth.isAuthenticated)
  const role = useSelector(state => state.userAuth.user.role)

  return (
    <Layout className="basic-layout">
      <SideMenu/>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
            <Switch> 
              <ProtectedRoute  isAuthenticated={isAuthenticated} role={role} path="/app/dashboard" component={Dashboard} />
              <ProtectedRoute isAuthenticated={isAuthenticated} role={role}  path="/app/processes" component={ProcessesList}/>
              <ProtectedRoute isAuthenticated={isAuthenticated} role={role}  path="/app/lists" component={Lists}/>
              <AdminProtectedRoute isAuthenticated={isAuthenticated} role={role}  path="/app/teams" component={TeamList}/>
              <AdminProtectedRoute isAuthenticated={isAuthenticated} role={role}  path="/app/authorization" component={IpsList}/>
              <AdminProtectedRoute isAuthenticated={isAuthenticated} role={role}  path="/app/users" component={UsersList}/>
              <Redirect from="/app" to="/app/processes" /> 
            </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           ©2021
        </Footer>
        </Layout>
     </Layout>
  );
}

export default App
