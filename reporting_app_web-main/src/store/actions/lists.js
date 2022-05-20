import { message } from 'antd'
import { LOAD_LISTS } from "../actionTypes";
import { dataProvider } from "../../api/index";

export const loadLists = lists => ({
  type: LOAD_LISTS,
  lists
});

export const CreateList = (params) => {
  return () => {
    return dataProvider("CREATE", "lists/create", params)
  };
};

export const UpdateList = (params) => {
  return () => {
    return dataProvider("UPDATE", "lists/update", params)
  };
};

export const DeleteList = (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "lists/delete", params)
  };
};


export const fetchLists = (params = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name' , order: 'ASC' },
  filter: {},
}) => {
  return async (dispatch) => {
    try {
      const res = await dataProvider("GET_MANY", "lists", params);
      dispatch(loadLists(res));
    } catch (err) {
      message.error('Error While Fetching Data!!');
    }
  };
};


export const fetchOneList = (params) => {
  return dispatch => {
    return dataProvider("GET_ONE", "lists", params)
  };
};

