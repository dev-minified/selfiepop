import { CalenderCheck, PostIcon, VerticalDots } from 'assets/svgs';
import attrAccept from 'attr-accept';
import classNames from 'classnames';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { Emoji, getEmojiDataFromNative } from 'emoji-mart';
import data from 'emoji-mart/data/all.json';
import { postStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useDropDown from 'hooks/useDropDown';
import React, { useEffect, useState } from 'react';
// import { setSelectedScheduledPost } from 'store/reducer/salesState';
import {
  deletePost,
  setSelectedScheduledPost,
  setSelectedView,
} from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import 'styles/delete-message-modal.css';
import swal from 'sweetalert';
import { getChangeUrlsOnly, getImageURL, isValidUrl } from 'util/index';
import { publishPost } from '../../../../store/reducer/scheduledMessaging';
import ScheduledMessageAttachments from './ScheduledMessageAttachments';

interface Props {
  className?: string;
  post?: any;
  managedAccountId?: string;
  cacheburst?: boolean;
}

const parseEmoji = (message?: string) => {
  let msg = message;
  const r =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  const found = message?.match(r);
  const elements: any[] = [];
  if (found?.length) {
    for (const emoji of found) {
      const str = msg?.substring(0, msg.indexOf(emoji));
      if (str) elements.push(<span key={elements.length}>{str}</span>);
      msg = msg?.substring(msg?.indexOf(emoji) + emoji.length);
      const emojiData = getEmojiDataFromNative(emoji, 'apple', data as any);
      if (emojiData) {
        elements.push(
          <Emoji
            key={elements.length}
            emoji={emojiData}
            size={24}
            fallback={(emoji: any, props) => {
              return emoji ? (
                <>{`:${emoji.short_names[0]}:`}</>
              ) : (
                <>{props.emoji}</>
              );
            }}
          />,
        );
      } else {
        elements.push(<span>{emoji}</span>);
      }
    }

    if (msg) {
      elements.push(<span key={elements.length}>{msg}</span>);
    }

    return <>{elements.map((el) => el)}</>;
  }

  return message;
};

const ScheduledMessage: React.FC<Props> = (props) => {
  const { isVisible, ref } = useDropDown(false, false);
  const dispatch = useAppDispatch();
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [postMedia, setPostMedia] = useState<any>([]);
  const { className, post, managedAccountId, cacheburst = false } = props;
  const date = dayjs(post?.publishAt).format('MMM DD, YYYY');
  const time = dayjs(post?.publishAt).format('hh:mm a');

  const onPublishNow = async () => {
    if (post?._id) {
      setIsPublishing(true);
      await dispatch(publishPost({ ...post, sellerId: managedAccountId }));
      // await dispatch(await publishPost(message));
      setIsPublishing(false);
    }
  };
  const onEditPost = () => {
    if (post) {
      dispatch(setSelectedScheduledPost(post));
      dispatch(setSelectedView('editPost'));
    }
  };
  const onDeleteMessage = () => {
    swal({
      content: {
        element: 'div',
        attributes: {
          innerHTML:
            '<h2><img src="/assets/images/svg/icon-trash-w.svg"></img>DELETE SCHEDULED POST</h2><p>Are you sure you want to permanently delete the scheduled message?</p>',
        },
      },
      dangerMode: true,
      className: 'delete-popup',
      buttons: ['Cancel', 'Yes, Delete'],
    }).then(async (willDelete) => {
      if (willDelete) {
        post?._id &&
          dispatch(deletePost({ ...post, sellerId: managedAccountId }));
      }
    });
  };
  const updateMedia = (med: any[] = []) => {
    const media = med?.map((p: any) => {
      if (
        isValidUrl(p?.path || p?.url) &&
        attrAccept({ name: p?.name, type: p.type }, 'image/*')
      ) {
        const f: any = { ...p };
        const { url, fallbackUrl } = getImageURL({
          url: p?.path || p?.url || '',
          settings: {
            onlysMobile: true,
            defaultUrl: f?.path,
            imgix: {
              all: 'w=480&h=220',
            },
          },
        });
        const updatedUrl = `${url}?v=${f.updatedAt}`;
        const fallbackUpdateUrl = fallbackUrl
          ? `${fallbackUrl}?v${f.updatedAt}`
          : `${p.path}?v${f.updatedAt}`;
        f.path = updatedUrl;
        f.fallbackUrl = p?.path ? fallbackUpdateUrl : p?.url;
        return f;
      }
      const isAudio = attrAccept({ name: p?.name, type: p.type }, 'audio/*');
      let src = p.url || p.path;
      if (isAudio && isValidUrl(p?.path || p?.url)) {
        const { url, fallbackUrl } = getChangeUrlsOnly(p.url || p.path);
        src = url;
        return { ...p, path: src, fallbackUrl: fallbackUrl };
      }
      return p;
    });
    setPostMedia(() => [...media]);
  };
  useEffect(() => {
    updateMedia(post.media);
  }, [post.media]);

  return (
    <div className={className}>
      <div className="message-box">
        <div className="message-area">
          <div className="img-icon">
            <PostIcon />
          </div>
          <div className="message-detail">
            <div className="text-box">
              {/* <strong className="title">Scheduled Message Name</strong> */}
              <div className="time-info">
                <span className="img-calender">
                  <CalenderCheck />
                </span>
                <strong className="date">{date}</strong>
                <span className="time">{time}</span>
              </div>
              <p>{parseEmoji(post?.postText)}</p>
            </div>
            <ScheduledMessageAttachments
              removable={false}
              attachments={postMedia || []}
              cacheburst={cacheburst}
            />
            <div
              className={classNames('actions-area', {
                'dropdown-active': isVisible,
              })}
            >
              <div ref={ref} className="actions-opener">
                <VerticalDots />
                {isVisible && (
                  <ul className="actions">
                    {postStatus.published !== post?.status && (
                      <li>
                        <Button type="text" onClick={onEditPost}>
                          Edit Post
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button
                        type="text"
                        onClick={onPublishNow}
                        disabled={post?.status === 'published' || isPublishing}
                      >
                        {post?.status === 'published'
                          ? 'Published'
                          : 'Publish Now'}
                      </Button>
                    </li>
                    <li className="delete">
                      <Button type="text" onClick={onDeleteMessage}>
                        Delete Post
                      </Button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default styled(ScheduledMessage)`
  .message-box {
    margin: 0 0 20px;
  }

  hr {
    margin: 0 -20px;
    background: #e8eaed;
  }

  .message-area {
    position: relative;
    padding: 20px 0 20px 60px;
    color: var(--pallete-text-main);
    font-size: 14px;
    line-height: 25px;
    font-weight: 400;

    &:first-child {
      padding-top: 0;
    }

    .img-icon {
      position: absolute;
      left: 0;
      top: 0;
      width: 48px;
      height: 48px;
      background: rgba(4, 176, 240, 0.12);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.2);
      }

      svg {
        width: 23px;
        height: auto;
      }
    }

    .title {
      color: var(--pallete-text-main-550);
      display: block;
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 -1px;
      padding: 0 45px 0 0;
    }

    .time-info {
      position: relative;
      padding: 0 0 0 25px;
      margin: 0 0 9px;

      .img-calender {
        position: absolute;
        left: 0;
        top: 4px;
        width: 16px;

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }

      .time {
        padding: 0 0 0 10px;
        font-size: 13px;
        display: inline-block;
        vertical-align: top;
      }
    }

    p {
      margin: 0 0 13px;
    }

    .actions-area {
      position: absolute;
      right: 8px;
      top: -9px;
      z-index: 2;

      &.dropdown-active {
        z-index: 3;
        .actions-opener {
          background: #f5f8fd;
          color: var(--pallete-primary-main);
        }
      }

      .actions-opener {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        width: 36px;
        height: 36px;
        color: var(--pallete-primary-main);
        cursor: pointer;

        svg {
          transform: rotate(-90deg);
        }
      }

      .actions {
        position: absolute;
        right: 0;
        top: 100%;
        width: 122px;
        border: 1px solid var(--pallete-colors-border);
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        margin: 1px 0 0;
        padding: 0;
        list-style: none;
        font-size: 12px;
        line-height: 15px;
        font-weight: 500;
        color: #8d778d;
        background: var(--pallete-background-default);
        padding: 5px;
        cursor: default;

        li {
          &.delete {
            padding-top: 5px;
            border-top: 1px solid #f0f2f6;

            .sp_dark & {
              border-top-color: transparent;
              padding-top: 0;
            }
          }

          .button {
            display: inline-block;
            vertical-align: top;
            background: none;
            color: #8d778d;
            padding: 6px 10px;
            min-width: inherit;
            margin: 0;
            text-align: left;
            font-size: 12px;
            line-height: 15px;
            font-weight: 500;
            border-radius: 4px;

            &:hover {
              color: var(--pallete-text-secondary-100);
              background: rgba(230, 236, 245, 0.62);
            }
          }
        }
      }
    }
  }
`;
