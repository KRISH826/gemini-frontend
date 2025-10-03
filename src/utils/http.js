import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_PORT_DEV,
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
    }
})

export default http;
