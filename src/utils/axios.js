import axios from "axios";

    const axiosInstance = axios.create({
    withCredentials: true,
    proxy: {
        host: `https://demo.shikshalokam.org`,
        //port: 8000
    },
    params: {}, // do not remove this, its added to add params later in the config
    });

export default axiosInstance;
