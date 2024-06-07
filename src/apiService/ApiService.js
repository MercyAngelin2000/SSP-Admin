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
// export const getUserList = async (skip,limit)=> {
//     try {
//       const response = await axiosInstance.get(`/region/?skip=${skip}&limit=${limit}`);
//       return response
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   };