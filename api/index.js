const { http } = require('../lib/axios.js');

/**
 * Fetches data from a given URL API endpoint.
 * @param [{string}] url
 */
const getUsersAndPosts = async () => {
  const usersPromise = http.get('/users');
  const postsPromise = http.get('/posts');
  return await Promise.all([usersPromise, postsPromise]).then((response) => response);
};

module.exports = {
  getUsersAndPosts: getUsersAndPosts,
};
