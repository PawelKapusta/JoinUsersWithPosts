const axios = require('axios');

const http = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });

module.exports = {
  http: http,
};
