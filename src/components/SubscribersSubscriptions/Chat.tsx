import { deleteChat, payForMessage } from 'api/ChatSubscriptions';
import { updateImagesPhysically } from 'api/sales';
import { AddPhotosIcon, ImageThumbnail, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import axios from 'axios';
import classNames from 'classnames';
import LibraryModal from 'components/LibraryView';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useSocket from 'hooks/useSocket';
import FreePaidMessageInput from 'pages/chat/components/FreePaidInput';
import MessageInput from 'pages/chat/components/MessageInput';
import MessagesContainer from 'pages/chat/components/MessagesContainer';
// import PaidMessageInput from 'pages/chat/components/PaidMessageInput';
import { ExtraOrderTypes, ImagesScreenSizes } from 'appconstants';
import EmptydataMessage from 'components/EmtpyMessageData';
import { RequestLoader } from 'components/SiteLoader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { onToggleModal } from 'store/reducer/changeMembershipModal';

import {
  addMessage,
  // addPendingMessage,
  getMessages,
  markAllAsRead,
  removeMessage,
  removeMessageFiles,
  removePendingMessage,
  removeTemplateMessage,
  sendMedia,
  sendMessage,
  setMessage,
  setMessageFiles,
  setMessages,
  setPrice,
  updateEmojis,
  updateMessage,
} from 'store/reducer/chat';
import {
  resetLibraryMedia,
  setLibraryMedia,
  updateibraryMedia,
} from 'store/reducer/global';
import {
  addUserLastMessage,
  setUserUnreadCount,
  updateChatWindowActiveStatus,
} from 'store/reducer/salesState';
import { setSliderAttachments, toggleSlider } from 'store/reducer/slider';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useAnalytics } from 'use-analytics';
import {
  // appendScreenSizesToId,
  // createPendingMessage,
  getFilemetaData,
  // getImageURL,
  getUrlParts,
  // isValidUrl,
  processFilesForRotation,
} from 'util/index';
import { v4 } from 'uuid';
interface Props {
  className?: string;
  classNames?: string;
  managedAccountId?: string;
  messages?: ChatMessage[];
  isSeller?: boolean;
  isAllowMessages?: boolean;
  isManager?: boolean;
}

const ChatWidget: React.FC<Props> = (props) => {
  const {
    className,
    isSeller = true,
    isAllowMessages = true,
    managedAccountId,
    isManager = false,
  } = props;
  const { user } = useAuth();
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();
  const { socket } = useSocket();
  const selectedSubscription = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );

  const managedUser = useAppSelector((state) => state.managedUsers.item);
  const isFetchingMessages = useAppSelector(
    (state) => state.chat.isFetchingMessages,
  );
  const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  // const messageMedia = useAppSelector((state) => state.chat.messageFiles);
  const messageFiles = useAppSelector(
    (state) => state.global.selectedLibraryMedia,
  );
  const analytics = useAnalytics();
  // const selectedUser = useAppSelector((state) => state.mysales.selectedUser);
  const cancelToken = useRef<any>();
  const [selectedOptions, setSelectedOptions] = useState<
    'chat' | 'thumbs' | null
  >(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const scrollbarRef = useRef<any>(null);
  const messages = useAppSelector((state) => state.chat.messages);
  const dispatch = useAppDispatch();
  const [isMounting, setIsMounting] = useState(false);
  const [isSending, setIsSedning] = useState(false);
  const isOnlyAllowedToRead = isManager ? isManager && isAllowMessages : true;
  let viewBy: 'SELLER' | 'BUYER';
  if (managedAccountId) {
    viewBy = 'SELLER';
  } else {
    viewBy =
      user?._id === selectedSubscription?.sellerId._id ? 'SELLER' : 'BUYER';
  }
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollbarRef.current) {
        scrollbarRef.current.scrollToBottom();
      }
    }, 0);
  };
  useEffect(() => {
    dispatch(updateChatWindowActiveStatus(true));
    return () => {
      dispatch(updateChatWindowActiveStatus(false));
      dispatch(setMessage(''));
      dispatch(resetLibraryMedia());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (selectedSubscription?._id && selectedSubscription?.isActive) {
      setIsMounting(true);
    }
    return () => {};
  }, [selectedSubscription?._id]);
  useEffect(() => {
    if (templateMessage) {
      dispatch(setMessage(templateMessage?.messageValue));
      if (
        templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        setIsPaid(true);
        setSelectedOptions('chat');
        dispatch(setPrice(templateMessage?.price));
        dispatch(setMessageFiles(templateMessage.messageMedia));
      } else if (
        !templateMessage?.isPaidType &&
        !!templateMessage?.messageMedia?.length
      ) {
        setIsPaid(false);
        dispatch(setMessageFiles(templateMessage.messageMedia));
        setSelectedOptions('chat');
      }
    } else {
      setIsPaid(false);
      dispatch(setMessage(''));
      dispatch(setPrice(5));
      setSelectedOptions(null);
    }
  }, [dispatch, templateMessage]);
  useEffect(() => {
    setSelectedOptions(null);
    let isCancelled = false;
    if (selectedSubscription?._id && selectedSubscription?.isActive) {
      getSubscriptionMessages(selectedSubscription, () => {
        if (!isCancelled) {
          setIsMounting(false);
          scrollToBottom();
        }
      }).catch((e) => {
        !isCancelled && setIsMounting(false);
        console.log(e);
      });
    }

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubscription?._id]);
  useEffect(() => {
    const isManagerGhost = !!(isManager && user?.ghostMode && managedAccountId);
    if (selectedSubscription?._id && selectedSubscription?.isActive) {
      socket?.on(selectedSubscription._id, (data) => {
        if (data.type === 'paymentComplete') {
          dispatch(updateMessage(data.chat));
        }
        if (data.type === 'delete') {
          dispatch(removeMessage(data.chatId));
        }
        if (data.type === 'scheduled') {
          if (
            data?.data?.chat.subscriptionId === selectedSubscription._id &&
            user?._id === selectedSubscription?.sellerId?._id &&
            viewBy === 'SELLER' &&
            isSeller
          ) {
            dispatch(
              addMessage({
                ...data?.data?.chat,
                readBy: !isManagerGhost
                  ? {
                      profileImage: user.profileImage,
                      _id: user._id,
                      pageTitle: user.pageTitle,
                      username: user.username,
                    }
                  : null,
              }),
            );
            scrollToBottom();
            if (!isManagerGhost) {
              socket.emit('messageView', {
                messageId: data?.data?.chat?._id,
                readBy: user?._id,
              });
            }
          } else if (
            data?.data?.chat.subscriptionId === selectedSubscription._id &&
            data?.data?.chat?.sentFrom === 'SELLER' &&
            !isSeller
          ) {
            dispatch(
              addMessage({
                ...data?.data?.chat,
                readBy: !isManagerGhost
                  ? {
                      profileImage: user.profileImage,
                      _id: user._id,
                      pageTitle: user.pageTitle,
                      username: user.username,
                    }
                  : null,
              }),
            );
            scrollToBottom();
            if (!isManagerGhost) {
              socket.emit('messageView', {
                messageId: data?.data?.chat?._id,
                readBy: user?._id,
              });
            }
          }
        }
        if (data?.type === 'chat') {
          if (
            (data.chat.subscriptionId === selectedSubscription._id &&
              data.chat.sentFrom !== viewBy) ||
            data?.chat?.creator === 'rules'
          ) {
            dispatch(
              addMessage({
                ...data.chat,
                readBy: !isManagerGhost
                  ? {
                      profileImage: user.profileImage,
                      _id: user._id,
                      pageTitle: user.pageTitle,
                      username: user.username,
                    }
                  : null,
              }),
            );
            scrollToBottom();
            if (!isManagerGhost) {
              socket.emit('messageView', {
                messageId: data.chat._id,
                readBy: user?._id,
              });
            }
          }
        }

        if (data.type === 'messageView') {
          if (data.userId === user?._id || data.messageId) {
            if (data.messageId) {
              dispatch(
                updateMessage({ _id: data.messageId, isRead: !isManagerGhost }),
              );
            } else {
              if (!isManagerGhost) {
                dispatch(
                  setUserUnreadCount({
                    unread: data?.unread || 0,
                    subscriptionId: selectedSubscription?._id,
                  }),
                );
                dispatch(markAllAsRead({}));
              }
            }
          }
        }

        if (data.type === 'emoji') {
          dispatch(
            updateEmojis({ emojis: data.emojis, messageId: data.messageId }),
          );
        }
      });
    }

    return () => {
      socket?.off(selectedSubscription?._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSubscription?._id,
    // selectedUser,
    managedUser,
    isManager,
    selectedSubscription?.isActive,
  ]);
  const getSubscriptionMessages = async (
    sub: ChatSubsType,
    callback?: () => void,
    params: Record<string, any> = {},
  ) => {
    if (cancelToken.current !== undefined) {
      cancelToken.current.cancel('Operation canceled due to new request.');
    }
    cancelToken.current = axios.CancelToken.source();
    dispatch(setMessages({ items: [], totalCount: 0 }));
    dispatch(
      getMessages({
        subscriptionId: sub._id,
        callback,
        options: {
          params: { limit: 10, sellerId: managedAccountId, ...params },
          cancelToken: cancelToken.current.token,
        },
        handleError: false,
      }),
    ).catch((e) => {
      console.log(e);
    });
  };

  const getPaginatedSubscriptionMessages = async (
    sub: ChatSubsType,
    params: Record<string, any> = {},
    callback?: (...args: any) => void,
  ) => {
    if (sub?._id) {
      if (cancelToken.current !== undefined) {
        cancelToken.current.cancel('Operation canceled due to new request.');
      }
      cancelToken.current = axios.CancelToken.source();
      return dispatch(
        getMessages({
          subscriptionId: sub._id,
          callback,
          options: {
            params: { limit: 10, sellerId: managedAccountId, ...params },
            cancelToken: cancelToken.current.token,
          },
        }),
      )
        .unwrap()
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedSubscription && !!message?.trim()) {
      dispatch(
        addUserLastMessage({
          id: selectedSubscription?._id,
          message: {
            messageValue: message,
            createdAt: dayjs(),
          },
        }),
      );
      dispatch(
        sendMessage({
          subscriptionId: selectedSubscription._id,
          message,
          paidtype: false,
          id: v4(),
          sellerId: managedAccountId,
          viewBy: managedAccountId && viewBy,
        }),
      ).catch((e) => {
        console.log(e);
      });
      dispatch(setMessage(''));
      dispatch(removeTemplateMessage());
    }
    scrollToBottom();
  };
  // eslint-disable-next-line
  const onComplete = async (
    uploadedFiles: Record<string, any>,
    message: string,
    price: number,
    messageKey: string,
    subId?: string,
  ) => {
    const files = [];
    for (let j = 0; j < (uploadedFiles?.files || []).length; j++) {
      let f = uploadedFiles.files[j];

      const isVideo = attrAccept({ type: f.type }, 'video/*');
      const isAudio = attrAccept({ type: f.type }, 'audio/*');
      f = await getFilemetaData(f);
      const width = f.width || 0;
      const height = f.height || 0;
      // const isUploaded: boolean = isValidUrl(f?.path);
      const blurThumbnail = f?.blurThumbnail;
      // if (!blurThumbnail && isUploaded && !isAudio) {
      //   blurThumbnail = getImageURL({
      //     url: f.imageURL || f.thumb || f.url || f.path,
      //     settings: {
      //       bdesktop: true,
      //     },
      //   })?.url;
      // }
      const id =
        f._id ||
        f.id ||
        getUrlParts(f.path ? f.path : f.url)
          ?.pathname?.split('_')
          ?.pop()
          ?.split('.')?.[0];
      const file: any = {
        // id: getUrlParts(f.path ? f.path : f.url)
        //   ?.pathname?.split('_')
        //   ?.pop()
        //   ?.split('.')?.[0],
        id: id,
        _id: id,
        type: isVideo
          ? 'video/mp4'
          : !isAudio
          ? `image/${(f.path ? f.path : f.url)?.split('.')?.pop()}`
          : f.type,
        path: f.path ? f.path : f.url,
        thumbnail: f.thumbnail,
        isPaidType: !!f.isPaidType,
        name: f.name,
        videoDuration: f.timeDuration,
        size: f.size || 0,
        duration: f.duration,
        blurThumbnail: blurThumbnail,
        width,
        height,
      };
      if (f.rotate !== undefined && f._id) {
        const isRotateable = (((f.rotate || 0) % 360) + 360) % 360 !== 0;
        if (isRotateable) {
          file.rotate = f.rotate;
        }
      }
      files.push(file);
    }
    dispatch(
      removePendingMessage({
        _id: messageKey,
      }),
    );
    const promises: any = [];
    const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
      files,
      ImagesScreenSizes.chat,
    );
    newFiles?.forEach((f: any) => {
      promises.push(
        updateImagesPhysically({
          url: f.oldUrl,
          name: f.path.split('/').pop(),
        }),
      );
    });
    await Promise.all([...promises]).then(() => {
      dispatch(
        sendMedia({
          subscriptionId: subId!,
          data: {
            price: price,
            message: message,
            blurThumnail: filesWithoutRotation.find((f) => f.blurThumbnail)
              ?.blurThumbnail,
            library: filesWithoutRotation,
            sellerId: managedAccountId,
            templateId: templateMessage?._id,
          },
        }),
      );
      dispatch(removeTemplateMessage());
    });
  };
  const handleOnSubmitMedia = async (
    messageMedia?: any[],
    message?: string,
    price?: number,
    subId?: string,
  ) => {
    const newMedia = messageMedia?.map((m) => {
      // eslint-disable-next-line
      const { addedBy, sortOrder, userId, index, ...rest } = m;
      const media = { ...rest };
      return media;
    });
    setIsSedning(true);
    setSelectedOptions(null);
    dispatch(setMessage(''));
    dispatch(setPrice(5));
    dispatch(removeMessageFiles());
    dispatch(resetLibraryMedia());
    return dispatch(
      sendMedia({
        subscriptionId: subId!,
        data: {
          price: price,
          message: message,
          blurThumnail: messageMedia?.find((f) => f.blurThumbnail)
            ?.blurThumbnail,
          library: newMedia || [],
          sellerId: managedAccountId,
          templateId: templateMessage?._id,
        },
      }),
    )
      .unwrap()
      .then((d) => {
        if (subId === selectedSubscription?._id) {
          setIsSedning(false);
          scrollToBottom();
        }
        return d;
      })
      .catch((e) => {
        console.log({ e });
      });
  };
  const onSubmitHandler = useCallback((props: any) => {
    if (!!props) {
      dispatch(setLibraryMedia({ items: props }));
      setSelectedOptions('chat');
    }
    onNewListCloseModel();
    return;
  }, []);
  const onCancelHandler = useCallback(() => {
    onNewListCloseModel();
    return;
  }, []);
  const buyPaidMessage = useCallback(
    async (subscriptionId: any, MessageId: any, viewBy: any, price: any) => {
      if (viewBy === 'BUYER') {
        await payForMessage(subscriptionId!, MessageId!, dispatch)
          .then(() => {
            analytics.track('message_unlock', {
              purchasedFrom:
                selectedSubscription?.sellerId?._id || managedAccountId,
              buyerId: user?._id,
              purchaseTypeSlug: ExtraOrderTypes.message_unlock,
              purchaseAmount: price,
              itemId: MessageId,
            });
          })
          .catch((e) => {
            if (e && e?.message) {
              toast.error(e.message);
            } else {
              toast.error('Something went wrong please try again!');
            }
          });

        return;
      }
      toast.error(`Can't buy your own message`);
    },
    [],
  );
  // const handleScroll = async () => {
  //   if (scrollbarRef.current) {
  //     const isTop = scrollbarRef.current.view.scrollTop;
  //     if (isTop < 10 && messages.hasMore && !isFetchingMessages) {
  //       const beforeScrollHeight = scrollbarRef.current?.getScrollHeight();
  //       getPaginatedSubscriptionMessages(
  //         selectedSubscription!,
  //         {
  //           endingBefore: messages.items[0]._id,
  //         },
  //         (response: any) => {
  //           if (!!response?.items?.length) {
  //             // getSubscripton();
  //             setTimeout(() => {
  //               const getlement = document?.querySelector(
  //                 `.messages-container > div:nth-child(${response.items.length})`,
  //               );

  //               getlement?.scrollIntoView({
  //                 // behavior: 'smooth',
  //                 block: 'end',
  //               });
  //             }, 0);
  //           }
  //         },
  //       )
  //         .then(() => {
  //           setTimeout(() => {
  //             const afterScrollHeight = scrollbarRef.current?.getScrollHeight();
  //             if (afterScrollHeight && beforeScrollHeight) {
  //               scrollbarRef.current?.scrollTop(
  //                 afterScrollHeight - beforeScrollHeight,
  //               );
  //             }
  //           }, 0);
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         });
  //     }
  //   }
  // };
  // eslint-disable-next-line
  const scrollMetoView = (value: number) => {
    if (value) {
      scrollbarRef.current?.scrollTop(value);
    }
  };
  const handleScroll = async () => {
    if (scrollbarRef.current) {
      const isTop = scrollbarRef.current.view.scrollTop;
      if (isTop < 10 && messages.hasMore && !isFetchingMessages) {
        const beforeScrollHeight = scrollbarRef.current?.getScrollHeight();
        getPaginatedSubscriptionMessages(
          selectedSubscription!,
          {
            endingBefore: messages.items[0]._id,
          },
          () => {
            // if (!!response?.items?.length) {
            //   // getSubscripton();
            //   setTimeout(() => {
            //     const getlement = document?.querySelector(
            //       `.messages-container > div:nth-child(${response.items.length})`,
            //     );
            //     getlement?.scrollIntoView({
            //       // behavior: 'smooth',
            //       block: 'end',
            //     });
            //   }, 0);
            // }
          },
        )
          .then(() => {
            // setTimeout(() => {
            let afterScrollHeight = scrollbarRef.current?.getScrollHeight();
            const minusvalues = afterScrollHeight - beforeScrollHeight;

            if (minusvalues > 100) {
              scrollMetoView(minusvalues);
            } else {
              setTimeout(() => {
                afterScrollHeight = scrollbarRef.current?.getScrollHeight();
                scrollMetoView(minusvalues);
              }, 0);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

  const onDeleteMessage = async (messageId: string) => {
    if (!isOnlyAllowedToRead) {
      toast.error("You don't have permission to delete a message!");
      return;
    }
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this message!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    } as any)
      .then(async (willDelete: boolean) => {
        if (willDelete) {
          if (selectedSubscription?._id) {
            deleteChat({
              subscriptionId: selectedSubscription?._id,
              messageId: messageId,
              params: { sellerId: managedAccountId },
            })
              .then(() => {
                dispatch(removeMessage(messageId));
              })
              .catch((e) => {
                if (e.message) {
                  toast.error(e?.message || 'Something Went wrong');
                }
                console.log(e);
              });
          }
        }
      })
      .catch((e) => console.log(e));
  };
  if (isMounting && !isSeller) {
    return (
      <RequestLoader
        isLoading={true}
        className="mt-25"
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
    );
  }
  if (selectedSubscription?._id && !selectedSubscription?.isActive) {
    return (
      <div className="py-30 px-10 empty-data text-center">
        Subscription is not active!
      </div>
    );
  }
  if (!selectedSubscription?._id && !isFetchingMessages && !isSeller) {
    return (
      <EmptydataMessage text="You don't have any Subscription Selected." />
    );
  }
  const sellerName = `${
    selectedSubscription?.sellerId?.pageTitle ?? 'Incognito User'
  }`;
  return (
    <div className={className}>
      {selectedSubscription?._id &&
        !messages.items?.length &&
        !isFetchingMessages &&
        isAllowMessages && (
          <div className="py-30 px-10 empty-data text-center">
            Start Conversation...
          </div>
        )}
      <MessagesContainer
        handleScroll={handleScroll}
        scrollbarRef={scrollbarRef}
        buyPaidMessage={buyPaidMessage}
        managedAccountId={managedAccountId}
        managedUser={managedUser}
        onAttachmentClick={(attachment) => {
          dispatch(setSliderAttachments({ items: attachment, active: null }));
          dispatch(toggleSlider(true));
        }}
        onDeleteMessage={onDeleteMessage}
        showActions={isOnlyAllowedToRead}
      />
      {selectedOptions === 'chat' ? (
        <>
          <FreePaidMessageInput
            isSending={isSending}
            onSend={async (message?: string, price?: number) => {
              console.log('On Complete', {
                message,
                price,
                id: selectedSubscription?._id,
                messageFiles,
              });
              return await handleOnSubmitMedia(
                messageFiles,
                message,
                price,
                selectedSubscription?._id,
              );
              // onComplete(
              //   uploadedFiles,
              //   message,
              //   price,
              //   messageKey,
              //   selectedSubscription?._id,
              // );
            }}
            hasPaid={isSeller}
            defaultType={isPaid ? 'pay-to-view' : 'standard'}
            onFileChange={(libraryObjectFiles) => {
              const newMedia = [...(libraryObjectFiles || [])];
              const nFiles: any = {};
              newMedia?.forEach((med: any) => {
                nFiles[med._id] = med;
              });
              dispatch(resetLibraryMedia());
              dispatch(updateibraryMedia({ items: nFiles }));
            }}
            onCloseTabs={() => {
              dispatch(resetLibraryMedia());
              dispatch(removeTemplateMessage());
              dispatch(removeMessageFiles());
              setSelectedOptions(null);
              dispatch(setMessage(''));
              setPrice(5);
            }}
            files={messageFiles}
            customButton={
              <>
                {messageFiles?.length > 0 ? (
                  <div
                    className="upload_placeholder"
                    onClick={onNewListOpenModel}
                  >
                    <PlusFilled />
                  </div>
                ) : (
                  <Button
                    icon={<ImageThumbnail />}
                    block
                    type="primary"
                    shape="circle"
                    className="bg-blue"
                    onClick={onNewListOpenModel}
                  >
                    ATTACH MEDIA
                  </Button>
                )}
              </>
            }
          />
          {/* <PaidMessageInput
            onComplete={(
              uploadedFiles: Record<string, any>,
              message: string,
              price: number,
              messageKey: string,
            ) =>
              onComplete(
                uploadedFiles,
                message,
                price,
                messageKey,
                selectedSubscription?._id,
              )
            }
            hasPaid={isSeller}
            defaultType={isPaid ? 'pay-to-view' : 'standard'}
            onSubmit={(files, message, price, messageKey) => {
              let newMedia = files || [];
              newMedia = files?.map((m: any) => {
                const { file: newFile } = appendScreenSizesToId({
                  id: m?.id,
                  sizes: ImagesScreenSizes.chat,
                  userId: user?._id,
                  rotateAll: m.rotate,
                  createpathagain: true,
                  file: m.orignalFile,
                });
                const file = {
                  ...m,
                };

                return {
                  orignalFile: newFile,
                  createdAt: dayjs().format(),
                  isPaidType: file.isPaidType ?? false,
                  islock: file.islock ?? false,
                  name: file.name,
                  path: file.path,
                  thumbnail: file.thumb,
                  type: file.type,
                  _id: file._id || file.id,
                  blurThumbnail: file?.blurThumbnail,
                  videoDuration: file.videoDuration,
                  imageURL: file.imageURL,
                };
              });
              if (!newMedia?.length) {
                handleSendMessage(message as string);
              } else {
                dispatch(
                  addPendingMessage(
                    createPendingMessage({
                      isPaidType: newMedia?.[0]?.isPaidType,
                      messageMedia: newMedia,
                      messageType: 'SIMPLE',
                      messageValue: message,
                      price,
                      sentFrom: viewBy,
                      subscriptionId: selectedSubscription?._id,
                      _id: messageKey,
                    }),
                  ),
                );
              }
              scrollToBottom();
              setSelectedOptions(null);
              dispatch(setMessage(''));
              dispatch(setPrice(5));
              dispatch(removeMessageFiles());
              dispatch(resetLibraryMedia());
            }}
            onFileChange={(libraryObjectFiles) => {
              const newMedia = [...(libraryObjectFiles || [])];
              const nFiles: any = {};
              newMedia?.forEach((med: any) => {
                nFiles[med._id] = med;
              });
              dispatch(resetLibraryMedia());
              dispatch(updateibraryMedia({ items: nFiles }));
            }}
            onCloseTabs={() => {
              dispatch(resetLibraryMedia());
              dispatch(removeTemplateMessage());
              dispatch(removeMessageFiles());
              setSelectedOptions(null);
              dispatch(setMessage(''));
              setPrice(5);
            }}
            media={messageFiles}
            files={messageFiles}
            customButton={
              <>
                {messageFiles?.length > 0 ? (
                  <div
                    className="upload_placeholder"
                    onClick={onNewListOpenModel}
                  >
                    <PlusFilled />
                  </div>
                ) : (
                  <Button
                    icon={<ImageThumbnail />}
                    block
                    type="primary"
                    shape="circle"
                    className="bg-blue"
                    onClick={onNewListOpenModel}
                  >
                    ATTACH MEDIA
                  </Button>
                )}
              </>
            }
          /> */}
        </>
      ) : isAllowMessages ? (
        <div className="chat-input">
          {selectedOptions === null && (
            <div className="input-wrap">
              <MessageInput handleSendMessage={handleSendMessage} />
            </div>
          )}
          {/* <hr /> */}
          <div className="input-actions">
            <span
              className="input-actions__img"
              onClick={() => onNewListOpenModel()}
            >
              <AddPhotosIcon />
            </span>
          </div>
        </div>
      ) : (
        <div className="chat-input">
          <div
            className={classNames('alert alert-secondary', {
              cursorclick: !isManager,
            })}
            role="alert"
            onClick={(e) => {
              e.stopPropagation();
              if (!isManager) {
                const isSellerDeActived =
                  selectedSubscription?.sellerId?.isDeactivate;

                if (isSellerDeActived) {
                  toast.error(`You can't updgrade your subscription for now`);
                  return;
                }
                dispatch(
                  onToggleModal({
                    isModalOpen: true,
                  }),
                );
              }
            }}
          >
            <i className="icon-info"></i>{' '}
            {!isManager
              ? `Please click here to upgrade to send
            messages to ${sellerName}`
              : `Access to send messages is restricted. Contact ${sellerName} if you believe this is an error.`}
          </div>
        </div>
      )}
      {isNewListModelOpen && (
        <LibraryModal
          notAllowedTypes={['audio']}
          buyer={selectedSubscription?.buyerId}
          isOpen={isNewListModelOpen}
          onPostHandler={onSubmitHandler}
          onCancel={onCancelHandler}
          managedAccountId={managedAccountId}
          addtoButtontext="Add to Message"
        />
      )}
    </div>
  );
};

export default styled(ChatWidget)`
  padding-left: 20px;
  @media (max-width: 767px) {
    padding-left: 10px;
  }

  .messages-container {
    padding: 20px 20px 10px 0;
    @media (max-width: 767px) {
      padding: 16px 10px 10px 0;
    }
  }
  .send-spinner {
    background: var(--pallete-primary-main);
    border-radius: 50%;
    padding: 6px;
    position: absolute;
    right: 8px;
    top: 8px;
    width: 42px;
    cursor: pointer;
    z-index: 2;
    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
  .chat-input {
    padding: 0 15px 0 0;
    @media (max-width: 767px) {
      padding: 0 6px 0 0;
    }
    .input-wrap {
      margin-bottom: 9px;
    }
    .text-input {
      margin-bottom: 15px !important;
    }
    .form-control {
      border: none;
      background: var(--pallete-background-gray-secondary-light);
      height: 60px;
      border-radius: 60px;
      padding: 10px 70px;
      font-weight: 400;
      font-size: 16px;
      &::placeholder {
        color: var(--pallete-primary-main);
        opacity: 0.63;
      }
    }
    .pre-fix {
      width: 22px;
      color: var(--pallete-primary-main);
      top: 50%;
      transform: translate(0, -50%);
      left: 18px;
      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
    .icon {
      top: 50%;
      transform: translate(0, -50%);
      width: 42px;
      max-width: inherit;
      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
    hr {
      margin: 0 -20px;
      border-color: var(--pallete-colors-border);
      @media (max-width: 767px) {
        margin: 0 -10px;
      }
    }
    .input-actions {
      padding: 11px 0;
      color: var(--pallete-primary-main);
      .sp_dark & {
        color: rgba(255, 255, 255, 0.8);
      }
      .input-actions__img {
        margin-right: 26px;
        cursor: pointer;
      }
      path {
        fill: currentColor;
      }
    }
    /*.emoji-mart {
      position: absolute;
      bottom: 100%;
      left: 0;
      margin: 0 0 15px;
    }*/
  }
  .input-wrap {
    position: relative;
  }
  .sub-tabs-holder {
    padding: 10px 0 0;
    margin: 0 0 0 -20px;
    position: relative;
    max-width: inherit;
    @media (max-width: 767px) {
      margin: 0 0 0 -10px;
    }
    .rc-tabs-content-holder {
      overflow: visible;
    }
    .sub-tab-cotnent {
      padding: 0 20px 20px;
      @media (max-width: 767px) {
        padding: 0 10px 6px;
      }
    }
    .btns-links {
      .button {
        color: var(--pallete-text-light-150);
        svg {
          margin-right: 5px;
        }
      }
    }
    /* tabs updated style for chat */
    .chat_sub {
      position: relative;
    }
    .rc-tabs-card {
      .rc-tabs-nav-list {
        margin: 0;
      }
      .rc-tabs-nav-wrap {
        padding: 0 44px 0 0;
        @media (max-width: 767px) {
          padding: 0;
        }
      }
      .rc-tabs-tab {
        margin: 0;
        flex: 1;
        border-radius: 0;
        padding: 10px 16px;
        &:nth-last-child(2) {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .btns-links {
      .button {
        color: var(--pallete-text-light-150);
        svg {
          margin-right: 5px;
        }
      }
    }
    .tab-close {
      position: absolute;
      right: -1px;
      top: 0;
      width: 46px;
      height: 43px;
      border: 1px solid var(--pallete-colors-border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--pallete-primary-main);
      z-index: 10;
      background: var(--pallete-background-default);
      @media (max-width: 767px) {
        border: none;
        height: 40px;
      }
      &.top-align {
        top: 0;
        right: -1px;
        &.max-top-align {
          /* top: -42px; */
        }
      }
    }
  }
  .input-wrap {
    position: relative;
  }
  .emoji-wrapper {
    position: relative;
    .icon {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 3;
      cursor: pointer;
      transform: none;
    }
  }
  .react-emoji {
    display: block;
    position: relative;
    .react-input-emoji--container {
      margin: 0 !important;
      border: none;
      background: none;
    }
    .react-input-emoji--wrapper {
      background: var(--pallete-background-gray-secondary);
      border-radius: 30px;
      padding: 20px 70px 20px 54px;

      .sp_dark & {
        background: #262626;
      }
    }
    .react-input-emoji--placeholder {
      /* color: var(--pallete-primary-main); */
      /* opacity: 0.63; */
      color: #bfbfbf;
    }
    .react-input-emoji--placeholder {
      left: 54px;
      width: calc(100% - 60px);
    }
    .react-input-emoji--input {
      min-height: inherit;
      height: auto;
      margin: 0;
      padding: 0;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: var(--pallete-text-main-700);
      white-space: normal;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .react-input-emoji--button {
      position: absolute;
      left: 18px;
      bottom: 18px;
      color: var(--pallete-primary-main);
      z-index: 2;
      padding: 0;
      .sp_dark & {
        color: rgba(255, 255, 255, 0.8);
      }
      svg {
        fill: currentColor;
      }
    }
    .react-emoji-picker--wrapper {
      right: auto;
      left: 0;
      width: 355px;
    }
  }
  .btn-send {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 42px;
    cursor: pointer;
    z-index: 2;
    padding: 0;
    top: auto;
    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
  .cursorclick {
    cursor: pointer;
  }
`;
