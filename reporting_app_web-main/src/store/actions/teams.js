import { dataProvider } from "../../api/index";
import { LOAD_TEAMS } from "../actionTypes";
import { message } from 'antd'

export const loadTeams = teams => ({
  type: LOAD_TEAMS,
  teams
});

export const CreateTeam = (params) => {
  return () => {
    return dataProvider("CREATE", "teams/create", params)
  };
};

export const UpdateTeam = (params) => {
  return () => {
    return dataProvider("UPDATE", "teams/update", params)
  };
};

export const DeleteTeam = (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "teams/delete", params)
  };
};

export const fetchTeams = (params = {
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'name' , order: 'ASC' },
  filter: {},
}) => {
  return async dispatch => {
    try {
      const res = await dataProvider("GET_LIST", "teams", params);
      dispatch(loadTeams(res));
    } catch (e) {
      message.error('Error While Fetching Data!!');
    }
  };
};


export const fetchOneTeam = (params) => {
  return () => {
    return dataProvider("GET_ONE", "teams", params)
  };
};

