import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AvatarStatus from 'components/AvatarStatus';
import styled from 'styled-components';

type Props = {
  className?: string;
  order?: any;
  isPaid?: boolean;
};

function ChatSubCheckut({ className, order = {} }: Props) {
  return (
    <div className={className}>
      <div className="chatSub">
        <AvatarStatus
          imgSettings={{
            onlyDesktop: true,
            imgix: { all: 'w=200&h=200' },
          }}
          src={
            order?.seller?.profileImage ||
            '/assets/images/default-profile-img.svg'
          }
          fallbackUrl={'/assets/images/default-profile-img.svg'}
        />
        {order?.seller?.username && <h1>{order.seller?.username}</h1>}
        <h2>Chat and exclusive content.</h2>
        <div className="user-detail">
          <div className="img-info">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </div>
          <strong className="title">
            To access this content you must be 18 years old or over.
          </strong>
          {/* {!isPaid ? (
            <p>
              Please enter your credit card below for age verification purposes.
              Your card will not be charged for your free membership.
            </p>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}
export default styled(ChatSubCheckut)`
  .chatSub {
    .user-image {
      width: 160px;
      height: 160px;
      margin: 0 auto 15px;

      .image-comp {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    h1 {
      text-align: center;
      color: #02b0f0;
      font-size: 24px;
      line-height: 28px;
      margin: 0 0 10px;

      .sp_dark & {
        color: var(--pallete-primary-main);
      }
    }

    h2 {
      font-size: 24px;
      line-height: 28px;
      font-weight: 400;
      color: var(--pallete-text-main);
      margin: 0 0 33px;
    }

    .user-detail {
      position: relative;
      padding: 0 0 15px 18px;
      font-size: 12px;
      line-height: 18px;
      font-weight: 400;
    }

    .img-info {
      width: 12px;
      position: absolute;
      left: 0;
      top: 0;

      svg {
        width: 100%;
        height: auto;
      }
    }

    .title {
      display: block;
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
    }
  }
`;
