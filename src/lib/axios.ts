import axios from "axios";

const ax = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default ax;
