import {axiosInstance} from "./Authentication";

//post,put
export const addUpdateAPI = async (method,url,data)=> {
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
//get
export const getAPI = async (url)=> {
    try {
      const response = await axiosInstance.get(url);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
//delete
export const deleteAPI = async (url)=> {
    try {
      const response = await axiosInstance.delete(url);
      return response
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
