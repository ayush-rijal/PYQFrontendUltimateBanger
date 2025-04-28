import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Post, Comment } from '@/app/types';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts/',
    }),
    getPostsByUpdated: builder.query<Post[], void>({
      query: () => 'posts/filter_by_updated/',
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `posts/${id}/`,
    }),
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: (comment) => ({
        url: 'comments/',
        method: 'POST',
        body: comment,
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUpdatedQuery,
  useGetPostByIdQuery,
  useCreateCommentMutation,
} = blogApi;