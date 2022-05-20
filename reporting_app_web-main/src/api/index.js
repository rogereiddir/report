import axios from "axios";
import { stringify } from 'query-string';
import { configureStore } from "../store"
import { clearData } from "../store/actions/utils";
import { setCurrentUser , userLogout } from "../store/actions/user_auth";
import { message } from "antd";

const store = configureStore();
let transport = axios.create({
  withCredentials: true
})


export function dataProvider(type , path , params) {
  let url ='';
  let method ='';
  let data='';
  switch(type){
    case "GET_LIST": {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([
                (page - 1) * perPage,
                page * perPage - 1,
            ]),
            filter: JSON.stringify(params.filter),
        };
        url = `${path}?${stringify(query)}`;
        method = 'GET';
        break;
    }
    case "GET_ONE":
        url = `${path}/${params.id}`;
        method = 'GET';
        break;
    case "GET_LIST_SEEDS":
        url = `${path}/${params.list}`;
        method = 'GET';
        break;
    case "GET_LIST_PROC":
        url = `${path}/${params.proc}`;
        method = 'GET';
        break;
    case "START":
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    case "GET_MANY":{
        const query = {
            filter: JSON.stringify(params.filter),
        };
        url = `${path}?${stringify(query)}`;
        method = 'GET';
        break;
    }
    case "CREATE":
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    case "SYNC":
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    case "AUTH":
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    case "LOGOUT": {
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    } 
    case "REFRESHING_TOKEN": {
        url = `${path}`;
        method = 'POST';
        data = params.data;
        break;
    } 
    case "UPDATE":
        url = `${path}/${params.data.id}`;
        method = 'PUT';
        data = params.data;
        break;
    case "DELETE":
        url = `${path}/${params.id}`;
        method = 'DELETE';
        break;
    case "DELETE_MANY":
        const query = {
            filter: JSON.stringify({ ...params }),
        };
        url = `${path}?${stringify(query)}`;
        method = 'DELETE';
        break;
    case "GET_MANY_REFERENCE": {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([
                (page - 1) * perPage,
                page * perPage - 1,
            ]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        url = `${path}?${stringify(query)}`;
        method = 'GET';
        break;
    }
    default:
        throw new Error(`Unsupported Data Provider request type ${type}`);
  }


  return new Promise((resolve, reject) => {
    return transport[method.toLowerCase()](`/api/v1/${url}`, data)
      .then(res => {
        // console.log(res.data)
        return resolve(res.data);
      })
      .catch(err => {
          if(err.response.statusText === "Forbidden"){
            console.log("Forbidden")
            store.dispatch(userLogout({data:{userId:localStorage.getItem("uuid")}}))
            .then((res)=>{
              clearData(store.dispatch)
              store.dispatch(setCurrentUser({}));
              message.success(res.message)
              window.location = '/app/login'
            })
          }
        //   console.log(err.response)
        return reject(err.response);
      });
  });
}
