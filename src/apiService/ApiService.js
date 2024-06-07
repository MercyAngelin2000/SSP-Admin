import {axiosInstance} from "./Authentication";

//login API
export const loginAPI = async (data)=> {
  try {
    const response = await axiosInstance.post(`/users/login/`, data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

//Dashboard API
export const regionCountAPI = async ()=> {
    try {
      const response = await axiosInstance.get(`/region/regioncounts/`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

//Header API
export const getCurrentUser = async ()=> {
    try {
      const response = await axiosInstance.get(`/users/currentuser/`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

//Region API
export const getRegionListAPI = async (skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/region/?skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getRegionUserListAPI = async ()=> {
    try {
      const response = await axiosInstance.get(`/region/regionusers`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const addUpdateRegionAPI = async (method,url,data)=> {
    try {
        if(method === "PUT"){
            const response = await axiosInstance.put(url,data);
            return response
        }
        else if(method === "POST"){
            const response = await axiosInstance.post(url,data);
            return response
        }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getSingleRegionAPI = async (id)=> {
    try {
      const response = await axiosInstance.get(`/region/regionbyid/?region_id=${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const deleteRegionAPI = async (id)=> {
    try {
      const response = await axiosInstance.delete(`/region/${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const searchRegionAPI = async (data,skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/region/search/?value=${data}&skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const deleteRegionUserAPI = async (id)=> {
    try {
      const response = await axiosInstance.delete(`/region/regionusers/${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

//Region User API
export const getUserListAPI = async (skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/users/users/?user_type=region&skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getRoleDataAPI = async ()=> {
    try {
      const response = await axiosInstance.get(`/users/roles/`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const addUpdateUserAPI = async (method,url,data)=> {
    try {
        if(method === "PUT"){
            const response = await axiosInstance.put(url,data);
            return response
        }
        else if(method === "POST"){
            const response = await axiosInstance.post(url,data);
            return response
        }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const deleteUserAPI = async (id)=> {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

//Corporate API
export const getCorporateListAPI = async (skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/corporate/?skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getCorporateUserListAPI = async ()=> {
    try {
      const response = await axiosInstance.get(`/corporate/corporateusers`);
      return response  
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const addUpdateCorporateAPI = async (method,url,data)=> {
    try {
        if(method === "PUT"){
            const response = await axiosInstance.put(url,data);
            return response
        }
        else if(method === "POST"){
            const response = await axiosInstance.post(url,data);
            return response
        }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getSingleCorporateAPI = async (id)=> {
    try {
      const response = await axiosInstance.get(`/corporate/corporatebyid/?corporate_id=${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const deleteCorporateAPI = async (id)=> {
    try {
      const response = await axiosInstance.delete(`/corporate/${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const searchCorporateAPI = async (data,skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/corporate/search/?value=${data}&skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

//Corporate User API
export const getcorporatUserListAPI = async (skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/users/users/?user_type=corporate&skip=${skip}&limit=${limit}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const getcorporatRoleAPI = async (skip,limit)=> {
    try {
      const response = await axiosInstance.get(`/users/roles/`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const addUpdateCorporateUserAPI = async (method,url,data)=> {
    try {
        if(method === "PUT"){
            const response = await axiosInstance.put(url,data);
            return response
        }
        else if(method === "POST"){
            const response = await axiosInstance.post(url,data);
            return response
        }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

export const deleteCorporateUserAPI = async (id)=> {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };


