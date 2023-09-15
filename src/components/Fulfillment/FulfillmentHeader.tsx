import { ExtraOrderTypes } from 'appconstants';
import { AvatarName } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { ServiceType } from 'enums';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  isSeller?: boolean;
  image: string;
  name: string;
  status: string;
  popType: ServiceType;
  className?: string;
  order?: any;
}

const getTitle = (
  isSeller: boolean,
  name: string,
  popType: ServiceType,
  order: any,
) => {
  const username = isSeller ? order?.seller?.username : order?.buyer?.username;
  // const link = `${window.location.host}/${username}`.replace('www.', '');
  switch (popType) {
    case ServiceType.SHOUTOUT:
      return (
        <h3>
          Custom Video {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.CHAT_SUBSCRIPTION:
      return (
        <h3>
          Chat Subscription {isSeller ? 'for' : 'from'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.ADDITIONAL_SERVICES:
      return (
        <h3>
          Custom Service {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.PAYMA:
      return (
        <h3>
          {isSeller ? 'Q&A from' : 'Paid Q&A for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.DIGITAL_DOWNLOADS:
      return (
        <h3>
          Digital Download {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.ADVERTISE:
      return (
        <h3>
          {isSeller ? 'Promotion from' : 'Promote with'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ServiceType.POPLIVE:
      return (
        <h3>
          Pop Live {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ExtraOrderTypes.tip:
      return (
        <h3>
          {ExtraOrderTypes.tip} {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ExtraOrderTypes.message_unlock:
      return (
        <h3>
          {ExtraOrderTypes.message_unlock.split('_').join(' ')}{' '}
          {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
    case ExtraOrderTypes.post_unlock:
      return (
        <h3>
          {ExtraOrderTypes.post_unlock.split('_').join(' ')}{' '}
          {isSeller ? 'from' : 'for'}{' '}
          {/* <span className="name">{name}</span> */}
          <Link to={`/${username}`} className="name" target="_blank">
            {name}
          </Link>
        </h3>
      );
  }
};

const FulfillmentHeader: React.FC<Props> = (props) => {
  const {
    order,
    isSeller = false,
    image,
    name,
    status,
    popType,
    className,
  } = props;

  return (
    <div className={`${className} qa-widget mb-40`}>
      <div className="image-holder">
        <ImageModifications
          // src={image || '/assets/images/default-profile-img.svg'}
          src={image}
          imgeSizesProps={{
            onlyDesktop: true,
            imgix: {
              all: 'w=480&h=220',
            },
          }}
          fallbackComponent={<AvatarName text={name} />}
          alt="profile"
          // fallbackUrl={'/assets/images/default-profile-img.svg'}
        />
      </div>
      {getTitle(isSeller, name, popType, order)}
      <span
        className="status"
        style={status === 'Completed' ? { backgroundColor: '#7ccf78' } : {}}
      >
        {status}
      </span>
      <div className="ff-price">
        <strong className="title">Order Number</strong>
        <span className="price">{order?._id}</span>
      </div>
    </div>
  );
};

export default styled(FulfillmentHeader)`
  text-align: center;
  margin: 0 0 20px;

  .ff-price {
    font-size: 17px;
    line-height: 21px;
    font-weight: 500;
    color: var(--pallete-text-main-450);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 23px 0 0 0;
  }

  .image-holder {
    width: 102px;
    height: 102px;
    margin: 0 auto 16px;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: covre;
    }
  }

  h3 {
    margin: 0 0 14px;
  }

  .name {
    color: var(--pallete-text-secondary-50);
  }

  .status {
    display: inline-block;
    vertical-align: top;
    background: #c1c1c1;
    border-radius: 16px;
    font-size: 14px;
    line-height: 18px;
    padding: 6px 18px 4px;
    border-radius: 20px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
  }
`;
