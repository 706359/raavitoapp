const { default: axios } = require("axios");

export const axios_ = axios.create({
  baseURL: "http://192.168.1.18:5050/api/",
});
