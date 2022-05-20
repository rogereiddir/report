import React from 'react'
import { Switch , Route  ,Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from './components/login';
import ProtectedRoute from './hocs/withAuth'
import App from './App';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Col, Row } from 'antd';

export default function Main() {

    const isAuthenticated = useSelector(state => state.userAuth.isAuthenticated)
    
    return (
        <Switch>
            <Route isAuthenticated={isAuthenticated} path="/app/login" render={props => {
                return (
                    <Layout className="basic-layout">
                        <Content>
                            <Row justify="space-around" align="middle" style={{ minHeight: '100vh'}}>
                                <Col span={7}>
                                    <Login {...props} />
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                );
            }}/>
            <ProtectedRoute isAuthenticated={isAuthenticated} path="/app" component={App}/>
            <Redirect from="/" to="/app" /> 
         </Switch>
    )
}
