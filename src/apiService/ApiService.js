import {axiosInstance} from "./Authentication";

//post,put
// export const addUpdateAPI = async (method,url,data )=> {
//     try {
//         if(method === "PUT"){
//             const response = await axiosInstance.put(url,data);

//             return response
//         }
//         else if(method === "POST"){
//             const response = await axiosInstance.post(url,data);
//             return response
//         }
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   };


export const addUpdateAPI = async (method, url, data = {}) => {
  try {
      // Check if the data is an instance of FormData
      const isFormData = data instanceof FormData;

      // Configure headers dynamically based on the data type
      const headers = {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      };

      // Set up the request configuration
      const config = {
          method: method,
          url: url,
          data: isFormData ? data : JSON.stringify(data),
          headers: headers,
      };

      // Make the request using axiosInstance
      const response = await axiosInstance(config);
      return response;
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
