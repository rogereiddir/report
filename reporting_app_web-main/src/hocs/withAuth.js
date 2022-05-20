import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({ component: Component,isAuthenticated,page, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return(
          <Component {...props} />
          )
        } else {
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
export default ProtectedRoute