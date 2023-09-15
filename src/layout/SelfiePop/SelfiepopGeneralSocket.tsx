import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useSocket from 'hooks/useSocket';
import { useEffect } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import {
  updateLastMessage,
  updateSubscriptionUnreadCount,
} from 'store/reducer/chat';
import { resetOrder } from 'store/reducer/checkout';
import { incrementUnreadMessageCount } from 'store/reducer/counter';
import {
  setManagedUser,
  updateManagedUsers,
} from 'store/reducer/managed-users';
import {
  addLiveCommentLikeToPost,
  addLiveCommentToPost,
  addLiveCommentUnLikeToPost,
  addLiveLikeToPost,
  addLiveReplyToComment,
  addLiveTipsToPost,
  addLiveunLikeToPost,
  updateScheduledPost,
} from 'store/reducer/member-post';
import {
  getSubItem,
  updateUserLastMessage,
  updateUsersUnreadCount,
} from 'store/reducer/salesState';
import {
  updatePublishMessage,
  updateSchedulePost,
} from 'store/reducer/scheduledMessaging';
import { setSupportChatCount } from 'store/reducer/support';
import { getLocalStorage, onboardingSequency, parseQuery } from 'util/index';
const Users = {
  buyer: 'BUYER',
  seller: 'SELLER',
};
type ISelfiepopGeneralSocket = {
  showMessageToast?: (data: any) => void;
};
const SelfiepopGeneralSocket = (props: ISelfiepopGeneralSocket) => {
  const { showMessageToast } = props;
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const { user, setUser } = useAuth();
  const history = useHistory();
  const { subscription } = parseQuery(search);
  const eventData = useAppSelector((state) => state.eventSlice?.attendieInfo);
  const usersObject = useAppSelector((state) => state.mysales.userObjectList);
  const manageUser = useAppSelector((state) => state.managedUsers.item);
  const selectedSub = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );
  const isChatActive = useAppSelector(
    (state) => state.mysales.isChatWindowActive,
  );
  const isOnboarding = matchPath(history.location.pathname, {
    path: '/onboarding',
    exact: false,
    strict: false,
  });
  const isMyPurchases = matchPath(history.location.pathname, {
    path: '/messages/subscriptions',
    exact: true,
    strict: false,
  });
  const isMyMembers = matchPath(history.location.pathname, {
    path: '/messages/subscribers',
    exact: true,
    strict: false,
  });
  const checkUsersInList = (
    subId: string,
    userId: string,
    type: string,
    popType: string,
  ) => {
    if (userId) {
      if (!usersObject?.items?.[subId]) {
        dispatch(getSubItem({ userId, type, popType, subId }));
      }
    }
  };
  useEffect(() => {
    if (user?._id) {
      const order = getLocalStorage('order', true);
      if (order) {
        dispatch(resetOrder());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);
  useEffect(() => {
    if (user?._id) {
      if (user?.signupSource === 'street-promo' && !user?.isPasswordSet) {
        return history.replace('/set-password');
      }
      if (!user.skipOnBoarding) {
        // const onBoardRoute =
        //   user.onboardingTypeId === 2
        //     ? onboardingSequencyV2
        //     : onboardingSequency;
        const onBoardRoute = onboardingSequency;
        let redirect = '';
        if (onBoardRoute[user?.userSetupStatus]) {
          redirect = onBoardRoute[user?.userSetupStatus];
        } else if (isOnboarding) {
          redirect = '/';
        }
        if (redirect) {
          history.push(redirect);
          return;
        }
      } else if (isOnboarding) {
        history.push('/');
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?._id) {
      user?.isSupportAgent &&
        socket?.on('support_agent', (data: any) => {
          if (data.type === 'tickets_count') {
            dispatch(setSupportChatCount({ totalComments: data.total || 0 }));
          }
        });
      socket?.on(user._id, (data: any) => {
        console.log('socketUserSelfiePOP: ', data);
        if (data.type === 'idVerification') {
          delete data.type;
          setUser({ ...user, ...data });
          return;
        }
        if (data.type === 'manage-list') {
          if (manageUser?._id === data?.sellerId) {
            dispatch(
              setManagedUser({
                ...manageUser,
                unread: data?.unread,
                subscription: data?.subscription,
              }),
            );
          }
          dispatch(
            updateManagedUsers({
              ...data,
            }),
          );
        }
        if (data?.type === 'scheduled') {
          return dispatch(updatePublishMessage(data?.messageData));
        }
        if (data.type === 'post-like' && !isMyPurchases) {
          if (data.user?._id !== user._id) dispatch(addLiveLikeToPost(data));
          return;
        }
        if (
          data.type === 'post-create' &&
          data.post?.userId === user._id &&
          data.post?.postType === 'scheduled'
        ) {
          dispatch(updateScheduledPost(data));
          dispatch(updateSchedulePost(data?.post));
        }
        if (data.type === 'comment' && !isMyPurchases) {
          if (data.comment?.userId?._id !== user._id)
            dispatch(addLiveCommentToPost(data));
          return;
        }

        if (data.type === 'post-unlike') {
          if (data.user?._id !== user._id) dispatch(addLiveunLikeToPost(data));
          return;
        }
        if (data.type === 'comment-unlike' && !isMyPurchases) {
          if (data.unlikedBy !== user._id)
            dispatch(addLiveCommentUnLikeToPost(data));
          return;
        }
        if (data.type === 'tip' && !isMyPurchases) {
          if (data.tip?.userId !== user._id) dispatch(addLiveTipsToPost(data));
          return;
        }
        if (data.type === 'comment-like' && !isMyPurchases) {
          if (data.likedBy !== user._id)
            dispatch(addLiveCommentLikeToPost(data));
          return;
        }
        if (data.type === 'reply-comment' && !isMyPurchases) {
          if (data.comment?.userId?._id !== user._id)
            dispatch(addLiveReplyToComment(data));
          return;
        }
        if (data.type === 'paymentComplete') {
          if (
            // !isChat &&
            // !isMySales &&
            !isMyMembers &&
            !isMyPurchases

            // ||
            // subscription !== data.chat.subscriptionId
          ) {
            showMessageToast?.({ ...data, isPaymentComplete: true });
          }
        }
        if (data.type === 'tickets_count' && !user?.isSupportAgent) {
          dispatch(setSupportChatCount({ totalComments: data.total || 0 }));
          return;
        }

        if (data.type === 'chat') {
          if (data?.user?._id === user._id) {
            return;
          }
          if (
            data.isNotification &&
            // (
            // !isChat &&
            // !isMySales &&
            // !isMyMembers &&
            !isMyPurchases &&
            // &&
            !isMyMembers &&
            // ||
            //   subscription !== data.chat.subscriptionId)
            data?.user?._id !== user._id
          ) {
            (!isChatActive ||
              selectedSub?._id !== data?.chat?.subscriptionId) &&
              showMessageToast?.(data);
            dispatch(incrementUnreadMessageCount());
            // return;
          }
          // if (
          //   // (!isChat && !isMySales && !isMyPurchases) ||
          //   (!isChat && !isMyMembers && !isMyPurchases) ||
          //   selectedSub?._id !== data.chat.subscriptionId
          // ) {

          //   checkUsersInList(data.user._id);
          // }
          else if (
            ((isMyMembers && data.chat.sentFrom === Users.buyer) ||
              (isMyPurchases && data.chat.sentFrom === Users.seller)) &&
            selectedSub?._id !== data.chat.subscriptionId
          ) {
            const userId = data.user._id;
            const sentFrom =
              data.chat.sentFrom === Users.seller ? 'buyer' : 'seller';
            checkUsersInList(
              data.chat.subscriptionId,
              userId,
              sentFrom,
              'chat-subscription',
            );
          }
          if (
            selectedSub?._id !== data.chat.subscriptionId ||
            (selectedSub?._id === data.chat.subscriptionId && !isChatActive)
          ) {
            dispatch(
              updateSubscriptionUnreadCount({
                subscriptionId: data.chat.subscriptionId,
              }),
            );

            dispatch(
              updateUsersUnreadCount({
                subscriptionId: data.chat.subscriptionId,
                isChatWindowActive: isChatActive,
              }),
            );
          }
          // if (subscription !== data.chat.subscriptionId) {
          //   dispatch(
          //     updateSubscriptionUnreadCount({
          //       subscriptionId: data.chat.subscriptionId,
          //     }),
          //   );
          //   dispatch(
          //     updateUsersUnreadCount({
          //       subscriptionId: data.chat.subscriptionId,
          //     }),
          //   );
          // }

          dispatch(
            updateLastMessage({
              id: data.chat.subscriptionId,
              message: data.chat,
            }),
          );
          dispatch(
            updateUserLastMessage({
              id: data.chat.subscriptionId,
              message: data.chat,
            }),
          );
        }
      });
    }

    return () => {
      socket?.off(user._id);
      socket?.off('support_agent');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    socket,
    subscription,
    selectedSub,
    isChatActive,
    manageUser,
    eventData?._id,
  ]);
  return null;
};

export default SelfiepopGeneralSocket;
