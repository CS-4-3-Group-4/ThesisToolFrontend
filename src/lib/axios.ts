import axios from "redaxios";

const ax = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default ax;
