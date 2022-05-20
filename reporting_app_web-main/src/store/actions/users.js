import { dataProvider } from "../../api/index";
import { LOAD_USERS } from "../actionTypes";
import { message } from 'antd';



export const loadUsers = users => ({
    type: LOAD_USERS,
    users
});

export const CreateUser = (params) => {
  return () => {
    return dataProvider("CREATE", "users", params)
  };
};

export const UpdateUser = (params) => {
  return () => {
    return dataProvider("UPDATE", "users", params)
  };
};

export const SyncUsers = (params) => {
  return dataProvider("SYNC", "sync/users", params)
};

export const getRemoteUsers = (params) => {
  return dataProvider("GET_MANY", "sync/getusers", params)
}

export const DeleteUser = (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "users", params)
  };
};

export const fetchUsers = (params = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name' , order: 'ASC' },
  filter: {},
}) => {
  return async dispatch => {
    try {
      const res = await dataProvider("GET_LIST", "users", params);
      dispatch(loadUsers(res));
    } catch (e) {
      message.error('Error Fetching Data!!');
    }
  };
};


export const fetchOneUser = (params) => {
  return () => {
    return dataProvider("GET_ONE", "users", params)
  };
};