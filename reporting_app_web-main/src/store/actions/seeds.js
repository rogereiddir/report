import { dataProvider } from "../../api/index";
import { LOAD_SEEDS } from "../actionTypes";
import { message } from 'antd';


export const loadSeeds = seeds => ({
  type: LOAD_SEEDS,
  seeds
});

export const CreateSeed = (params) => {
  return () => {
    return dataProvider("CREATE", "seeds/create", params)
  };
};

export const CreateBulkSeed = (params) => {
  return () => {
    return dataProvider("CREATE", "seeds/bulk_create", params)
  };
};

export const DeleteSeed = (params) => {
  return () => {
    return dataProvider("DELETE_MANY", "seeds/delete", params)
  };
};

export const fetchOneSeed = (params) => {
  return () => {
    return dataProvider("GET_ONE", "seeds", params)
  };
};

export const fetchListSeeds = (params) => {
  return async dispatch => {
    try {
      const seeds = await dataProvider("GET_LIST_SEEDS", "seeds", params);
      dispatch(loadSeeds(seeds));
    } catch (e) {
      message.error('Error While Fetching Data!!');
    }
  };
};

export const fetchSeedsLogs = (params) => {
  return () => {
    return dataProvider("GET_LIST_SEEDS", "results", params)
  };
};

export const fetchSeeds = (params) => {
  return () => {
    return dataProvider("GET_LIST_SEEDS", "seeds", params)
  };
};

