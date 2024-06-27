import axios from "axios";
import Swal from "sweetalert2";

const apiUrl = process.env.REACT_APP_BASE_URL
console.log(process.env.REACT_APP_BASE_URL)
export const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        // 'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === 401) {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.detail,
            });
            setTimeout(() => {
                localStorage.removeItem('access-token');
                window.location.href = '#/login';
            }, 1500);
        }
        return Promise.reject(error);
    }
);
