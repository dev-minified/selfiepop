import { GetPopIcon } from 'appconstants';
import { Forward, LinkSimple, Shoutout } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { toast } from 'components/toaster';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ShareShoutoutModal from './components/ShareShoutoutModal';

interface Props {
  className?: string;
  order?: any;
  orderDetails?: any;
}

const PublicVideo: React.FC<Props> = (props) => {
  const { className, order, orderDetails } = props;
  const { orderId } = useParams<{ orderId: string }>();
  const [isShareShoutoutModalOpen, setIsShareShoutoutModalOpen] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCopied, copy] = useCopyToClipBoard();
  return (
    <div className={className}>
      <div className="thumnail d-flex align-items-center">
        {order?.popThumbnail ? (
          <ImageModifications
            imgeSizesProps={{
              onlyDesktop: true,

              imgix: { all: 'w=163&h=163' },
            }}
            src={order?.popThumbnail}
            className="thumbnail"
            alt=""
          />
        ) : order?.popType ? (
          <GetPopIcon type={order.popType} />
        ) : (
          <span className="img">
            <Shoutout />
          </span>
        )}
        <h2>{order?.seletedPriceVariation?.title || order?.popTitle}</h2>
      </div>
      <div className="video-holder">
        <video
          key={order?.videoLink}
          style={{ width: '100%' }}
          poster=""
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          <source src={order?.videoLink} type="video/mp4" />
        </video>
      </div>
      <div className="video-creator">
        Created By:
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '100%',
            margin: '0 10px',
          }}
        >
          <ImageModifications
            imgeSizesProps={{
              onlyDesktop: true,

              imgix: { all: 'w=163&h=163' },
            }}
            src={order?.profileImage}
            fallbackUrl={'/assets/images/default-profile-img.svg'}
            className="thumbnail"
            alt="seller"
          />
        </div>
        <Link to={`/${order?.username}`}>
          {order ? `${order?.pageTitle ?? 'Incognito User'}` : ''}
        </Link>
      </div>
      {order?.sharedUser ? (
        <div>
          <p>
            From:{' '}
            <span>
              <b>{orderDetails?.buyerPageTitle}</b>
            </span>
          </p>
          <p>
            <b>Message:</b> <span>{order?.sharedUser?.message}</span>
          </p>
        </div>
      ) : (
        <>
          <ul className="list-links">
            <li>
              <Link
                to="#"
                onClick={() => {
                  copy(`${window.location.host}/shoutout/view/${orderId}`);
                  toast.info('Copied the url');
                }}
              >
                <span className="img">
                  <LinkSimple />
                </span>
                <span className="text">Copy Link</span>
              </Link>
            </li>
            <li>
              <Link to="#" onClick={() => setIsShareShoutoutModalOpen(true)}>
                <span className="img img-forward">
                  <Forward />
                </span>
                <span className="text">Share</span>
              </Link>
            </li>
          </ul>
          <hr className="m-0" />
        </>
      )}
      <ShareShoutoutModal
        isOpen={isShareShoutoutModalOpen}
        onClose={() => setIsShareShoutoutModalOpen(false)}
        order={order}
      />
    </div>
  );
};

export default styled(PublicVideo)`
  padding: 14px 0 0;

  .thumnail {
    margin: 0 0 15px;

    h2 {
      font-size: 20px;
      line-height: 24px;
      color: var(--pallete-text-main);
      font-weight: 500;
      margin: 0;
      padding: 0px;

      a {
        color: var(--pallete-text-secondary-50);
      }

      .img {
        display: inline-block;
        vertical-align: top;
        line-height: 1;
        /* margin: 0 10px 0 0; */
        width: 21px;
        margin-right: 12px;
        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
    }

    .thumbnail {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      overflow: hidden;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .video-holder {
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    margin: 0 0 28px;

    video {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .list-links {
    font-size: 18px;
    line-height: 24px;
    margin: 0 0 36px;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: center;

    li {
      padding: 0 25px;
    }

    a {
      display: block;

      &:hover {
        color: var(--pallete-text-secondary-50);
      }
    }

    .img {
      display: block;
      margin: 0 auto 10px;
      width: 30px;

      &.img-forward {
        width: 36px;
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .text {
      display: block;
    }
  }

  .video-creator {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 18px;
    color: #666;
    border-bottom: 1px solid rgba(221, 221, 221, 0.77);
    padding: 0 0 30px;
    margin: 0 0 30px;

    .thumbnail {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    a {
      color: var(--pallete-text-main);
      font-weight: 500;
    }
  }

  hr {
    border-color: rgba(221, 221, 221, 0.77);
  }
`;
