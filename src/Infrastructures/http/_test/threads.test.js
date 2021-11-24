const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'Sebuah Thread',
        body: 'Isi dari thread',
      };

      const server = await createServer(container);
      // Add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          id: 'user-123',
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding indonesia',
        },
      });

      // Action
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseThreadJson = JSON.parse(responseThread.payload);
      expect(responseThreadJson.statusCode).toEqual(201);
      expect(responseThreadJson.status).toEqual('success');
      expect(responseThreadJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'Sebuah Thread',
      };

      const server = await createServer(container);
      // Add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          id: 'user-123',
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding indonesia',
        },
      });

      // Action
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseThreadJson = JSON.parse(responseThread.payload);
      expect(responseThreadJson.statusCode).toEqual(400);
      expect(responseThreadJson.status).toEqual('fail');
      expect(responseThreadJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'Sebuah Thread',
        body: ['Isi dari thread'],
      };

      const server = await createServer(container);
      // Add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          id: 'user-123',
          username: 'dicoding',
          password: 'secret',
          fullname: 'dicoding indonesia',
        },
      });

      // Action
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseThreadJson = JSON.parse(responseThread.payload);
      expect(responseThreadJson.statusCode).toEqual(400);
      expect(responseThreadJson.status).toEqual('fail');
      expect(responseThreadJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });
});
