import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  GetMyPosts,
  GetMyScheduledPost,
  GetUserPost,
  addCommentReply,
  createPost,
  editPost as editWallPost,
  getCommentReplies,
  getPostTips as getPostTipss,
  getPostComments as getPstComments,
  payForPost,
  deletePost as postDelete,
  tipForPost,
  toggleCommentLike as toggleCommntLike,
} from 'api/sales';
import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { AppDispatch, RootState } from 'store/store';
import { v4 as uuid } from 'uuid';

export interface IState {
  tempComments: Record<string | number, any[]>;
  filteredSchdulePost: any[];

  posts: {
    items: IPost[];
    totalCount: number;
  };
  pinPosts?: Record<string, IPost>;
  myposts: {
    items: IPost[];
    totalCount: number;
  };
  postsComments?: Record<string, IPostCommentType>;
  postsTips?: Record<string, IPostTipsType>;
  postsLikes?: Record<string, IPostLikesType>;
  selectedPostTemplate?: any;
  showEditPost?: boolean;
  selectedScheduledPost?: any;
  isMyPostsFetching?: boolean;
  isTipPaying?: boolean;
  isPostDeleting?: boolean;
  isPostsFetching?: boolean;
  isUserPostsFetching?: boolean;
  isCommentsFetching?: boolean;
  isPostUnlocking?: boolean;
}

const initialState: IState = {
  tempComments: {},
  selectedScheduledPost: {},
  filteredSchdulePost: [],
  posts: {
    items: [],
    totalCount: 0,
  },
  pinPosts: {},
  myposts: {
    items: [],
    totalCount: 0,
  },
  postsComments: {},
  postsTips: {},
  postsLikes: {},
  isPostUnlocking: false,
  isTipPaying: false,
  showEditPost: false,
  isUserPostsFetching: false,
  isCommentsFetching: false,
  isMyPostsFetching: false,
  isPostDeleting: false,
};
// export const GetPostsList = createAsyncThunk<
//   {
//     data: IState['posts'];
//     params?: Record<string, any>;
//   },
//   { params?: Record<string, any> }
// >('sale/postList', async ({ params }) => {
//   const data = await GetPosts();
//   return { data };
// });
export const myPostsList = createAsyncThunk<
  {
    data: IState['myposts'];
    isInitial: boolean;
  },
  {
    params?: Record<string, any>;
    callback?: (...args: any) => void;
    customError?: { ignoreStatusCodes: [number] };
    options?: AxiosRequestConfig;
    tokenId?: string;
  }
>(
  'sale/myPostList',
  async ({ params, callback, customError, options, tokenId }) => {
    const data = await GetMyPosts(params, customError, options, tokenId);
    callback?.(data);
    // return { data: postsData, isInitial: !params?.skip };
    return { data, isInitial: !params?.skip };
  },
);
export const CreatePost = createAsyncThunk<
  {
    data: IPost;
  },
  { values: Record<string, any> }
>('sale/postCreate', async ({ values }, { dispatch }) => {
  const data = await createPost(values);
  dispatch(insertBeginningOfUserPosts({ data }));
  return { data };
});
export const toggleReplyCommentLike = createAsyncThunk<
  {
    _id: string;
    nestcommentId: string;
    postId?: string;
    data: { message: string; success: boolean };
  },
  {
    commentId: string;
    nestcommentId: string;
    postId?: string;
    callback?: (...args: any) => void;
    params?: Record<string, any>;
  }
>(
  'sale/postreplycommentliketoggle',
  async ({ commentId, nestcommentId, postId, callback, params }) => {
    const data = await toggleCommntLike(nestcommentId, params);
    callback?.(data);
    return { data, _id: commentId, nestcommentId, postId };
  },
);
export const userPostsList = createAsyncThunk<
  {
    data: IState['myposts'];
    isInitial: boolean;
  },
  {
    params?: Record<string, any>;
    userId?: string;
    callback?: (...args: any) => void;
    customError?: { ignoreStatusCodes: [number] };
    tokenId?: string;
  }
>(
  'sale/userPostsList',
  async ({ params, callback, userId, customError, tokenId }) => {
    const data = await GetUserPost(userId, params, customError, tokenId);
    callback?.(data);
    // return { data: postsData, isInitial: !params?.skip };
    return { data, isInitial: !params?.skip };
  },
);
export const tipPayForPost = createAsyncThunk<
  {
    data: any;
    postId: string;
  },
  {
    postId: string;
    amount: number;
    dispatch: AppDispatch;
  }
>('sale/tipForPost', async ({ postId, amount, dispatch }) => {
  const data = await tipForPost(postId, amount, dispatch);
  return { data, postId };
});
export const deletePost = createAsyncThunk<any, any>(
  'sale/deletePost',
  async ({ _id, sellerId }) => {
    const data = await postDelete(_id || '', { sellerId });
    return { ...data, _id };
  },
);
export const unlockPost = createAsyncThunk<
  {
    data: any;
    postId: string;
  },
  {
    postId: string;
    dispatch: AppDispatch;
  }
>('sale/postUnlock', async ({ postId, dispatch }) => {
  const data = await payForPost(postId, dispatch);
  return { data, postId };
});
export const editPost = createAsyncThunk<
  {
    data?: any;
    params?: Record<string, any>;
    postId?: string;
  },
  {
    postId?: string;
    callback?: (...args: any) => void;
    data: Record<string, any>;
  }
>('sale/updatePost', async ({ postId, callback, data }) => {
  const response = await editWallPost(postId || '', data);
  callback?.(response);
  return { data: response, postId };
});
export const getPostTips = createAsyncThunk<
  {
    data: IPostCommentType;
    params?: Record<string, any>;
    _id: string;
    isInitial: boolean;
  },
  {
    id: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
  }
>('sale/getPostTips', async ({ id, params, callback }) => {
  const data = await getPostTipss(id, params || {});
  callback?.(data);
  // return { data: postsData, isInitial: !params?.skip };
  return { data, _id: id, isInitial: !params?.skip };
});

export const mySchedulePostsList = createAsyncThunk<
  {
    data: any;
  },
  {
    params?: Record<string, any>;
    customError?: { ignoreStatusCodes: [number] };
  }
>('sale/mySchedulePostsList', async ({ params, customError }) => {
  const res = await GetMyScheduledPost(params, customError);
  return { data: res?.items };
});
export const toggleCommentLike = createAsyncThunk<
  {
    _id: string;
    postId?: string;
    data: { message: string; success: boolean };
  },
  {
    id: string;
    postId?: string;
    callback?: (...args: any) => void;
    params?: any;
  }
>('sale/postcommenttoggle', async ({ id, postId, callback, params }) => {
  const data = await toggleCommntLike(id, params);
  callback?.(data);
  return { data, _id: id, postId };
});

export const addReplyToComment = createAsyncThunk<
  {
    data: IPostComment;

    postId?: string;
    commentId: string;
    nestcommentId: string;
  },
  {
    commentId: string;
    nestcommentId: string;
    values: Record<string, any>;
    postId?: string;
    params?: Record<string, any>;
  }
>(
  'sale/addReplyToComment',
  async (
    { commentId, nestcommentId, values, postId, params },
    { dispatch },
  ) => {
    const data = await addCommentReply(nestcommentId, values, params);
    return { data, commentId, nestcommentId, postId };
  },
);
export const getPostCommentReplies = createAsyncThunk<
  {
    data: IPostCommentType;
    params?: Record<string, any>;
    _id: string;
    postId: string;
    isInitial: boolean;
    append?: boolean;
  },
  {
    id: string;
    postId: string;
    params?: Record<string, any>;
    append?: boolean;
    callback?: (...args: any) => void;
  }
>(
  'sale/getPostCommentReplies',
  async ({ id, postId, params, callback, append }) => {
    const data = await getCommentReplies(id, params);
    callback?.(data);
    // return { data: postsData, isInitial: !params?.skip };
    return { data, _id: id, postId, isInitial: !params?.skip, append };
  },
);
export const getPostComments = createAsyncThunk<
  {
    data: IPostCommentType;
    params?: Record<string, any>;
    _id: string;
    isInitial: boolean;
    append?: boolean;
  },
  {
    id: string;
    params?: Record<string, any>;
    callback?: (...args: any) => void;
    append?: boolean;
  }
>('sale/getPostComments', async ({ id, params, callback, append }) => {
  const data = await getPstComments(id, params);
  callback?.(data);
  // return { data: postsData, isInitial: !params?.skip };
  return { data, _id: id, isInitial: !params?.skip, append };
});

const addCommentToPost = (
  id: string,
  comment: Record<string, any> = {},
  state: IState,
) => {
  const postComments = state.postsComments?.[id];
  if (postComments) {
    if (postComments.totalCount > 0) {
      postComments.items = [
        {
          likeCount: 0,
          childCount: 0,
          commentLiked: false,
          ...comment,
        },
        ...postComments.items,
      ];
      postComments.totalCount++;
      state.postsComments![id] = postComments;
    } else {
      state.postsComments = {
        ...(state.postsComments || {}),
        [id]: {
          items: [
            {
              likeCount: 0,
              childCount: 0,
              commentLiked: false,
              ...comment,
            },
            ...(state.postsComments![id]?.items || []),
          ],
          totalCount: (state.postsComments?.[id || '']?.totalCount || 0) + 1,
        },
      };
    }
  }
  // else {
  //   state.postsComments = {
  //     ...(state.postsComments || {}),
  //     [id]: {
  //       items: [
  //         {
  //           likeCount: 0,
  //           childCount: 0,
  //           commentLiked: false,
  //           ...comment,
  //         },
  //       ],
  //       totalCount: 1,
  //     },
  //   };
  // }
};
const addTipToPost = (tip: IPostTipsType[], postId: string, state: IState) => {
  console.log({ tip }, 'tip');
  // const postComments = state.postsTips?.[id];
  // if (postComments) {
  //   if (postComments.totalCount > 0) {
  //     postComments.items = [
  //       {
  //         likeCount: 0,
  //         childCount: 0,
  //         commentLiked: false,
  //         ...comment,
  //       },
  //       ...postComments.items,
  //     ];
  //     postComments.totalCount++;
  //     state.postsComments![id] = postComments;
  //   } else {
  //     state.postsComments = {
  //       ...(state.postsComments || {}),
  //       [id]: {
  //         items: [
  //           {
  //             likeCount: 0,
  //             childCount: 0,
  //             commentLiked: false,
  //             ...comment,
  //           },
  //           ...(state.postsComments![id].items || []),
  //         ],
  //         totalCount: (state.postsComments?.[id || '']?.totalCount || 0) + 1,
  //       },
  //     };
  //   }
  // }
};
const updatePinPosts = (state: IState, payload: Record<string, any>) => {
  const notPinIndex = state.myposts.items.findIndex((p: any) => !p.pinPost);
  if (notPinIndex !== -1) {
    const findPinPostIndex = state.myposts.items
      .slice(0, notPinIndex)
      .findIndex((p: any) => !!p.pinPost && p._id === payload?._id);
    if (findPinPostIndex > -1) {
      state.myposts.items[findPinPostIndex] = {
        ...state.myposts.items[findPinPostIndex],
        ...payload,
        pinPost: true,
        id: `sp__${payload._id}`,
      } as any;
    }
  }
};
const deletePinPinPosts = (state: IState, id: string) => {
  const notPinIndex = state.myposts.items.findIndex((p: any) => !p.pinPost);
  delete state.pinPosts?.[id];
  if (notPinIndex !== -1) {
    const findPinPostIndex = state.myposts.items
      .slice(0, notPinIndex)
      .findIndex((p: any) => !!p.pinPost && p._id === id);
    if (findPinPostIndex > -1) {
      state.myposts.items.splice(findPinPostIndex, 1);
    }
  }
};
const insertInMyPosts = (state: IState, post: IPost) => {
  const notPinIndex = state.myposts.items.findIndex((p: any) => !p.pinPost);
  if (notPinIndex !== -1) {
    state.myposts.items.splice(notPinIndex, 0, post);
  } else {
    state.myposts.items.unshift(post);
  }
};
const getTipAmountFromString = (amount: string) => {
  const isNumber = parseInt(amount);
  if (typeof isNumber === 'number') {
    return isNumber;
  }
  const newAmount = parseInt(amount.slice(1));
  if (typeof newAmount === 'number') {
    return newAmount;
  }
  return 0;
};
export const slice = createSlice({
  name: 'memberPost',
  initialState,
  reducers: {
    toggleEditPost: (state, action) => {
      state.showEditPost = action.payload?.isOpen;
    },
    setPostsaWithPin: (state, action) => {
      state.myposts.items = [
        ...action.payload?.pinPosts,
        ...state.myposts.items,
      ];
    },
    removePinPostFromList: (state, action) => {
      deletePinPinPosts(state, action.payload);
    },
    setMyPostfetching: (state, action) => {
      state.isMyPostsFetching = action.payload;
    },
    updateEditSchedulePost: (state, action) => {
      const postIndex: any = state.myposts?.items?.findIndex(
        (o: any) => o._id === action.payload?._id && !o?.pinPost,
      );
      const newpost = {
        ...(state.myposts?.items?.[postIndex] || {}),
        ...(action.payload || {}),
      };
      updatePinPosts(state, newpost);
      if (postIndex !== -1) {
        if (state.pinPosts![newpost?._id]) {
          state.pinPosts![newpost?._id] = newpost;
        }
        state.myposts.items[postIndex] = newpost;
      }
    },

    addComment: (state, action) => {
      // const index = state?.myposts?.items.findIndex(
      //   (item) => item?._id === action?.payload?.comment?.postId,
      // );
      const id: string = action?.payload?.comment?.postId;
      addCommentToPost(id, action?.payload?.comment || {}, state);

      // if (index > -1) {
      //   if (state.myposts.items[index].comments?.items) {
      //     state.myposts.items[index].comments!.items!.unshift({
      //       likeCount: 0,
      //       childCount: 0,
      //       commentLiked: false,
      //       ...action?.payload?.comment,
      //     });
      //     state.myposts.items[index].comments!.totalCount!++;
      //   } else {
      //     state.myposts.items[index].comments = {
      //       items: [
      //         {
      //           likeCount: 0,
      //           childCount: 0,
      //           commentLiked: false,
      //           ...action.payload?.comment,
      //         },
      //       ],
      //       totalCount: 1,
      //     };
      //   }
      // }
    },
    addTipComment: (state, action) => {
      const id = action.payload.postId;
      const amount = action.payload.amount || 0;
      const item = action.payload?.tip?.data?.items || [];
      const totalCount = action.payload?.tip?.data?.totalCount || [];
      const statetips = state.postsTips?.[id];
      // const tips: Record<string, any> = {};
      state.postsTips = {
        ...state.postsTips,
        [id]: {
          items: item || [],
          totalCount: totalCount,
          totalTips: (statetips?.totalTips || 0) + amount,
        },
      };
      // if (action.payload.isInitial) {
      //   state.postsTips![id] = action.payload.data;
      // } else {
      //   tips[id as string] = {
      //     ...(item || { items: [], totalCount: 0 }),
      //   };
      // }
      // const index = state.myposts.items.findIndex(
      //   (p) => p._id === action.payload?._id,
      // );
    },
    updatelikes: (state, action) => {
      // const index = state?.myposts?.items.findIndex(
      //   (item) => item?._id === action?.payload?.postId,
      // );
      // const post = state.myposts?.items?.[index];
      const postId = action?.payload?.postId;
      const pinPost = state.postsLikes?.[postId || ''];

      if (pinPost) {
        // pinPost.postLikes = action?.payload?.postLikes;
        state.postsLikes![postId] = action?.payload?.postLikes;
      }
      // state.myposts.items[index].postLikes = action?.payload?.postLikes;
    },
    insertBeginningOfUserPosts: (state, action) => {
      const postId = action.payload.data._id;
      if (state.postsComments?.[postId]) {
        let postcomments = state.postsComments?.[postId] || {
          totalCount: 0,
          items: [],
        };
        postcomments = {
          items: [...(postcomments?.items || [])],
          totalCount: postcomments?.totalCount || 0,
        };
        state.postsComments![postId] = postcomments;
      } else {
        state.postsComments = {
          ...state.postsComments,
          [postId]: {
            totalCount: state.postsComments?.[postId]?.totalCount || 0,
            items: state.postsComments?.[postId]?.items || [],
          },
        };
      }
      if (state.postsLikes?.[postId]) {
        let postsLikes = state.postsLikes?.[postId] || {
          totalCount: 0,
          items: [],
        };
        postsLikes = {
          items: [...(postsLikes?.items || [])],
          totalCount: postsLikes?.totalCount || 0,
        };
        state.postsLikes![postId] = postsLikes;
      } else {
        state.postsLikes = {
          ...state.postsLikes,
          [postId]: {
            totalCount: state.postsLikes?.[postId]?.totalCount || 0,
            items: state.postsLikes?.[postId]?.items || [],
          },
        };
      }
      if (state.postsTips?.[postId]) {
        let postsLikes = state.postsTips?.[postId] || {
          totalCount: 0,
          items: [],
          totalTips: action.payload?.data?.totalTips || 0,
        };
        postsLikes = {
          items: [...(postsLikes?.items || [])],
          totalCount: postsLikes?.totalCount || 0,
        };
        state.postsTips![postId] = postsLikes;
      } else {
        state.postsTips = {
          ...state.postsTips,
          [postId]: {
            totalCount: state.postsTips?.[postId]?.totalCount || 0,
            items: state.postsTips?.[postId]?.items || [],
            totalTips: state.postsTips?.[postId]?.totalTips || 0,
          },
        };
      }
      const post = { ...action.payload.data, id: action.payload.data._id };
      updatePinPosts(state, post);
      insertInMyPosts(state, post);
      // state.myposts.items.unshift(action.payload.data);
      state.myposts.totalCount++;
    },

    // updatePost: (state, action) => {
    //   const index = state.myposts.items.findIndex(
    //     (item) => item?._id === action.payload?._id,
    //   );
    //   if (index !== -1) {
    //     state.myposts.items[index] = action.payload.data;
    //   }
    // },

    addLikePost: (state, action) => {
      const Post = {
        ...action.payload?.post,
        paymentComplete: false,
        tips: {
          items: [],
          totalCount: 0,
        },
        postLikes: {
          items: [],
          totalCount: 0,
        },
        liked: false,
        comments: {
          items: [],
          totalCount: 0,
        },
      };
      insertInMyPosts(state, { ...Post, id: Post._id });
      const post = action.payload?.post;
      state.postsLikes![post?._id] = {
        ...(post?.postLikes || { items: [], totalCount: 0 }),
      };
      if (!!post.tips?.totalCount) {
        state.postsTips![post?._id] = {
          ...post?.tips,
          totalTips: post.totalTips || 0,
        };
      } else {
        state.postsTips![post?._id] = {
          items: [],
          totalCount: 0,
          totalTips: post.totalTips || 0,
        };
      }
      state.postsComments![post?._id] = {
        ...(post?.comments || { items: [], totalCount: 0 }),
      };
      state.myposts.totalCount = state.myposts.totalCount + 1;
    },

    EditLivePost: (state, action) => {
      const PostIndex =
        state.myposts.items.findIndex(
          (post: any) =>
            post._id === action.payload?.post?._id && !post?.pinPost,
        ) || 0;

      if (PostIndex > -1) {
        state.myposts.items[PostIndex] = {
          ...state.myposts.items[PostIndex],
          ...action.payload?.post,
        };
      }
      updatePinPosts(state, {
        ...(state.myposts?.items?.[PostIndex] || {}),
        ...action.payload?.post,
      });
    },

    addLiveLikeToPost: (state, action) => {
      const postId = action.payload?.postId;
      const postLikes = state.postsLikes?.[postId];
      if (postLikes) {
        const isExist = postLikes.items.findIndex(
          (post) => (post.userId as any)?._id === action.payload?.user?._id,
        );
        if (isExist !== -1) {
          postLikes.items.splice(isExist, 1);
          postLikes.totalCount = postLikes.totalCount - 1;
        } else {
          const isZero = !!postLikes?.items?.length;
          postLikes.items.push({
            createdAt: dayjs().format(),
            _id: uuid(),
            userId: action.payload.user,
          });
          if (!isZero) {
            postLikes.totalCount = 1;
          } else {
            postLikes.totalCount = postLikes.totalCount + 1;
          }
        }
        state.postsLikes![postId] = postLikes;
      }
    },

    addLiveunLikeToPost: (state, action) => {
      const postId = action.payload?.postId;
      const postLikes = state.postsLikes?.[postId];

      if (postLikes) {
        const isExist = postLikes.items.findIndex(
          (post) => (post.userId as any)?._id === action.payload.user?._id,
        );
        if (isExist !== -1) {
          postLikes.totalCount = postLikes.totalCount - 1;
          postLikes.items.splice(isExist, 1);
        } else {
          const isZero = !!postLikes?.items?.length;
          postLikes.items.push({
            createdAt: dayjs().format(),
            _id: uuid(),
            userId: action.payload.user,
          });
          if (!isZero) {
            postLikes.totalCount = 1;
          } else {
            postLikes.totalCount = postLikes.totalCount + 1;
          }
        }
        state.postsLikes![postId] = postLikes;
      }
    },

    addLiveCommentToPost: (state, action) => {
      const obj = {
        ...action.payload.comment,
        childCount: 0,
        likeCount: 0,
        commentLiked: false,
      };
      addCommentToPost(action.payload?.postId, obj, state);
    },

    addLiveCommentLikeToPost: (state, action) => {
      const postId = action?.payload?.postId;
      const postComments = state.postsComments?.[postId];
      // const commentId = action.payload?.comment?.commentId;
      const commentId = action.payload?.parentId || action.payload?.commentId;

      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          let nestedComment = {
            ...(postcommentsItems![postCommentItemIndex] || {}),
          };

          if (!action.payload.parentId) {
            if (nestedComment.likeCount) {
              nestedComment.likeCount = nestedComment.likeCount + 1;
            } else {
              nestedComment.likeCount = 1;
            }
          } else {
            let nestedCommentItem = {
              ...(nestedComment || {}),
            };
            const childComments = {
              ...(nestedCommentItem?.childComments || {}),
            };
            if (childComments.items?.length) {
              let nestedCommentitemIndex: any = childComments?.items?.findIndex(
                (cc: any) => cc._id === action.payload?.commentId,
              );

              if (nestedCommentitemIndex !== -1) {
                const item = childComments!.items![nestedCommentitemIndex];
                item.likeCount = (item?.likeCount || 0) + 1;
                childComments!.items![nestedCommentitemIndex] = item;
                nestedComment.childComments = childComments as any;
              }
            }
          }

          postcommentsItems[postCommentItemIndex] = nestedComment;
          state.postsComments![postId].items = postcommentsItems;
        }
      }
    },

    addLiveCommentUnLikeToPost: (state, action) => {
      const postId = action?.payload?.postId;
      const postComments = state.postsComments?.[postId];
      // const commentId = action.payload?.comment?.commentId;
      const commentId = action.payload?.parentId || action.payload?.commentId;
      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          let nestedComment = {
            ...(postcommentsItems![postCommentItemIndex] || {}),
          };

          if (!action.payload.parentId) {
            if (nestedComment.likeCount) {
              nestedComment.likeCount = nestedComment.likeCount - 1;
            } else {
              nestedComment.likeCount = 1;
            }
          } else {
            let nestedCommentItem = {
              ...(nestedComment || {}),
            };
            const childComments = {
              ...(nestedCommentItem?.childComments || {}),
            };
            if (childComments.items?.length) {
              let nestedCommentitemIndex: any = childComments?.items?.findIndex(
                (cc: any) => cc._id === action.payload?.commentId,
              );

              if (nestedCommentitemIndex !== -1) {
                const item = childComments!.items![nestedCommentitemIndex];
                item.likeCount = (item?.likeCount || 0) - 1;
                childComments!.items![nestedCommentitemIndex] = item;
                nestedComment.childComments = childComments as any;
              }
            }
          }

          postcommentsItems[postCommentItemIndex] = nestedComment;
          state.postsComments![postId].items = postcommentsItems;
        }
      }
    },

    addLiveTipsToPost: (state, action) => {
      console.log({ live: action.payload });
      if (action.payload?.tip?._id) {
        // const PostIndex: any = state.myposts?.items?.findIndex(
        //   (post) => post._id === action.payload?.tip?.postId,
        // );
        const commentTip = getTipAmountFromString(action.payload.tip.comment);
        // if (PostIndex !== -1) {
        const postId = action.payload?.tip?.postId;
        const post = state.postsTips![postId];
        state.postsTips![postId] = {
          items: [
            action.payload?.tip,
            ...(state.postsTips![postId]?.items || []),
          ],
          totalCount: (state.postsTips![postId]?.totalCount || 0) + 1,
          totalTips: (post?.totalTips || 0) + commentTip,
          // totalTips:
        };
        // state.myposts.items[PostIndex].tips = {
        //   items: [
        //     action.payload?.tip,
        //     ...(state.myposts.items[PostIndex]?.tips?.items || []),
        //   ],
        //   totalCount:
        //     (state.myposts.items[PostIndex]?.tips?.totalCount || 0) + 1,
        // };
        state.postsComments![postId] = {
          items: [
            action.payload.tip || {},
            ...(state.postsComments![postId]?.items || []),
          ],
          totalCount: (state.postsComments![postId]?.totalCount || 0) + 1,
        };
        // }
      }
    },

    addLiveReplyToComment: (state, action) => {
      const postId = action?.payload?.postId;
      const postComments = state.postsComments?.[postId];
      const commentId = action.payload?.comment?.commentId;
      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          const obj = {
            ...action.payload.comment,
            postId: action.payload.postId,
          };
          let nestedComment = {
            ...(postcommentsItems![postCommentItemIndex] || {}),
          };
          const childComments = {
            ...(nestedComment?.childComments || { totalCount: 0, items: [] }),
          };

          nestedComment.childCount = (nestedComment?.childCount || 0) + 1;

          postcommentsItems[postCommentItemIndex] = nestedComment;
          state.postsComments![postId].items = postcommentsItems;

          if (!!childComments?.items?.length) {
            childComments.items = [
              {
                likeCount: 0,
                childCount: 0,
                commentLiked: false,
                tempComment: true,
                ...obj,
              },
              ...(childComments?.items || []),
            ];
            childComments.totalCount = nestedComment?.childCount || 0;
            postcommentsItems[postCommentItemIndex].childComments =
              (childComments as IPostCommentType) || {
                totalCount: 0,
                items: [],
              };
          } else {
            childComments['items'] = [
              {
                likeCount: 0,
                childCount: 0,
                commentLiked: false,
                tempComment: true,
                ...obj,
              },
            ];
            childComments['totalCount'] = nestedComment.childCount || 0;

            postcommentsItems[postCommentItemIndex].childComments =
              (childComments as IPostCommentType) || {
                totalCount: 0,
                items: [],
              };
          }
          state.postsComments![postId].items = postcommentsItems;
        }
      }
    },

    deletePostLive: (state, action) => {
      deletePinPinPosts(state, action.payload?.postId);
      const PostIndex =
        state.myposts.items.findIndex(
          (post: any) => post._id === action.payload?.postId && !post?.pinPost,
        ) || 0;

      if (PostIndex !== -1) {
        const postId = state.myposts.items[PostIndex]?._id || '';
        delete state.postsLikes?.[postId];
        delete state.postsTips?.[postId];
        if (state.postsComments?.[postId]) {
          delete state.postsComments[postId];
        }
        state.myposts.items.splice(PostIndex as number, 1);
        state.myposts.totalCount = state.myposts.totalCount - 1;
      }
    },

    delScheduledPost: (state, action) => {
      state.myposts = {
        items: state.myposts.items.filter(
          (post) => post._id === action.payload._id,
        ),
        totalCount: 0,
      };
    },
    setSelectedScheduledPost: (state, action) => {
      state.selectedScheduledPost = action.payload;
    },

    removeSelectedPost: (state) => {
      state.selectedScheduledPost = {};
      state.selectedPostTemplate = {};
    },
    updateSelectedScheduledPost: (state, action) => {
      state.selectedScheduledPost = action.payload;
    },
    editedPostTemplate: (state, action) => {
      state.selectedPostTemplate = action.payload;
    },
    resetpostschatmedia: (state, action) => {
      state.myposts = { items: [], totalCount: 0 };
      state.postsComments = {};
      state.postsLikes = {};
      state.postsTips = {};
    },
    updateFilteredSchedulePost: (state, action) => {
      state.filteredSchdulePost = state.myposts.items.filter(
        (post: any) =>
          post.publishAt &&
          dayjs(post.publishAt).isSame(action?.payload?.selectedDate, 'date'),
      );
    },
    updateScheduledPost: (state, action) => {
      const PostIndex = state.myposts.items.findIndex(
        (post: any) => post._id === action.payload?.post?._id && !post?.pinPost,
      );
      const FilterPostIndex = state.filteredSchdulePost?.findIndex(
        (post) => post._id === action.payload?.post?._id,
      );
      updatePinPosts(state, action.payload?.post);
      if (PostIndex !== -1) {
        state.myposts.items[PostIndex] = action.payload?.post;
      }
      if (PostIndex !== -1) {
        state.filteredSchdulePost[FilterPostIndex || 0] = action.payload?.post;
      }
    },
    setUpdateUserPinPost: (state, action) => {
      const pinItems = [...(action.payload?.items || [])];

      const PinPosts: Record<string, IPost> = {};
      if (pinItems.length > 0) {
        pinItems?.forEach((item: IPost) => {
          PinPosts[item._id!] = item;
        });
      }
      state.pinPosts = PinPosts;
    },
    unPinUserPosts: (state, action) => {
      delete state.pinPosts?.[action.payload.id as string];
    },
    addNewPinPost: (state, action) => {
      state.pinPosts = {
        ...state.pinPosts,
        [action.payload?.item?._id as string]: action.payload?.item,
      };
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(GetPostsList.fulfilled, (state, action) => {
    //   state.posts = action.payload.data;
    //   state.isPostsFetching = false;
    // });
    // builder.addCase(GetPostsList.pending, (state, action) => {
    //   state.isPostsFetching = true;
    // });
    // builder.addCase(GetPostsList.rejected, (state, action) => {
    //   state.isPostsFetching = false;
    // });
    //Updating post
    builder.addCase(editPost.fulfilled, (state, action) => {
      const index = state.myposts.items.findIndex(
        (item: any) => item?._id === action.payload?.postId && !item?.pinPost,
      );
      updatePinPosts(state, {
        ...(state.myposts?.items?.[index] || {}),
        ...action.payload.data,
      });
      if (state.pinPosts?.[action.payload?.postId!]) {
        state.pinPosts[action.payload?.postId!] = {
          ...state.myposts.items[index],
          ...action.payload.data,
        };
      }
      if (index !== -1) {
        state.myposts.items[index] = {
          ...state.myposts.items[index],
          ...action.payload.data,
        };
      }
    });
    // * getPost tips
    builder.addCase(getPostTips.fulfilled, (state, action) => {
      // const index = state.myposts.items.findIndex(
      //   (p) => p._id === action.payload?._id,
      // );
      const postId = action.payload?._id;
      // if (index > -1) {
      if (action.payload.isInitial) {
        // state.myposts.items[index].tips = action.payload.data;
        const statePost = state.postsTips![postId];
        if (statePost) {
          state.postsTips![postId] = {
            ...action.payload.data,
            totalTips: statePost.totalTips || 0,
          };
        } else {
          state.postsTips![postId] = { ...action.payload.data, totalTips: 0 };
        }
      } else {
        state.postsTips![postId] = {
          items: [
            ...(state.postsTips![postId]?.items || []),
            ...(action.payload?.data?.items || []),
          ],
          totalCount: state.postsTips![postId].totalCount,
          totalTips: state.postsTips![postId].totalTips,
        };
        // state.myposts.items[index].tips.items = [
        //   ...(state.myposts.items[index].tips?.items || []),
        //   ...action.payload.data.items,
        // ];
      }
      // }
    });
    //

    builder.addCase(addReplyToComment.fulfilled, (state, action) => {
      const postId = action?.payload?.postId || '';
      const postComments = state.postsComments?.[postId];
      const commentId = action.payload?.commentId;
      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          const obj = {
            ...action?.payload?.data,
            postId: postId,
          };
          let nestedComment = {
            ...(postcommentsItems![postCommentItemIndex] || {}),
          };
          const childComments = {
            ...(nestedComment.childComments || { totalCount: 0, items: [] }),
          };

          nestedComment.childCount = (nestedComment.childCount || 0) + 1;

          postcommentsItems[postCommentItemIndex] = nestedComment;
          state.postsComments![postId].items = postcommentsItems;

          if (!!childComments?.items?.length) {
            childComments.items = [
              {
                likeCount: 0,
                childCount: 0,
                commentLiked: false,
                tempComment: true,
                ...obj,
              },
              ...(childComments?.items || []),
            ];

            childComments.totalCount = nestedComment.childCount || 0;
            postcommentsItems[postCommentItemIndex].childComments =
              (childComments as IPostCommentType) || {
                totalCount: 0,
                items: [],
              };
          } else {
            childComments['items'] = [
              {
                likeCount: 0,
                childCount: 0,
                commentLiked: false,
                tempComment: true,
                ...obj,
              },
            ];
            childComments['totalCount'] = nestedComment.childCount || 0;

            postcommentsItems[postCommentItemIndex].childComments =
              (childComments as IPostCommentType) || {
                totalCount: 0,
                items: [],
              };
          }
          state.postsComments![postId].items = postcommentsItems;
        }
      }

      // state.isPostDeleting = false;
    });
    //TipPaying
    builder.addCase(tipPayForPost.fulfilled, (state, action) => {
      state.isTipPaying = false;
    });
    builder.addCase(tipPayForPost.pending, (state, action) => {
      state.isTipPaying = true;
    });
    builder.addCase(tipPayForPost.rejected, (state, action) => {
      state.isTipPaying = false;
    });
    builder.addCase(myPostsList.fulfilled, (state, action) => {
      const comments: Record<string, any> = {};
      const likes: Record<string, any> = {};
      const tips: Record<string, any> = {};
      if (action.payload.isInitial) {
        state.myposts = {
          ...action.payload.data,
          items: action.payload.data?.items?.map((p) => ({ ...p, id: p._id })),
        };
        if (state?.myposts?.totalCount > 0) {
          state.myposts.items.forEach((item) => {
            likes[item._id as string] = {
              ...(item.postLikes || { items: [], totalCount: 0 }),
            };
            if (!!item.comments?.totalCount) {
              comments[item._id as string] = {
                ...item.comments,
                items: [],
              };
            } else {
              comments[item._id as string] = {
                ...{ items: [], totalCount: 0 },
              };
            }
            if (!!item.tips?.totalCount) {
              tips[item._id as string] = {
                ...item.tips,
                totalTips: item?.totalTips,
              };
            } else {
              tips[item._id as string] = {
                items: [],
                totalCount: 0,
                totalTips: item?.totalTips || 0,
              };
            }
          });
          state.postsComments = comments;
          state.postsLikes = likes;
          state.postsTips = tips;
        }
      } else {
        if (!!action.payload?.data?.items?.length) {
          action.payload?.data?.items?.forEach((item) => {
            // comments[item._id as string] = {
            //   ...(item.comments || { items: [], totalCount: 0 }),
            // };
            if (!!item.comments?.items?.length) {
              comments[item._id as string] = {
                ...item.comments,
                items: [],
              };
            } else {
              comments[item._id as string] = {
                ...{ items: [], totalCount: 0 },
              };
            }
            likes[item._id as string] = {
              ...(item.postLikes || { items: [], totalCount: 0 }),
            };
            if (!!item.tips?.totalCount) {
              tips[item._id as string] = {
                ...item.tips,
                totalTips: item?.totalTips || 0,
              };
            } else {
              tips[item._id as string] = {
                items: [],
                totalCount: 0,
                totalTips: item?.totalTips || 0,
              };
            }
            // tips[item._id as string] = {
            //   ...(item.tips || { items: [], totalCount: 0 }),
            // };
          });
          state.postsComments = { ...state.postsComments, ...comments };
          state.postsLikes = { ...state.postsLikes, ...likes };
          state.postsTips = { ...state.postsTips, ...tips };
        }
        state.myposts.items = [
          ...state.myposts.items,
          ...action.payload.data.items.map((p) => ({ ...p, id: p._id })),
        ];
      }
      state.isMyPostsFetching = false;
    });
    builder.addCase(myPostsList.pending, (state, action) => {
      state.isMyPostsFetching = true;
    });
    builder.addCase(myPostsList.rejected, (state, action) => {
      state.isMyPostsFetching = false;
    });
    builder.addCase(mySchedulePostsList.fulfilled, (state, action) => {
      state.myposts = {
        items: action.payload.data,
        totalCount: 0,
      };
      state.isMyPostsFetching = false;
    });
    builder.addCase(mySchedulePostsList.pending, (state, action) => {
      state.isMyPostsFetching = true;
    });
    builder.addCase(mySchedulePostsList.rejected, (state, action) => {
      state.isMyPostsFetching = false;
    });
    builder.addCase(userPostsList.fulfilled, (state, action) => {
      const comments: Record<string, any> = {};
      const postLikes: Record<string, any> = {};
      const postTips: Record<string, any> = {};
      if (action.payload.isInitial) {
        state.myposts = {
          ...action.payload.data,
          items: action.payload.data?.items?.map((p) => ({ ...p, id: p._id })),
        };
        if (state?.myposts?.totalCount > 0) {
          state.myposts.items.forEach((item) => {
            if (!!item.comments?.totalCount) {
              comments[item._id as string] = {
                ...item.comments,
                items: [],
              };
            } else {
              comments[item._id as string] = {
                ...{ items: [], totalCount: 0 },
              };
            }
            // comments[item._id as string] = {
            //   ...(item.comments || { items: [], totalCount: 0 }),
            // };
            postLikes[item._id as string] = {
              ...(item.postLikes || { items: [], totalCount: 0 }),
            };
            if (!!item.tips?.totalCount) {
              postTips[item._id as string] = {
                ...item.tips,
                totalTips: item?.totalTips || 0,
              };
            } else {
              postTips[item._id as string] = {
                items: [],
                totalCount: 0,
                totalTips: item?.totalTips || 0,
              };
            }
            // postTips[item._id as string] = {
            //   ...(item.tips || { items: [], totalCount: 0 }),
            // };
          });
          state.postsComments = comments;
          state.postsLikes = postLikes;
          state.postsTips = postTips;
        }
      } else {
        if (!!action.payload?.data?.items?.length) {
          action.payload?.data?.items?.forEach((item) => {
            // comments[item._id as string] = {
            //   ...(item.comments || { items: [], totalCount: 0 }),
            // };
            if (!!item.comments?.items?.length) {
              comments[item._id as string] = {
                ...item.comments,
                items: [],
              };
            } else {
              comments[item._id as string] = {
                ...{ items: [], totalCount: 0 },
              };
            }
            postLikes[item._id as string] = {
              ...(item.postLikes || { items: [], totalCount: 0 }),
            };
            if (!!item.tips?.totalCount) {
              postTips[item._id as string] = {
                ...item.tips,
                totalTips: item?.totalTips || 0,
              };
            } else {
              postTips[item._id as string] = {
                items: [],
                totalCount: 0,
                totalTips: item?.totalTips || 0,
              };
            }
            // postTips[item._id as string] = {
            //   ...(item.tips || { items: [], totalCount: 0 }),
            // };
          });
          state.postsComments = { ...state.postsComments, ...comments };
          state.postsLikes = { ...state.postsLikes, ...postLikes };
          state.postsTips = { ...state.postsTips, ...postTips };
        }
        state.myposts.items = [
          ...state.myposts.items,
          ...action.payload.data.items.map((p) => ({ ...p, id: p._id })),
        ];
      }
      state.isMyPostsFetching = false;
    });
    builder.addCase(userPostsList.pending, (state, action) => {
      state.isMyPostsFetching = true;
    });
    builder.addCase(userPostsList.rejected, (state, action) => {
      state.isMyPostsFetching = false;
    });

    builder.addCase(toggleReplyCommentLike.fulfilled, (state, action) => {
      const postId = action?.payload?.postId || '';
      const postComments = state.postsComments?.[postId];
      // const commentId = action.payload?.comment?.commentId;
      const commentId = action.payload?._id;
      const nestedCommentId = action.payload?.nestcommentId;

      if (postComments) {
        const postcommentsItems = postComments.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          let commentIndex = postcommentsItems[
            postCommentItemIndex
          ].childComments!.items?.findIndex((nc) => nc._id === nestedCommentId);
          if (commentIndex > -1) {
            let nestedComment =
              postcommentsItems[postCommentItemIndex].childComments!.items[
                commentIndex
              ];

            if (nestedComment.commentLiked) {
              nestedComment = {
                ...nestedComment,
                commentLiked: false,
                likeCount: nestedComment.likeCount! - 1,
              };
            } else {
              nestedComment = {
                ...nestedComment,
                commentLiked: true,
                likeCount: nestedComment.likeCount! + 1,
              };
            }

            postcommentsItems[postCommentItemIndex].childComments!.items[
              commentIndex
            ] = nestedComment;
            state.postsComments![postId].items = postcommentsItems;
          }
        }
      }
    });
    // * delete Post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const index = state.myposts.items.findIndex(
        (p: any) => p._id === action.payload?._id && !p?.pinPost,
      );
      const filteredSchdulePostIndex = state.filteredSchdulePost.findIndex(
        (p) => p._id === action.payload?._id,
      );
      const id = action.payload?._id || '';
      if (index > -1) {
        delete state.pinPosts?.[id];
        delete state.postsTips?.[id];
        if (state.postsComments?.[id]) {
          delete state.postsComments[id];
        }
        state.myposts.items.splice(index, 1);
        state.myposts.totalCount--;
      }
      if (filteredSchdulePostIndex > -1) {
        state.filteredSchdulePost.splice(filteredSchdulePostIndex, 1);
      }
      deletePinPinPosts(state, id);
      state.isPostDeleting = false;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.isPostDeleting = true;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isPostDeleting = false;
    });
    builder.addCase(getPostComments.fulfilled, (state, action) => {
      const isAppend = !action.payload.append;
      const isInitial = action.payload.isInitial;
      const id = action.payload?._id || '';
      if (isInitial && isAppend) {
        state.postsComments = {
          ...(state.postsComments || {}),
          [id]: action.payload.data,
        };
      } else {
        state.postsComments![id] = {
          items: [
            ...(state.postsComments?.[id]?.items || []),
            ...(action.payload?.data?.items || []),
          ],
          totalCount: action.payload?.data?.totalCount || 0,
        };
      }

      state.isCommentsFetching = false;

      // state.isPostDeleting = false;
    });
    builder.addCase(getPostComments.pending, (state, action) => {
      state.isCommentsFetching = true;
    });
    builder.addCase(getPostComments.rejected, (state, action) => {
      state.isCommentsFetching = false;
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      const postId = action?.payload?.postId || '';
      const postComments = state.postsComments?.[postId];
      // const commentId = action.payload?.comment?.commentId;
      const commentId = action.payload?._id;

      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          let nestedComment = {
            ...(postcommentsItems![postCommentItemIndex] || {}),
          };

          if (nestedComment.commentLiked) {
            nestedComment = {
              ...nestedComment,
              commentLiked: false,
              likeCount: nestedComment.likeCount! - 1,
            };
          } else {
            nestedComment = {
              ...nestedComment,
              commentLiked: true,
              likeCount: nestedComment.likeCount! + 1,
            };
          }

          postcommentsItems[postCommentItemIndex] = nestedComment;
          state.postsComments![postId].items = postcommentsItems;
        }
      }
    });
    builder.addCase(unlockPost.fulfilled, (state, action) => {
      const index = state.myposts.items.findIndex(
        (p: any) => p._id === action.payload?.postId && !p?.pinPost,
      );
      const Unlockedpost = action?.payload?.data?.post || {};
      if (index !== -1) {
        const post = state.myposts.items[index];
        state.postsComments![post._id!] = {
          items: [...(Unlockedpost?.comments?.items || [])],
          totalCount: Unlockedpost.comments.totalCount,
        };
        state.postsLikes![post._id!] = {
          items: [...(Unlockedpost?.postLikes?.items || [])],
          totalCount: Unlockedpost?.postLikes?.totalCount || 0,
        };
        state.postsTips![post._id!] = {
          items: [...(Unlockedpost?.tips?.items || [])],
          totalCount: Unlockedpost?.tips?.totalCount || 0,
          totalTips: post.totalTips || 0,
        };

        const statePost = { ...(state.myposts.items[index] || {}) };
        state.myposts.items[index] = {
          ...statePost,
          paymentComplete: true,
          ...Unlockedpost,
          userId: statePost?.userId || {},
        };
      }
      updatePinPosts(state, {
        ...(state.myposts?.items?.[index] || {}),
        paymentComplete: true,
        ...Unlockedpost,
      });
      if (state.pinPosts?.[Unlockedpost._id!]) {
        state.pinPosts[Unlockedpost._id!] = {
          ...(state.myposts?.items?.[index] || {}),
          paymentComplete: true,
          ...Unlockedpost,
        };
      }
      state.isPostUnlocking = false;
    });

    builder.addCase(unlockPost.pending, (state, action) => {
      state.isPostUnlocking = true;
    });
    builder.addCase(unlockPost.rejected, (state, action) => {
      state.isPostUnlocking = false;
    });
    builder.addCase(getPostCommentReplies.fulfilled, (state, action) => {
      const postId = action?.payload?.postId || '';
      const postComments = state.postsComments?.[postId];
      const commentId = action.payload?._id;
      if (postComments) {
        const postcommentsItems = postComments?.items || [];
        const postCommentItemIndex = postcommentsItems.findIndex(
          (c) => c._id === commentId,
        );
        if (postCommentItemIndex > -1) {
          let childComments = {
            ...(postcommentsItems![postCommentItemIndex]?.childComments || {
              totalCount: 0,
              items: [],
            }),
          };

          if (action.payload.isInitial) {
            childComments = action.payload.data;
            postcommentsItems![postCommentItemIndex].childComments =
              childComments as IPostCommentType;
          } else {
            childComments.items = [
              ...(childComments?.items || []),
              ...action.payload.data.items,
            ];
            postcommentsItems![postCommentItemIndex].childComments =
              childComments as IPostCommentType;
          }

          state.postsComments![postId].items = postcommentsItems;
        }
      }
    });
  },
});
const Selectposts = (state: RootState) => state.memberPost.myposts;
const postCommentss = (state: RootState) => {
  return state.memberPost.postsComments;
};
const IpostLikes = (state: RootState) => {
  return state.memberPost.postsLikes;
};
const IpostTips = (state: RootState) => {
  return state.memberPost.postsTips;
};
export const selectWallPosts = createSelector([Selectposts], (posts) => {
  return posts;
});
export const selectPostCommentById = createSelector(
  [postCommentss, (state: RootState, groupKey: string) => groupKey],
  (postComments, groupKey) => {
    return postComments?.[groupKey] as IPostCommentType;
  },
);
export const selectPostLiekesById = createSelector(
  [IpostLikes, (state: RootState, groupKey: string) => groupKey],
  (postLikes, groupKey) => {
    return postLikes?.[groupKey] as IPostLikesType;
  },
);
export const selectPostTipsById = createSelector(
  [IpostTips, (state: RootState, groupKey: string) => groupKey],
  (postTips, groupKey) => {
    return postTips?.[groupKey] as IPostTipsType;
  },
);
export const selectPostLength = createSelector([Selectposts], (postTips) => {
  return postTips.totalCount || 0;
});
// export const checkIfGropExist = createSelector(
//   [postComments, (state: RootState, groupKey: string) => groupKey],
//   (groups, groupKey) => {
//     return Object.keys(groups?.[groupKey] || {})?.length > 0;
//   },
// );
export const {
  delScheduledPost,
  deletePostLive,
  addLiveReplyToComment,
  addLiveTipsToPost,
  addLiveCommentUnLikeToPost,
  addLiveCommentLikeToPost,
  updateEditSchedulePost,
  addComment,
  updatelikes,
  insertBeginningOfUserPosts,
  // updatePost,
  addLikePost,
  addTipComment,
  EditLivePost,
  setUpdateUserPinPost,
  addLiveLikeToPost,
  addLiveunLikeToPost,
  addLiveCommentToPost,
  setSelectedScheduledPost,
  updateSelectedScheduledPost,
  removeSelectedPost,
  editedPostTemplate,
  resetpostschatmedia,
  updateFilteredSchedulePost,
  toggleEditPost,
  unPinUserPosts,
  addNewPinPost,
  updateScheduledPost,
  setPostsaWithPin,
  removePinPostFromList,
  setMyPostfetching,
} = slice.actions;

export default slice.reducer;
