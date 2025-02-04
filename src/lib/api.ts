import axios from "axios"

const api = axios.create({
  baseURL: "https://adimtech.com.ly/zajil/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    language: "ar"
  }
})

export default api
