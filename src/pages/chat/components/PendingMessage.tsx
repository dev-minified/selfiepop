import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import attrAccept from 'attr-accept';

import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { removePendingMessage, updatePendingMessage } from 'store/reducer/chat';
import { getFilemetaData, getUrlParts } from 'util/index';
import MessageBox from './ChatWidget/Message';

interface Props {
  buyPaidMessage(
    subId: string,
    messageId: string,
    viewBy: 'BUYER' | 'SELLER',
    price?: number,
  ): Promise<void>;

  managedAccountId?: string;
}

const PendingMessagesContainer: React.FC<Props> = (props) => {
  const {
    managedAccountId,

    buyPaidMessage,
  } = props;
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // const templateMessage = useAppSelector((state) => state.chat.templateMessage);
  const selectedSubscription = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );
  const uploadingGroup = useAppSelector((s) => s.fileGroups);
  const pendingMessages = useAppSelector((state) => state.chat.pendingMessages);
  let viewBy: 'SELLER' | 'BUYER';
  if (managedAccountId) {
    viewBy = 'SELLER';
  } else {
    viewBy =
      user?._id === selectedSubscription?.sellerId._id ? 'SELLER' : 'BUYER';
  }
  useEffect(() => {
    async function sendMed() {
      for (let index = 0; index < pendingMessages.length; index++) {
        const message = pendingMessages[index];
        const group = uploadingGroup[message._id!];
        if (group) {
          let isSent = false;
          if (
            group.status === MEDIA_UPLOAD_STATUSES.COMPLETED &&
            !message.isSent
          ) {
            const files = [];
            for (let j = 0; j < group.files.length; j++) {
              let f = group.files[j];

              const isVideo = attrAccept({ type: f.type }, 'video/*');

              f = await getFilemetaData({ ...f });

              const file: any = {
                id: getUrlParts(f.path ? f.path : f.url)
                  ?.pathname?.split('_')
                  ?.pop()
                  ?.split('.')?.[0],
                type: isVideo ? 'video/mp4' : f.type,
                path: f.path ? f.path : f.url,
                thumbnail: f.thumbnail,
                isPaidType: f.isPaidType,
                name: group.files[j].name,
                videoDuration: f.timeDuration,
                duration: f.duration,
                blurThumbnail: f?.blurThumbnail,
              };
              if (f.rotate !== undefined && f._id) {
                const isRotateable =
                  (((f.rotate || 0) % 360) + 360) % 360 !== 0;
                if (isRotateable) {
                  file.rotate = f.rotate;
                }
              }
              files.push(file);
            }
            dispatch(
              removePendingMessage({
                _id: message._id,
              }),
            );
            // const promises: any = [];

            // const { filesWithoutRotation = [], newFiles } =
            //   processFilesForRotation(files, ImagesScreenSizes.chat);
            // newFiles?.forEach((f: any) => {
            //   promises.push(
            //     updateImagesPhysically({
            //       url: f.oldUrl,
            //       name: f.path.split('/').pop(),
            //     }),
            //   );
            // });
            // await Promise.all([...promises]).then(() => {
            //   dispatch(
            //     sendMedia({
            //       subscriptionId: message.subscriptionId,
            //       data: {
            //         price: message.price,
            //         message: message?.messageValue,
            //         blurThumnail: filesWithoutRotation?.[0]?.isPaidType
            //           ? filesWithoutRotation?.[0]?.blurThumnail
            //           : undefined,
            //         library: filesWithoutRotation,
            //         sellerId: managedAccountId,
            //         templateId: templateMessage?._id,
            //       },
            //     }),
            //   );
            //   dispatch(removeTemplateMessage());
            // });
            isSent = true;
          }
          dispatch(
            updatePendingMessage({
              ...message,
              isSent,
              messageMedia: message.messageMedia.map((media) => {
                const file = group.files.find((f) => f.id === media._id);
                if (file) {
                  return {
                    ...media,
                    ...file,
                    path:
                      group.status === MEDIA_UPLOAD_STATUSES.COMPLETED
                        ? file?.path
                          ? file.path
                          : file.url
                        : media.path,
                  };
                }

                return media;
              }),
            }),
          );
        }
      }
    }
    sendMed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingGroup]);
  return (
    <>
      <>
        {pendingMessages
          ?.filter((m) => m.subscriptionId === selectedSubscription?._id)
          ?.map((message) => {
            return (
              <MessageBox
                showActions={false}
                key={message._id}
                message={message}
                orientation={message.sentFrom === viewBy ? 'right' : 'left'}
                image={
                  managedAccountId
                    ? '/assets/images/default-profile-img.svg'
                    : message.sentFrom === 'SELLER'
                    ? selectedSubscription?.sellerId?.profileImage
                    : selectedSubscription?.buyerId?.profileImage
                }
                viewBy={viewBy}
                buyPaidMessage={buyPaidMessage}
                managedAccountId={managedAccountId}
              />
            );
          })}
      </>
    </>
  );
};

export default PendingMessagesContainer;
