import {
  createComment,
  setPinPost,
  togglePostLike,
  unPinPostOnWall,
} from 'api/sales';
import { TipDollar } from 'assets/svgs';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useCallback, useEffect, useRef } from 'react';
import {
  addComment,
  addNewPinPost,
  addReplyToComment,
  addTipComment,
  deletePost,
  getPostCommentReplies,
  getPostComments,
  getPostTips,
  myPostsList,
  removePinPostFromList,
  selectWallPosts,
  setPostsaWithPin,
  tipPayForPost,
  toggleCommentLike,
  toggleReplyCommentLike,
  unPinUserPosts,
  updatelikes,
  userPostsList,
} from 'store/reducer/member-post';
import { getUserMemberships } from 'store/reducer/salesState';
import swal from 'sweetalert';
import { getSortbyParam } from 'util/index';
type Props = {
  sellerId?: string;
  buyerId?: string;
  isBuyer?: boolean;
  fatchAllUsers?: boolean;
  isBuyerView?: boolean;
  isSellerView?: boolean;
};
type Paginationtype = {
  skip?: number;
  limit?: number;
  sort?: string;
  order?: string;
  sellerId?: string;
  buyerId?: string;
  options?: AxiosRequestConfig;
  callback?: (...args: any) => void;
  tokenId?: string;
};
const PAGE_LIMIT = 10;
const useWallHook = (props: Props) => {
  const {
    sellerId: SellerId,
    buyerId,
    fatchAllUsers = false,
    isBuyer = false,
    isBuyerView = false,
    isSellerView = false,
  } = props;
  const dispatch = useAppDispatch();
  const cancelToken = useRef<any>();
  const myPostList = useAppSelector((state) => selectWallPosts(state));
  const pinKey = useAppSelector((state) => state.memberPost.pinPosts);

  const onPinClick = (item: IPost) => {
    if (!!pinKey?.[item?._id as string]) {
      unPinPostOnWall(
        item?._id as string,
        { sellerId: isSellerView ? '' : SellerId },
        {
          ignoreStatusCodes: [404, 421],
        },
      ).then(() => {
        dispatch(unPinUserPosts({ id: item?._id || '' }));
        dispatch(removePinPostFromList(item?._id));
      });
    } else {
      setPinPost(
        item?._id as string,
        { sellerId: isSellerView ? '' : SellerId },
        {
          ignoreStatusCodes: [404, 421],
        },
      )
        .then(() => {
          dispatch(addNewPinPost({ item: item }));
          dispatch(
            setPostsaWithPin({
              pinPosts: [{ ...item, pinPost: true, id: `sp__${item._id}` }],
            }),
          );
        })
        .catch((e) => console.log(e));
    }
  };
  const onUnPinPost = async (postId: string) => {
    return await unPinPostOnWall(
      postId,
      {
        sellerId: SellerId,
      },
      {
        ignoreStatusCodes: [404, 421],
      },
    )
      .then(() => {
        dispatch(unPinUserPosts({ id: postId }));
        dispatch(removePinPostFromList(postId));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getPaginatedPosts = useCallback(
    async (
      params: Record<string, any> = {},
      callback?: (...args: any) => void,
      options?: AxiosRequestConfig,
      buyerId?: string,
      tokenId?: string,
    ) => {
      const newParams: any = { ...(params || {}), buyerId };

      if (isBuyerView) {
        delete newParams.buyerId;

        delete newParams.sellerId;
      }
      if (buyerId && !fatchAllUsers) {
        return dispatch(
          userPostsList({
            params: { ...newParams },
            userId: SellerId,
            callback,
            customError: { ignoreStatusCodes: [404] },
            tokenId,
          }),
        )
          .unwrap()
          .catch((e) => console.log(e));
      }
      return dispatch(
        myPostsList({
          params,
          callback,
          customError: { ignoreStatusCodes: [404] },
          options,
          tokenId,
        }),
      )
        .unwrap()
        .catch((e) => console.log(e));
    },
    [SellerId],
  );
  useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    const params: Record<string, any> = {};
    if (!isBuyer) {
      params.sellerId = SellerId;
      if (!fatchAllUsers) {
        dispatch(
          getUserMemberships({
            customError: { ignoreStatusCodes: [404] },
            params: { ...params },
            options: {
              // cancelToken: cancelToken.current.token,
            },
          }),
        ).catch((e) => console.log(e));
      }
    }

    // // dispatch(reInitializeState());
    // getPaginatedPosts(
    //   paramsList,
    //   () => {},
    //   {
    //     // cancelToken: cancelToken.current.token,
    //   },
    //   buyerId,
    // ).catch((e) => console.log(e));

    // return () => {
    //   // cancelToken.current.cancel('Operation canceled due to Unmount.');
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerId, SellerId, dispatch]);
  const handlePaginationPosts = useCallback(
    (props: Paginationtype) => {
      const {
        skip = myPostList?.items?.length || 0,
        limit = PAGE_LIMIT,
        sort = getSortbyParam('publishAt'),
        order = 'desc',
        sellerId = SellerId,
        buyerId: bId = buyerId,
        options = {},
        callback = () => {},
        tokenId,
      } = props;
      const path = `${fatchAllUsers ? '/post?' : '/post/my-posts?'}`;

      return getPaginatedPosts(
        {
          skip,
          limit,
          sort,
          path,
          order,
          sellerId,
        },
        callback,
        options,
        bId,
        tokenId,
      );
    },
    [myPostList.items, SellerId],
  );
  const onTogglePostLike = useCallback(
    async (id: string, isAdd: boolean, postlikes: IPostLikesType) => {
      const pLikes = { ...postlikes };
      dispatch(
        updatelikes({
          postLikes: pLikes,
          postId: id,
        }),
      );
      const params: Record<string, any> = {};
      if (!isBuyer) {
        params.sellerId = SellerId;
      }
      return await togglePostLike(id, { ...params })
        .then((l) => {
          return l;
        })
        .catch(console.log);
    },
    [SellerId],
  );

  const onToggleCommentLike = useCallback(
    async (id: string, postId?: string) => {
      const params: Record<string, any> = {};
      if (!isBuyer) {
        params.sellerId = SellerId;
      }
      return dispatch(
        toggleCommentLike({
          id,
          postId,
          callback: () => {},
          params: { ...params },
        }),
      ).catch(console.log);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );
  const onToggleCommentReplyLike = useCallback(
    ({
      nestedCommentId,
      commentId,
      postId,
      params,
      callback,
    }: {
      nestedCommentId: string;
      commentId: string;
      postId?: string;
      params?: Record<string, any>;
      callback?: () => void;
    }) => {
      return dispatch(
        toggleReplyCommentLike({
          commentId,
          nestcommentId: nestedCommentId,
          postId,
          callback: callback,
          params: { ...params, sellerId: SellerId },
        }),
      );
    },
    [],
  );
  const onCommentspagination = useCallback(
    async (id: string, params: Record<string, any> = {}, append = false) => {
      const paramss: Record<string, any> = { ...(params || {}) };
      if (!isBuyer) {
        paramss.sellerId = SellerId;
      }
      return dispatch(
        getPostComments({
          id: id,
          params: { ...params },
          append,
          callback: () => {},
        }),
      ).catch(console.log);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SellerId],
  );
  const onAddComemnt = useCallback(
    async (
      id: string,
      values: Record<string, any>,
      callback?: (...args: any) => void,
    ) => {
      const params: Record<string, any> = {};
      if (!isBuyer) {
        params.sellerId = SellerId;
      }
      return await createComment(id, values, { ...params })
        .then((v: any) => {
          // setCommentOpen(undefined);
          callback?.();
          dispatch(addComment({ comment: v }));
          return v;
        })
        .catch((err) =>
          swal('', err.message || 'Something went wrong. Try Again!', 'error'),
        );
    },
    [SellerId],
  );
  const onAddTipComemnt = useCallback(
    async (
      postId: any,
      amount: any,
      onToggle2?: any,
      setPayTipPost?: any,
      callback?: (...args: any) => void,
    ) => {
      return await dispatch(tipPayForPost({ postId, amount, dispatch }))
        .unwrap()
        .then((v: any) => {
          callback?.();
          dispatch(getPostTips({ id: postId }))
            .unwrap()
            .then((resp) => {
              dispatch(addTipComment({ tip: resp, postId, amount }));
            })
            .catch((e) => console.log(e));
          setPayTipPost(null);
          onToggle2();
          toast.warning(
            `Your tip of $${amount} has been sent!`,
            'THANK YOU',
            <TipDollar />,
          );
          return v;
        })
        .catch((e: any) => {
          if (e && e?.message) {
            toast.error(e.message);
          } else {
            swal('', e.message || 'Something went wrong. Try Again!', 'error');
          }
          onToggle2();
        });
    },
    [],
  );
  const onDeletePost = useCallback(
    async (id: string) => {
      const params: Record<string, any> = {};
      if (!isBuyer) {
        params.sellerId = SellerId;
      }

      return await dispatch(deletePost({ _id: id, ...params }));
      // .then(() => {
      //   toast.success('The post has been deleted successfully');
      // })
      // .catch(console.log);
    },
    [SellerId],
  );
  const onAddReplyToComment = useCallback(
    async ({
      commentId,
      nestcommentId,
      values,
      postId,
      params,
    }: {
      commentId: string;
      nestcommentId: string;
      values: any;
      postId: string;
      params: Record<string, any>;
    }) => {
      const paramss: Record<string, any> = { ...params };
      if (!isBuyer) {
        paramss.sellerId = SellerId;
      }
      return dispatch(
        addReplyToComment({
          commentId,
          nestcommentId,
          values,
          postId,
          params: { ...paramss },
        }),
      );
    },
    [SellerId],
  );
  const onPostCommentRepliesPagination = useCallback(
    async ({
      id,

      postId,
      params,
      append,
      callback,
    }: {
      id: string;

      postId: string;
      params: Record<string, any>;
      append?: boolean;
      callback?: () => void;
    }) => {
      return dispatch(
        getPostCommentReplies({
          id: id,
          postId,
          params: params,
          append,
          callback,
        }),
      );
    },
    [SellerId],
  );

  return {
    onAddComemnt,
    onAddReplyToComment,
    onTogglePostLike,
    onCommentspagination,
    onDeletePost,
    onPostCommentRepliesPagination,
    onToggleCommentReplyLike,
    onToggleCommentLike,
    getPaginatedPosts,
    handlePaginationPosts,
    onPinClick,
    onAddTipComemnt,
    onUnPinPost,
  };
};
export default useWallHook;
