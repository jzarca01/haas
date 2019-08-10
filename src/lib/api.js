const axios = require("axios");
const { DEV_API_URL, API_URL } = require("../config/config");

const api = axios.create({
  baseURL: process.env.dev ? DEV_API_URL : API_URL
});

module.exports = { api };
