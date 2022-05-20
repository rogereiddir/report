import { dataProvider } from "../../api/index";
import { LOAD_PROCESSES , SET_STATUS} from "../actionTypes";
import { message } from 'antd';

export const loadProcesses = processes => ({
  type: LOAD_PROCESSES,
  processes
});


export const setProcessStatus = status => ({
  type: SET_STATUS,
  status
});

export const CreateProcess = (params) => {
  return () => {
    return dataProvider("CREATE", "processes/create", params)
  };
};

export const UpdateProcess = (params) => {
  return () => {
    return dataProvider("UPDATE", "processes/update", params)
  };
};

export const DeleteProcess= (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "processes/delete", params)
  };
};

export const fetchProcesses = (params = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name' , order: 'ASC' },
  filter: {},
}) => {
  return function() {
    try {
      return dataProvider("GET_MANY", "processes", params);
    } catch (err) {
      console.log(err)
      message.error('Error Fetching Data!!');
    }
  };
};

export const fetchProcessResults = (params) => {
  return () => {
    return dataProvider("GET_LIST_PROC", "processes/results", params)
  };
};

export const fetchOneProcess = (params) => {
  return () => {
    return dataProvider("GET_ONE", "processes", params)
  };
};

