import React from "react";
import { Route, Redirect } from "react-router-dom";

export const AdminProtectedRoute = ({ component: Component , isAuthenticated , role , access , ...rest}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated && role === "IT") {
          return(
           <Component {...props} />     
          )
        } else if(isAuthenticated) {

        }else{
          return (
            <Redirect
              to={{
                pathname: "/app/login",
                state: { from: props.location }
              }}
            />
          );
        }
      }}
    />
  );
};

export default AdminProtectedRoute