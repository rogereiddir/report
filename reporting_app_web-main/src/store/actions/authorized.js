import { dataProvider } from "../../api/index";
import { LOAD_IPS } from "../actionTypes";
import { message } from 'antd';


export const loadIps = ips => ({
  type: LOAD_IPS,
  ips
});

export const CreateIp = (params) => {
  return () => {
    return dataProvider("CREATE", "ips/create", params)
  };
};

export const SyncIPs = (params) => {
  return () => {
    return dataProvider("SYNC", "sync/authips", params)
  };
};

export const UpdateIP = (params) => {
  return () => {
    return dataProvider("UPDATE", "ips/update", params)
  };
};

export const DeleteIp= (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "ips/delete", params)
  };
};

export const fetchIps = (params = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name' , order: 'ASC' },
  filter: {},
}) => {
  return async dispatch => {
    try {
      const res = await dataProvider("GET_LIST", "ips", params);
      dispatch(loadIps(res));
    } catch (err) {
      message.error('Error While Loading IPS')
    }
  };
};


export const fetchOneIp = (params) => {
  return dispatch => {
    return dataProvider("GET_ONE", "ips", params)
  };
};

