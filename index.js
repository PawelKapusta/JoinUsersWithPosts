const { getUsersAndPosts } = require('./api/index');
const { countElements } = require('./utils.js');
const haversine = require('haversine'); // Library that is using haversine formula (https://en.wikipedia.org/wiki/Haversine_formula) to calculate distance between two points on a sphere given their longitudes and latitudes

/**
 * @typedef [{Array<Object<string, Object<string, (string|Object<string, string>)>}] Users
 * @typedef [{Array<Object<string, (string|number)>>}] Posts
 * @typedef [{Array<Object<string, Object<string, (string|Object<string, (string|Array<Posts>)>)>}] UsersPosts
 */

/**
 * Join users with their posts
 * @param {Array} users
 * @param {Array} posts
 * @returns {Array} UsersPosts
 */
const joinUsersWithPosts = (users, posts) => {
  const connectUsersWithPosts = {};

  posts.forEach((post) => {
    const { userId } = post;

    if (!connectUsersWithPosts.hasOwnProperty(userId)) {
      connectUsersWithPosts[userId] = [];
    }

    connectUsersWithPosts[userId].push(post);
  });

  return users.map((user) => ({
    ...user,
    posts: connectUsersWithPosts[user.id] || [],
  }));
};

/**
 * List each user with number of their posts
 * @param {Array} usersPosts
 */
const postsPerUser = (usersPosts) =>
  usersPosts.forEach((user) => console.log(`${user.name} napisał(a) ${user.posts.length} postów`));

/**
 * Finds duplicated titles in posts array
 * @param {Array<Object<string, (int|string)>} posts - A posts array
 * @returns {Array<string>} An array with duplicated titles.
 */
const getDuplicatedTitles = (posts) => {
  const titles = posts.map((post) => post.title);
  const titleCount = countElements(titles);
  return Object.keys(titleCount).filter((title) => titleCount[title] > 1);
};

/**
 * Finds the nearest neighbour and distance to that neighbour.
 * @param {Users} users - An users array
 * @returns {Object<string, Object<string, number>>} An object with users and their nearest neighbour
 */
const findNearestNeighbour = (users) => {
  const distances = {};

  users.forEach(
    ({ id }) =>
      (distances[id] = {
        id: 0,
        value: Number.POSITIVE_INFINITY,
      }),
  );

  for (let i = 0; i < users.length - 1; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const userA = users[i],
        userB = users[j];
      const currentDistance = Math.round(
        haversine(
          { latitude: userA.address.geo.lat, longitude: userA.address.geo.lng },
          { latitude: userB.address.geo.lat, longitude: userB.address.geo.lng },
          { unit: 'meter' },
        ),
      );

      if (currentDistance < distances[userA.id].value) {
        distances[userA.id] = {
          id: userB.id,
          value: currentDistance,
        };
      }

      if (currentDistance < distances[userB.id].value) {
        distances[userB.id] = {
          id: userA.id,
          value: currentDistance,
        };
      }
    }
  }

  return distances;
};

/**
 * Prints the nearest neighbour for each user by userId.
 * @param {Object<string, Object<string, number>>} distances - An object with each user and his the nearest neighbour.
 */
const printNearestNeighbour = (distances) =>
  Object.entries(distances).forEach(([id, neighbour]) =>
    console.log(
      `Uzytkownik z ${id}: mieszka najblizej ${neighbour.id}, odległość: ${neighbour.value}`,
    ),
  );

/**
 * Main program:
 * 1. Merge users with posts.
 * 2. Count posts by users.
 * 3. Find duplicated titles in posts.
 * 4. Find the nearest neighbour for each user.
 */
const main = async () => {
  const all = await getUsersAndPosts();
  const users = all[0].data;
  const posts = all[1].data;

  const usersWithPosts = joinUsersWithPosts(users, posts);
  postsPerUser(usersWithPosts);

  const duplicatedTitles = getDuplicatedTitles(posts);
  console.log(
    `\nLista zduplikowanych tytułów: ${duplicatedTitles.length > 0 ? duplicatedTitles : 'Brak'} \n`,
  );

  const distances = findNearestNeighbour(users);
  printNearestNeighbour(distances);
};

main();

/*
Export functions for testing
 */
module.exports._test = {
  joinUsersWithPosts: joinUsersWithPosts,
  postsPerUser: postsPerUser,
  getDuplicatedTitles: getDuplicatedTitles,
  findNearestNeighbour: findNearestNeighbour,
  printNearestNeighbour: printNearestNeighbour,
};
