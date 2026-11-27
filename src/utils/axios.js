import axios from "axios"
import env from "./env"
import { attachAuthInterceptors } from "../auth/authInterceptor"

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: env.LOCAL_PROXY(),
  params: {},
});

attachAuthInterceptors(axiosInstance)
export default axiosInstance;
