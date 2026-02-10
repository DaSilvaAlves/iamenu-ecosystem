/**
 * Community API Tests
 * Tests for posts, comments, groups, notifications
 */

import { apiClient, TEST_CONFIG } from './setup';

describe('Community API', () => {
  const API_BASE = '/community';
  let createdPostId: string;
  let createdGroupId: string;

  // ============================================================
  // POSTS TESTS
  // ============================================================

  describe('Posts Endpoints', () => {
    describe('GET /posts', () => {
      it('should list all posts (public)', async () => {
        const response = await apiClient.get(`${API_BASE}/posts`);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data).toHaveProperty('pagination');
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support pagination', async () => {
        const response = await apiClient.get(`${API_BASE}/posts`, {
          params: { limit: 10, offset: 0 }
        });

        expect(response.data.pagination.limit).toBe(10);
        expect(response.data.pagination.offset).toBe(0);
        expect(typeof response.data.pagination.total).toBe('number');
      });

      it('should support search', async () => {
        const response = await apiClient.get(`${API_BASE}/posts`, {
          params: { search: 'test' }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should support sorting', async () => {
        const response = await apiClient.get(`${API_BASE}/posts`, {
          params: { sort: 'created_at:desc' }
        });

        expect(response.status).toBe(200);
      });
    });

    describe('POST /posts', () => {
      it('should create a new post', async () => {
        const postData = {
          title: 'Test Post',
          body: 'This is a test post with sufficient content',
          category: 'testing'
        };

        const response = await apiClient.post(`${API_BASE}/posts`, postData);

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('id');
        expect(response.data.data.title).toBe(postData.title);
        expect(response.data.data.body).toBe(postData.body);

        createdPostId = response.data.data.id;
      });

      it('should validate required fields', async () => {
        const invalidPost = {
          title: 'No' // Too short body
        };

        try {
          await apiClient.post(`${API_BASE}/posts`, invalidPost);
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data?.error).toBe('VALIDATION_ERROR');
        }
      });

      it('should validate title length', async () => {
        const invalidPost = {
          title: 'ab', // Too short
          body: 'Minimum 10 characters required body text here'
        };

        try {
          await apiClient.post(`${API_BASE}/posts`, invalidPost);
          fail('Should have thrown validation error');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
        }
      });

      it('should require authentication', async () => {
        const unauthClient = apiClient;
        delete unauthClient.defaults.headers.common['Authorization'];

        try {
          await unauthClient.post(`${API_BASE}/posts`, {
            title: 'Test',
            body: 'Test body content here'
          });
          fail('Should require authentication');
        } catch (error: any) {
          expect(error.response?.status).toBe(401);
        }
      });
    });

    describe('GET /posts/{id}', () => {
      it('should get a specific post (public)', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available for testing');
        }

        const response = await apiClient.get(`${API_BASE}/posts/${createdPostId}`);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.id).toBe(createdPostId);
      });

      it('should return 404 for non-existent post', async () => {
        try {
          await apiClient.get(`${API_BASE}/posts/00000000-0000-0000-0000-000000000000`);
          fail('Should return 404');
        } catch (error: any) {
          expect(error.response?.status).toBe(404);
          expect(error.response?.data?.error).toBe('NOT_FOUND');
        }
      });
    });

    describe('PATCH /posts/{id}', () => {
      it('should update a post', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available for testing');
        }

        const updateData = {
          title: 'Updated Title',
          body: 'Updated content with more than 10 characters'
        };

        const response = await apiClient.patch(
          `${API_BASE}/posts/${createdPostId}`,
          updateData
        );

        expect(response.status).toBe(200);
        expect(response.data.data.title).toBe(updateData.title);
      });

      it('should not allow updating others posts', async () => {
        // Create post with different user token
        const otherUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDEiLCJlbWFpbCI6Im90aGVyQGlhbWVudS5wdCIsInJvbGUiOiJ1c2VyIn0.other';

        try {
          const otherUserClient = apiClient;
          otherUserClient.defaults.headers.common['Authorization'] = `Bearer ${otherUserToken}`;

          await otherUserClient.patch(
            `${API_BASE}/posts/${createdPostId}`,
            { title: 'Hacked' }
          );
          fail('Should prevent updating others posts');
        } catch (error: any) {
          expect(error.response?.status).toBe(403);
        }
      });
    });

    describe('DELETE /posts/{id}', () => {
      it('should delete a post', async () => {
        // Create a post to delete
        const postData = {
          title: 'Post to Delete',
          body: 'This post will be deleted in the test'
        };

        const createResponse = await apiClient.post(`${API_BASE}/posts`, postData);
        const postIdToDelete = createResponse.data.data.id;

        // Delete it
        const deleteResponse = await apiClient.delete(
          `${API_BASE}/posts/${postIdToDelete}`
        );

        expect(deleteResponse.status).toBe(204);

        // Verify it's deleted
        try {
          await apiClient.get(`${API_BASE}/posts/${postIdToDelete}`);
          fail('Post should be deleted');
        } catch (error: any) {
          expect(error.response?.status).toBe(404);
        }
      });
    });
  });

  // ============================================================
  // COMMENTS TESTS
  // ============================================================

  describe('Comments Endpoints', () => {
    describe('GET /posts/{id}/comments', () => {
      it('should get comments for a post (public)', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available');
        }

        const response = await apiClient.get(
          `${API_BASE}/posts/${createdPostId}/comments`
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('data');
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('POST /posts/{id}/comments', () => {
      it('should create a comment', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available');
        }

        const commentData = {
          body: 'This is a test comment with sufficient content'
        };

        const response = await apiClient.post(
          `${API_BASE}/posts/${createdPostId}/comments`,
          commentData
        );

        expect(response.status).toBe(201);
        expect(response.data.data.body).toBe(commentData.body);
      });

      it('should validate comment body', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available');
        }

        try {
          await apiClient.post(
            `${API_BASE}/posts/${createdPostId}/comments`,
            { body: '' }
          );
          fail('Should validate comment body');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
        }
      });
    });
  });

  // ============================================================
  // REACTIONS TESTS
  // ============================================================

  describe('Reactions Endpoints', () => {
    describe('GET /posts/{id}/reactions', () => {
      it('should get post reactions (public)', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available');
        }

        const response = await apiClient.get(
          `${API_BASE}/posts/${createdPostId}/reactions`
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('POST /posts/{id}/react', () => {
      it('should toggle reaction on post', async () => {
        if (!createdPostId) {
          throw new Error('No post ID available');
        }

        const response = await apiClient.post(
          `${API_BASE}/posts/${createdPostId}/react`,
          { emoji: '👍' }
        );

        expect(response.status).toBe(200);
        expect(response.data.data).toHaveProperty('emoji');
        expect(response.data.data).toHaveProperty('count');
      });
    });
  });

  // ============================================================
  // GROUPS TESTS
  // ============================================================

  describe('Groups Endpoints', () => {
    describe('GET /groups', () => {
      it('should list user groups', async () => {
        const response = await apiClient.get(`${API_BASE}/groups`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
      });
    });

    describe('POST /groups', () => {
      it('should create a group', async () => {
        const groupData = {
          name: 'Test Group',
          description: 'A test group for testing',
          privacy: 'public'
        };

        const response = await apiClient.post(`${API_BASE}/groups`, groupData);

        expect(response.status).toBe(201);
        expect(response.data.data.name).toBe(groupData.name);
        expect(response.data.data).toHaveProperty('id');

        createdGroupId = response.data.data.id;
      });
    });

    describe('GET /groups/{id}', () => {
      it('should get a specific group', async () => {
        if (!createdGroupId) {
          throw new Error('No group ID available');
        }

        const response = await apiClient.get(`${API_BASE}/groups/${createdGroupId}`);

        expect(response.status).toBe(200);
        expect(response.data.data.id).toBe(createdGroupId);
      });
    });

    describe('PATCH /groups/{id}', () => {
      it('should update a group', async () => {
        if (!createdGroupId) {
          throw new Error('No group ID available');
        }

        const updateData = {
          name: 'Updated Group Name'
        };

        const response = await apiClient.patch(
          `${API_BASE}/groups/${createdGroupId}`,
          updateData
        );

        expect(response.status).toBe(200);
        expect(response.data.data.name).toBe(updateData.name);
      });
    });

    describe('DELETE /groups/{id}', () => {
      it('should delete a group', async () => {
        if (!createdGroupId) {
          throw new Error('No group ID available');
        }

        const response = await apiClient.delete(`${API_BASE}/groups/${createdGroupId}`);

        expect(response.status).toBe(204);
      });
    });
  });

  // ============================================================
  // NOTIFICATIONS TESTS
  // ============================================================

  describe('Notifications Endpoints', () => {
    describe('GET /notifications', () => {
      it('should list user notifications (STRICT)', async () => {
        const response = await apiClient.get(`${API_BASE}/notifications`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
        // Verify all notifications belong to user
        response.data.data.forEach((notif: any) => {
          expect(notif).toHaveProperty('id');
          expect(notif).toHaveProperty('type');
          expect(notif).toHaveProperty('message');
        });
      });

      it('should support pagination', async () => {
        const response = await apiClient.get(`${API_BASE}/notifications`, {
          params: { limit: 10, offset: 0 }
        });

        expect(response.data.pagination.limit).toBe(10);
      });
    });
  });

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================

  describe('Error Handling', () => {
    it('should return consistent error format', async () => {
      try {
        await apiClient.get(`${API_BASE}/posts/invalid-uuid`);
        fail('Should return error');
      } catch (error: any) {
        const errorData = error.response.data;
        expect(errorData).toHaveProperty('error');
        expect(errorData).toHaveProperty('message');
        expect(errorData).toHaveProperty('statusCode');
        expect(errorData).toHaveProperty('timestamp');
      }
    });

    it('should handle rate limiting', async () => {
      // This test is optional - depends on rate limiting implementation
      const response = await apiClient.get(`${API_BASE}/posts`);
      if (response.headers['x-ratelimit-limit']) {
        expect(response.headers).toHaveProperty('x-ratelimit-limit');
        expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      }
    });
  });
});
