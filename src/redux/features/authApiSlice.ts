// import { apiSlice } from "../services/apiSlice";

// interface User {
//   first_name: string;
//   last_name: string;
//   email: string;
//   role?: string;
//   isVerified?: boolean;
//   lastLogin?: string;
//   createdAt?: string;
//   profilePicture?: string;
// }

// interface SocialAuthArgs {
//   provider: string;
//   state: string;
//   code: string;
// }

// interface CreateUserResponse {
//   success: boolean;
//   user: User;
// }

// const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     retrieveUser: builder.query<User, void>({
//       query: () => "/users/me/", //query to get data,, mutate means put post data
//     }),
//     socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
//       query: ({ provider, state, code }) => ({
//         //since multiple parametes like provider,sstate,code so make them in object inside {}
//         url: `/o/${provider}/?state=${encodeURIComponent(
//           //make urls safe by encodeuricomponent
//           state
//         )}&code=${encodeURIComponent(code)}`,
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }),
//     }),
//     login: builder.mutation({
//       query: ({ email, password }) => ({
//         url: "/jwt/create/",
//         method: "POST",
//         body: { email, password },
//       }), //equivalent of doing query:.... =>{return url method ...}
//     }),
//     register: builder.mutation({
//       query: ({ first_name, last_name, email, password, re_password }) => ({
//         url: "/users/",
//         method: "POST",
//         body: { first_name, last_name, email, password, re_password },
//       }),
//     }),
//     verify: builder.mutation({
//       query: () => ({
//         url: "/jwt/verify/",
//         method: "POST",
//       }),
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: "/logout/",
//         method: "POST",
//       }),
//     }),
//     activation: builder.mutation({
//       query: ({ uid, token }) => ({
//         url: "/users/activation/", //here normal ' but inside url like uid token use backtick `
//         method: "POST",
//         body: { uid, token }, //no need to do JSON.strinfgy{uid,token} rtk handles that
//       }),
//     }),
//     resetPassword: builder.mutation({
//       query: (email) => ({
//         url: "/users/reset_password/",
//         method: "POST",
//         body: { email },
//       }),
//     }),
//     resetPasswordConfirm: builder.mutation({
//       query: ({ uid, token, new_password, re_new_password }) => ({
//         url: "/users/reset_password_confirm/",
//         method: "POST",
//         body: { uid, token, new_password, re_new_password },
//       }),
//     }),
//   }),
// });

// export const {
//   useRetrieveUserQuery, //based on hook genereated ased on name above like retrieveUser below builder
//   useSocialAuthenticateMutation,
//   useLoginMutation,
//   useRegisterMutation,
//   useVerifyMutation,
//   useLogoutMutation,
//   useActivationMutation,
//   useResetPasswordMutation,
//   useResetPasswordConfirmMutation,
// } = authApiSlice;




import { apiSlice } from "../services/apiSlice";

interface User {
  id?: string; // Add id to the User interface if not already present
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  profilePicture?: string;
}

interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}

interface CreateUserResponse {
  success: boolean;
  user: User;
}

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  score: number;
}

interface GlobalLeaderboardEntry {
  user_id: string;
  user_name: string;
  total_score: number;
}

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<User, void>({
      query: () => "/users/me/",
    }),
    socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
      query: ({ provider, state, code }) => ({
        url: `/o/${provider}/?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/jwt/create/",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: ({ first_name, last_name, email, password, re_password }) => ({
        url: "/users/",
        method: "POST",
        body: { first_name, last_name, email, password, re_password },
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        url: "/jwt/verify/",
        method: "POST",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout/",
        method: "POST",
      }),
    }),
    activation: builder.mutation({
      query: ({ uid, token }) => ({
        url: "/users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: "/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: "/users/reset_password_confirm/",
        method: "POST",
        body: { uid, token, new_password, re_new_password },
      }),
    }),
    // New endpoints for leaderboard
    saveQuizScore: builder.mutation<void, { user_id: string; user_name: string; category0: string; category1: string; quiz_file: string; quiz_id: string; score: number }>({
      query: (data) => ({
        url: "/leaderboard/save-score/",
        method: "POST",
        body: data,
      }),
    }),
    getLeaderboard: builder.query<
      LeaderboardEntry[],
      { category0: string; category1: string; quiz_file: string; quiz_id: string }
    >({
      query: ({ category0, category1, quiz_file, quiz_id }) => {
        const params = new URLSearchParams({
          category0,
          category1,
          quiz_file,
          quiz_id,
        });
        return `/leaderboard/?${params.toString()}`;
      },
    }),
    getGlobalLeaderboard: builder.query<GlobalLeaderboardEntry[], void>({
      query: () => "/leaderboard/global/",
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useSaveQuizScoreMutation,
  useGetLeaderboardQuery,
  useGetGlobalLeaderboardQuery,
} = authApiSlice;