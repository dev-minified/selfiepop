import { getTicket } from 'api/Support';
import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import { LockIcon, Share } from 'assets/svgs';
import AdditionalArt from 'components/InlinePopForm/AdditionalArt';
import Button from 'components/NButton';
import { DashedLine } from 'components/Typography';
import FileUploadReduxHoc from 'components/UploadWidget/FileUploadReduxHoc';
import FocusInput from 'components/focus-input';
import SelfiepopText from 'components/selfipopText';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SupportTicketStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useSocket from 'hooks/useSocket';
import { ITicket, ITicketMessage } from 'interfaces/Ticket';
import React, { useEffect, useState } from 'react';
import { onFileUploadingCancelled, onRemoveGroup } from 'store/reducer/files';
import {
  addPendingMessage,
  removeFromPendingMessage,
  updatePendingMessage,
  updateSupportChatCount,
} from 'store/reducer/support';
import styled from 'styled-components';
import { getChangeUrlsOnly } from 'util/index';
import SupportFileContainer from './SupportFileContainer';
dayjs.extend(utc);

interface Props {
  ticket: ITicket;
  sendMessage(
    message: string,
    ticket: ITicket,
    attachments: any[],
  ): Promise<void>;
  className?: string;
  updateTicket(ticketId: string, newTicket: ITicket): void;
  closeTicket?(ticket: ITicket): Promise<void>;
}
let time: any = null;
const TicketDetails: React.FC<Props> = (props) => {
  const {
    className,
    sendMessage,
    closeTicket,
    ticket: propTicket,
    updateTicket,
  } = props;
  const { user } = useAuth();
  const [ticket, setTicket] = useState<ITicket>({});
  const [commentMessage, setCommentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { socket } = useSocket();
  const uploadingGroup = useAppSelector((s) => s.fileGroups);
  const { pendingMessages } = useAppSelector((s) => s.support);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (propTicket._id) {
      setCommentMessage('');
      setIsLoading(
        uploadingGroup?.[propTicket?._id || '']?.status ===
          MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
      );
      checkStatus();
      socket?.off(ticket?._id);
      setTicket(propTicket);
      getTicket(propTicket._id)
        .then((res) => {
          setTicket(res);
          const unreadmsgs = calculate(propTicket);
          if (!!unreadmsgs) {
            dispatch(
              updateSupportChatCount({
                comments: unreadmsgs,
              }),
            );
            updateTicket(propTicket._id!, res);
          }

          socket?.on(res._id, (data: ITicketMessage) => {
            const isAdmin = data.commentDirection === 'user';
            if (
              ((user?.isSupportAgent && isAdmin) ||
                (!user?.isSupportAgent && !isAdmin)) &&
              data?._id
            ) {
              socket?.emit('ticketView', res._id, data._id);
            }

            data?._id &&
              setTicket((prev) => {
                const newTicket = {
                  ...prev,
                  issueComments: prev.issueComments
                    ? [...prev.issueComments, { ...data, read: true }]
                    : [{ ...data, read: true }],
                };
                const unreadmsgs = calculate({
                  ...prev,
                  issueComments: prev.issueComments
                    ? [...prev.issueComments, { ...data }]
                    : [{ ...data }],
                });
                if (!!unreadmsgs) {
                  clearTimeout(time);
                  time = setTimeout(() => {
                    dispatch(
                      updateSupportChatCount({
                        comments: unreadmsgs,
                      }),
                    );
                  }, 10);
                }

                updateTicket(prev._id!, newTicket);

                return newTicket;
              });
          });
        })
        .catch(console.log);
    }
    return () => {
      socket?.off(ticket?._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propTicket]);
  const calculate = (tick: any) => {
    let commentsUnRead = [];
    if (user?.isSupportAgent) {
      commentsUnRead =
        tick.issueComments?.filter(
          (a: any) => a.read === false && a.commentDirection !== 'admin',
        ) || [];
    } else if (user?._id === tick.userId?._id) {
      commentsUnRead =
        tick.issueComments?.filter(
          (a: any) => a.read === false && a.commentDirection !== 'user',
        ) || [];
    }
    return commentsUnRead.length;
  };
  function checkStatus() {
    const messages = pendingMessages?.find((m) => m.groupId === propTicket._id);
    const isGroup = uploadingGroup[messages?.groupId || ''];
    if (isGroup) {
      if (isGroup?.status !== MEDIA_UPLOAD_STATUSES.CANCELLED) {
        dispatch(
          updatePendingMessage({
            groupId: messages?.groupId,
            ...isGroup,
            files: isGroup?.files?.filter(
              (f) => f.status !== MEDIA_UPLOAD_STATUSES.CANCELLED,
            ),
          }),
        );
      } else {
        dispatch(
          onRemoveGroup({
            groupId: propTicket._id,
          }),
        );
        dispatch(
          removeFromPendingMessage({
            groupId: propTicket._id,
          }),
        );
      }
    }
  }
  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingGroup]);
  const sendCommentMessage = (
    message: string,
    ticket: ITicket,
    uploadedFiles: Record<string, any>,
    callBack?: any,
  ) => {
    sendMessage(
      message,
      ticket,
      uploadedFiles?.files
        ?.filter((f: any) => f.status !== MEDIA_UPLOAD_STATUSES.CANCELLED)
        .map((f: any) => ({
          type: f.type,
          path: f.url,
          url: f.url,
          size: f.size,
          thumbnail: f.thumbnail,
          isPaidType: f.isPaidType,
          name: f.name,
          videoDuration: f.duration,
        })),
    )
      .then(() => {
        callBack?.();
        dispatch(
          onRemoveGroup({
            groupId: ticket._id,
          }),
        );
        dispatch(
          removeFromPendingMessage({
            groupId: ticket._id,
          }),
        );
      })
      .catch((e) => {
        dispatch(
          onRemoveGroup({
            groupId: ticket._id,
          }),
        );
        dispatch(
          removeFromPendingMessage({
            groupId: propTicket._id,
          }),
        );
        console.log(e);
        callBack?.();
      });
  };
  const pendingMessagess = pendingMessages?.find(
    (m) => m?.groupId === propTicket._id,
  );
  return (
    <div className={className}>
      <div className="ticket-detail">
        <div className="support-head">
          <h2>
            Support Ticket <span className="counter">#{ticket?.ticketNo}</span>
            <span className="ticket-id">{ticket?.userId?._id}</span>
          </h2>
          <span className="support-tag">{ticket?.issueStatus}</span>
        </div>
        <div className="support-body">
          <div className="user-detail">
            <p>
              <strong>Name:</strong>{' '}
              <span>{`${ticket?.userId?.pageTitle ?? 'Incognito User'}`}</span>
            </p>
            <p>
              <strong>E-mail:</strong> <span>{ticket?.userId?.email}</span>
            </p>
          </div>
          <p>
            <strong>Profile:</strong>{' '}
            <a
              href={`${window.location.protocol}//${window?.location.host}/${ticket?.userId?.username}`}
              target="_blank"
              rel="noreferrer"
              className="link-profile"
            >
              {ticket?.userId?.username}
              <Share />
            </a>
          </p>
          <span className="title-holder">
            Title: <strong className="title">{ticket?.issueTitle}</strong>
          </span>
          <p className="ticket-description">
            <strong>Description:</strong>{' '}
            <span>{ticket?.issueDescription}</span>
          </p>
          <ul className="list-timing">
            <li>
              Opened:{' '}
              <span className="date">
                {dayjs
                  .utc(ticket?.createdAt)
                  .local()
                  .format('MM/DD/YYYY - h:mm A')}
              </span>
            </li>
            {ticket?.issueLastUpdated && (
              <li>
                Updated:{' '}
                <span className="date">
                  {dayjs
                    .utc(ticket?.issueLastUpdated)
                    .local()
                    .format('MM/DD/YYYY - h:mm A')}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <DashedLine className="mb-20" />

      {!!propTicket?.attachments && (
        <AdditionalArt
          value={
            propTicket?.attachments?.map((f: any) => {
              return {
                ...f,
                downloadUrl: getChangeUrlsOnly(f?.url)?.url,
                showProgressBar: false,
                tag: `${f.size ? (f.size / (1024 * 1024)).toFixed(2) : 0}MB`,
              };
            }) as any
          }
          options={{ view: true, download: true }}
          onChange={() => console.log('')}
          binding={{ name: 'name', path: 'url', type: 'type' }}
        />
      )}
      {ticket?.issueComments?.map((comment, index) => (
        <div className="message-box" key={index}>
          <h2>
            {comment.commentDirection === 'user' ? (
              `${ticket?.userId?.pageTitle ?? 'Incognito User'} Message`
            ) : (
              <>
                <SelfiepopText /> Message
              </>
            )}
          </h2>
          <ul className="list-timing">
            <li>
              Sent:{' '}
              <span className="date">
                {dayjs
                  .utc(comment.dateTimeAdded)
                  .local()
                  .format('MM/DD/YYYY - h:mm A')}
              </span>
            </li>
          </ul>
          <p>{comment.commentValue}</p>
          <AdditionalArt
            options={{ view: true, download: true }}
            value={
              comment?.attachments?.map((f: any) => ({
                ...f,
                downloadUrl: getChangeUrlsOnly(f?.url)?.url,
                showProgressBar: false,
                cbOnCancel: f?.requestToken?.cancel,

                tag: `${f.size ? (f.size / (1024 * 1024)).toFixed(2) : 0}MB`,
              })) as any
            }
            onChange={() => console.log('')}
            binding={{ name: 'name', path: 'url', type: 'type' }}
          />
        </div>
      ))}
      {ticket?.issueStatus !== 'closed' ? (
        <div className="mt-30">
          <FocusInput
            hasLimit={false}
            type="textarea"
            rows={6}
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
            materialDesign
          />
          <FileUploadReduxHoc>
            {(files: any, onChange: any, { onSubmit }: { onSubmit: any }) => {
              const handlesubmit = (
                message: any,
                ticket: any,
                callBack: any,
              ) => {
                if (!!files.length) {
                  dispatch(
                    addPendingMessage({
                      data: { message, ticket },
                      groupId: ticket?._id,
                      files: files,
                      status: MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
                    }),
                  );
                  onSubmit({
                    key: ticket._id,
                    onCompletedCallback: (uploadedFiles: any) => {
                      sendCommentMessage(
                        message,
                        ticket,
                        uploadedFiles,
                        callBack,
                      );
                    },
                  });
                } else {
                  sendMessage(message, ticket, [])
                    .then(() => {
                      // setCommentMessage('');
                      callBack();
                    })
                    .catch((e) => {
                      console.log(e);
                      callBack();
                    });
                }

                // onSubmitCb?.(files, message, price, messageKey);
              };
              return (
                <>
                  {pendingMessagess?.status ===
                  MEDIA_UPLOAD_STATUSES.IN_PROGRESS ? (
                    <AdditionalArt
                      value={pendingMessagess?.files?.map((f: any) => {
                        return {
                          ...f,
                          showProgressBar: true,
                          cbOnCancel: f?.requestToken?.cancel,
                          uploadingProgress: f?.progress,
                          tag: `${
                            f.size ? (f.size / (1024 * 1024)).toFixed(2) : 0
                          }MB`,
                        };
                      })}
                      onChange={(files: any, file: any) => {
                        if (file.status !== MEDIA_UPLOAD_STATUSES.CANCELLED) {
                          dispatch(
                            onFileUploadingCancelled({
                              groupId: propTicket._id,
                              fileId: file.id,
                              status: MEDIA_UPLOAD_STATUSES.CANCELLED,
                              callBack: ({
                                groupId,
                                groupFiles,
                                isAllCancelled,
                                isAllUploaded,
                              }: CancelFileUploadCallbackProps) => {
                                const is = pendingMessages?.find(
                                  (p) => p.groupId === groupId,
                                );

                                is &&
                                  (isAllCancelled || isAllUploaded) &&
                                  sendCommentMessage(
                                    is?.data.message,
                                    is?.data.ticket,
                                    { files: groupFiles },
                                  );
                              },
                            }),
                          );
                        }
                      }}
                      binding={{
                        name: 'name',
                        path: 'thumbnail',
                        type: 'type',
                      }}
                    />
                  ) : (
                    <SupportFileContainer
                      value={files || []}
                      onChange={onChange}
                    />
                  )}

                  <div className="text-center">
                    <Button
                      type="primary"
                      isLoading={isLoading}
                      disabled={!commentMessage?.trim().length}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        handlesubmit?.(commentMessage, ticket, () => {
                          setCommentMessage('');
                          setIsLoading(false);
                        });
                        onChange([]);
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              );
            }}
          </FileUploadReduxHoc>
        </div>
      ) : (
        <div className="text-center pt-15">
          <span className="btn-detail">
            <LockIcon /> This ticket has been closed
          </span>
        </div>
      )}
      {ticket?.issueStatus !== SupportTicketStatus.CLOSE &&
        user?.isSupportAgent && (
          <div className="mt-20 text-center">
            <Button
              type="primary"
              isLoading={isClosing}
              onClick={() => {
                setIsClosing(true);
                closeTicket?.(ticket)
                  .then(() => {
                    setCommentMessage('');
                    setIsClosing(false);
                  })
                  .catch((e) => {
                    console.log(e);
                    setIsClosing(false);
                  });
              }}
            >
              Close Ticket
            </Button>
          </div>
        )}
    </div>
  );
};

export default styled(TicketDetails)`
  max-width: 528px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.5;
  color: var(--pallete-text-main-300);
  font-weight: 400;

  .ticket-detail {
    padding: 0 0 16px;
  }

  .support-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 33px;

    .ticket-id {
      display: block;
      color: var(--pallete-text-main-300);
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 0 0;
    }

    h2 {
      margin: 0;
    }
  }

  .link-profile {
    display: inline-block;
    vertical-align: top;
    position: relative;

    svg {
      width: 16px;
      height: 16px;
      margin: 3px 0 0 8px;
      display: inline-block;
      vertical-align: top;
    }

    &:hover {
      color: var(--colors-indigo-500);
    }
  }

  .user-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  h2 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: var(--pallete-text-main);
    margin: 0 0 10px;
  }

  .support-tag {
    min-width: 70px;
    background: var(--pallete-primary-main);
    color: #fff;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    padding: 6px 10px 4px;
    text-align: center;
  }

  .title-holder {
    margin: 0 0 20px;
    display: block;

    .title {
      font-size: 20px;
      line-height: 24px;
      color: var(--pallete-text-main);
      font-weight: 500;
    }
  }

  p {
    margin: 0 0 10px;

    &.ticket-description {
      margin: 0 0 30px;

      span {
        white-space: pre-line;
      }
    }

    strong {
      font-weight: 500;
      color: var(--pallete-text-main);
    }

    a {
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .list-timing {
    margin: 0 0 20px;
    padding: 0 4% 0 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .date {
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }

  .message-box {
    padding: 30px 0 0;

    p {
      white-space: pre-line;
    }
  }

  .btn-detail {
    display: inline-block;
    vertical-align: top;
    background: #000;
    color: #fff;
    font-size: 22px;
    line-height: 26px;
    font-weight: 500;
    padding: 15px 35px;
    border-radius: 30px;

    svg {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
    }
  }

  .sortable {
    .card-dragable {
      padding: 13px 10px;

      .drag-dots {
        display: none;
      }

      .button {
        + a,
        + .button {
          margin-left: 10px;
        }
      }
    }
  }
`;
