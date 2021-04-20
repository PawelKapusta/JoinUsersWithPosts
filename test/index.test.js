const assert = require('chai').assert;
const _assert = require('assert');
const { _test } = require('../index');
const sinon = require('sinon');
const { countElements } = require('../utils.js');

describe('#joinUsersWithPosts()', function () {
  const users = [
    { id: 1, name: 'Monica' },
    { id: 2, name: 'Amelia' },
    { id: 3, name: 'Jerry' },
  ];
  const posts = [
    { id: 1, userId: 1, body: 'post1' },
    { id: 2, userId: 1, body: 'post2' },
    { id: 3, userId: 2, body: 'post3' },
    { id: 4, userId: 2, body: 'post4' },
  ];

  describe('Merging users and their posts', function () {
    it('Should return an array of each user his/her posts as property', function () {
      assert.deepEqual(_test.joinUsersWithPosts(users, posts), [
        {
          id: 1,
          name: 'Monica',
          posts: [
            { id: 1, userId: 1, body: 'post1' },
            { id: 2, userId: 1, body: 'post2' },
          ],
        },
        {
          id: 2,
          name: 'Amelia',
          posts: [
            { id: 3, userId: 2, body: 'post3' },
            { id: 4, userId: 2, body: 'post4' },
          ],
        },
        {
          id: 3,
          name: 'Jerry',
          posts: [],
        },
      ]);
    });
  });

  describe('Returned value type should be an array', function () {
    it('Should return an array of objects', function () {
      assert.isArray(_test.joinUsersWithPosts(users, posts));
    });
  });
});

describe('#postsPerUser()', function () {
  const users = [
    {
      id: 1,
      name: 'Monica',
      posts: [
        { id: 1, userId: 1, body: 'post1' },
        { id: 2, userId: 1, body: 'post2' },
      ],
    },
  ];

  describe('Should print users with their posts', function () {
    it("Should print user's name with number of posts written by him/her", function () {
      let spy = sinon.spy(console, 'log');
      _test.postsPerUser(users);
      const expectedResult = `Monica napisał(a) ${users[0].posts.length} postów`;

      _assert(spy.calledWith(expectedResult));
      spy.restore();
    });
  });
});

describe('#countElements()', function () {
  describe('Finding number of occurrences for every element', function () {
    const samplePosts = [
      'element_1',
      'element_1',
      'element_2',
      'element_2',
      'element_2',
      'element_4',
    ];

    it('Should return an object where we have key and value which is number of key occurrences.', function () {
      assert.deepEqual(countElements(samplePosts), { element_1: 2, element_2: 3, element_4: 1 });
    });

    it('Should return empty object if we give empty array', function () {
      const samplePosts = [];
      assert.isEmpty(countElements(samplePosts));
    });
  });
});

describe('#getDuplicatedTitles()', function () {
  const samplePosts = [
    { id: 1, title: 'duplicated_1' },
    { id: 1, title: 'duplicated_1' },
    { id: 2, title: 'duplicated_2' },
    { id: 2, title: 'duplicated_2' },
    { id: 2, title: 'duplicated_2' },
    { id: 3, title: 'title_3' },
    { id: 4, title: 'title_4' },
    { id: 5, title: 'title_5' },
  ];

  describe('Should find duplicated titles in posts array', function () {
    it('Should return an array of duplicated titles', function () {
      assert.deepEqual(_test.getDuplicatedTitles(samplePosts), ['duplicated_1', 'duplicated_2']);
    });
  });

  it('Should return empty array for given empty input', function () {
    const posts = [];
    assert.isEmpty(_test.getDuplicatedTitles(posts));
  });

  describe('Returned value type should be an array', function () {
    it('Should return an array', function () {
      assert.isArray(_test.getDuplicatedTitles(samplePosts), 'not an array');
    });
  });
});

describe('#findNearestNeighbours()', function () {
  const users = [
    {
      id: 1,
      city: 'Cracow',
      address: {
        geo: {
          lat: '50.049683',
          lng: '19.944544',
        },
      },
    },
    {
      id: 2,
      city: 'Beijing',
      address: {
        geo: {
          lat: '39.916668',
          lng: '116.383331',
        },
      },
    },
    {
      id: 3,
      city: 'Madryt',
      address: {
        geo: {
          lat: '40.416775',
          lng: '-3.703790',
        },
      },
    },
    {
      id: 4,
      city: 'Berlin',
      address: {
        geo: {
          lat: '52.520008',
          lng: '13.404954',
        },
      },
    },
  ];

  describe('Finding the nearest neighbour for each user', function () {
    it('Should return an object with id of each user and the nearest neighbour with distance value', function () {
      assert.deepEqual(_test.findNearestNeighbour(users), {
        1: {
          id: 4,
          value: 531022,
        },
        2: {
          id: 1,
          value: 7128470,
        },
        3: {
          id: 4,
          value: 1869146,
        },
        4: {
          id: 1,
          value: 531022,
        },
      });
    });
  });
});
