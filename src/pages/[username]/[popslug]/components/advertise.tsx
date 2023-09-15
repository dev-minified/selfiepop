import { orderCreate } from 'api/Order';
import { createOrderWithGuestUser } from 'api/Utils';
import { Advertise as AdvertiseIcon, SnapChat } from 'assets/svgs';
import NewButton from 'components/NButton';
import SPCard from 'components/SPCards';
import { SocialPlatforms } from 'enums';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import { IServiceProps } from 'interfaces/IPublicServices';
import { stringify } from 'querystring';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import 'styles/pop-widget.css';

import ImageModifications from 'components/ImageModifications';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import { addProtocol, arrayFilter, arrayFind } from 'util/index';

const StyledAdvertise = styled.div`
  .title-box {
    padding-right: 0 !important;
  }
  .heading-box {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 30px;

    h2 {
      margin: 0;
      font-size: 26px;
      padding: 0 0 0 15px;
    }

    .icon {
      width: 54px;
      min-width: 54px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;

        g {
          &#Layer_1 {
            fill: #fff !important;

            .sp_dark & {
              fill: #000 !important;
            }
          }
        }
      }
    }
  }
  .text-description {
    color: #666666;
    font-size: 17px;
    line-height: 25px;
    font-weight: 400;
  }
  .header-bottom-bar {
    display: flex;
    // justify-content: space-between;
    width: 80%;
    font-size: 15px;
    line-height: 18px;

    strong {
      font-weight: 700;
    }
  }
  .header-bottom-bar div {
    min-width: 33.333%;
    padding-right: 10px;
  }
  .main--card--header .icon img,
  .main--card--header img,
  .main--card--header .icon svg {
    width: 100%;
    height: auto;
  }
  .main--card--header .caption {
    font-size: 16px;
  }
  .main--card--header .icon {
    width: 100px;
    height: 100px;
  }
  .image-holder {
    width: auto;
    margin-bottom: 5px;
    display: inline-block;
  }
  .pop-wigdet .header .icon {
    background-color: var(--pallete-background-default);
  }
  .sub--card {
    background: var(--pallete-background-default);
    border: 1px solid #dddede;
    border-radius: 10px;
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.4s ease;

    .sp_dark & {
      background: var(--pallete-background-gray-100);
      border: transparent;
    }

    &:hover {
      box-shadow: 0px 0px 4px #79b530;
    }

    .body {
      border-top: 1px solid #e5e5e5;
      border-bottom: none;
      padding: 0;

      .sp_dark & {
        border-top-color: var(--pallete-background-gray-100);
        color: #dbdbdb;
      }
    }

    .title {
      font-weight: 500;
      text-transform: capitalize;
      margin: 0 0 2px;
    }

    .dashed {
      display: none;
    }

    .title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .priceTag {
      font-size: 18px;
      line-height: 21px;
      background: #79b530;
      border-radius: 4px;
      min-width: 65px;
      text-align: center;
      color: #fff;
      padding: 4px 5px;
    }

    .caption {
      color: #3f3f3f;
      margin: 0 0 5px;
    }

    .body {
      p {
        margin: 0;
      }
    }
  }
  .sub--card .header {
    padding: 15px 19px;
    background: var(--pallete-background-gray-100);

    .sp_dark & {
      background: none;
    }
  }
  .sub--card .header .header-right {
    display: block;
  }
  .sub--card .icon {
    width: 80px;
    height: 80px;
    min-width: 80px;
    border: none;
  }

  .sub--card .body {
    font-weight: 400;
  }

  .sub--card .icon img {
    width: 100%;
    height: auto;
  }
  .twitter-btn {
    background-color: #53abed;
    border-color: #53abed;
  }
  .facebook-btn {
    background-color: #1777f1;
    border-color: #1777f1;
  }
  .youtube-btn {
    background-color: #ff0000;
    border-color: #ff0000;
  }
  .instagram-btn {
    background-color: #8139ab;
    border-color: #8139ab;
  }
  @media (max-width: 767px) {
    .header-bottom-bar {
      width: 100%;
    }
    .main--card--header .icon {
      width: 70px;
      height: 70px;
    }
    .image-holder {
      width: 120px;
      display: inline-block;
      margin-bottom: 1px;
    }

    .main--card--header .caption {
      font-size: 14px;
    }
    .main--card--header .header-bottom-bar {
      font-size: 14px;
    }
    .sub--card .header {
      padding: 10px 15px;
    }

    .sub--card {
      .icon {
        width: 50px;
        height: 50px;
        min-width: 50px;
        margin: 0 10px 0 0;
      }

      .title {
        font-size: 18px;
        margin: 0 0 6px;
      }

      .title-wrap {
        flex-wrap: wrap;
      }

      .priceTag {
        font-size: 16px;
        line-height: 19px;
      }
    }
  }
  .pop_thumbnail {
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
const SnapChatComponent = styled.span`
  .icon {
    width: 100%;
    overflow: hidden;
    > span {
      width: 100%;
      svg {
        width: 100%;
      }
    }
  }
`;
const VariationSubtitle: React.FC<{ url: string }> = ({ url }) => {
  const updateUrl = addProtocol(url);

  return (
    <a
      href={updateUrl}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {url}
    </a>
  );
};

const Advertise: React.FC<IServiceProps> = (props) => {
  const history = useHistory();
  const { username } = useParams<{ username: string }>();
  const { user: authUser, isAuthenticated, loggedIn } = useAuth();
  const gstUser = useAppSelector((state) => state.checkout?.guestUser);
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();
  const {
    ownProfile,
    onStopPOPupOpen,
    onCreateOrder,
    pop: {
      title,
      description,
      priceVariations,
      popType,
      socialStats,
      isThumbnailActive,
      popThumbnail,
      _id: popId,
    },
  } = props;
  const handleCreateOrder = async (variationId: string) => {
    if (ownProfile && onStopPOPupOpen) {
      onStopPOPupOpen();
      return;
    }
    const variation: any = arrayFind(priceVariations, { _id: variationId });
    const questions = arrayFilter(variation?.questions, {
      isActive: true,
    });
    dispatch(resetOrder());

    const requestData = {
      questions,
      popId: popId,
      vpopId: variationId,
      buyer:
        loggedIn || gstUser?.data?._id
          ? authUser?._id ?? gstUser?.data?._id
          : null,
    };

    try {
      const response =
        loggedIn || gstUser?.data?._id
          ? await withLoader(orderCreate(requestData))
          : await withLoader(createOrderWithGuestUser(requestData));

      if (!response) {
        return;
      }

      const { order, guestUser } = response;
      dispatch(setOrder(order));
      if (!isAuthenticated && !gstUser?.data?._id) {
        dispatch(setGuestUser(guestUser));
        dispatch(
          setGuestUserTokens({
            token: guestUser.token,
            refreshToken: guestUser.refreshToken,
          }),
        );
      }

      const prams = stringify({ order: order._id, type: popType });
      onCreateOrder?.(order);
      return history.push(
        `/${username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    } catch (e: any) {
      if (e?.message) {
        toast.error(e?.message);
      }
    }
  };

  const instagramComponent = ({
    _id,
    title,
    price,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    let url = '';

    if (value) {
      const stat = socialStats?.find?.((p: any) => p._id === value);
      if (stat) {
        url = stat.url;
      }
    }
    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          icon={
            <span>
              <img src="/assets/images/Instagram.svg" alt="logo" />
            </span>
          }
          className="advertise-card"
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          subtitle={<VariationSubtitle url={url} />}
          showClose={false}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };

  const twitterComponent = ({
    _id,
    title,
    price,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    let url = '';
    const stat = socialStats?.find?.((p: any) => p._id === value);

    if (stat) {
      url = stat.url;
    }

    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          icon={
            <span>
              <img src="/assets/images/twitter.svg" alt="logo" />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          subtitle={<VariationSubtitle url={url} />}
          showClose={false}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };

  const facebookComponent = ({
    _id,
    title,
    description,
    price,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    let url = '';
    const stat = socialStats?.find?.((p: any) => p._id === value);
    if (stat) {
      url = stat?.url;
    }
    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          key={_id}
          subtitle={<VariationSubtitle url={url} />}
          icon={
            <span>
              <img src="/assets/images/facebook.svg" alt="logo" />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          headerStyle={{}}
          showClose={false}
          titleStyle={{}}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };

  const youtubeComponent = ({
    _id,
    price,
    title,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    let url = '';
    if (value) {
      const stat = socialStats?.find?.((p: any) => p._id === value);
      if (stat) {
        url = stat.url;
      }
    }
    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          subtitle={<VariationSubtitle url={url} />}
          icon={
            <span>
              <img src="/assets/images/youtube.svg" alt="logo" />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          showClose={false}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };

  const tiktokComponent = ({
    _id,
    price,
    title,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};

    let url = '';
    if (value) {
      const stat = socialStats?.find?.((p: any) => p._id === value);
      if (stat) {
        url = stat.url;
      }
    }
    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          subtitle={<VariationSubtitle url={url} />}
          icon={
            <span style={{ width: '100%' }}>
              <img src="/assets/images/tictoc-logo.png" alt="logo" />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          showClose={false}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };

  const onlyfansComponent = ({
    _id,
    price,
    title,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    let url = '';
    if (value) {
      const stat = socialStats?.find?.((p: any) => p._id === value);
      if (stat) {
        url = stat.url;
      }
    }
    return (
      <div onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          subtitle={<VariationSubtitle url={url} />}
          icon={
            <span>
              <img src="/assets/images/onlyfans.svg" alt="logo" />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          headerStyle={{}}
          showClose={false}
          titleStyle={{}}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </div>
    );
  };
  const snapChatComponent = ({
    _id,
    price,
    title,
    description,
    stats,
  }: PriceVariant) => {
    const { value } = stats || {};
    // let likes = 0,
    let url = '';
    if (value) {
      const stat = socialStats?.find?.((p: any) => p._id === value);
      if (stat) {
        // likes = stat.stats?.likes || 0;
        url = stat.url;
      }
    }
    return (
      <SnapChatComponent onClick={() => handleCreateOrder(_id!)}>
        <SPCard
          showCaption={false}
          bodyClass={!description ? 'd-none' : ''}
          subtitle={<VariationSubtitle url={url} />}
          icon={
            <span>
              <SnapChat />
            </span>
          }
          title={
            <div className="title-wrap">
              <div className="title-holder">{title}</div>
              <span className="priceTag">${Number(price).toFixed(2)}</span>
            </div>
          }
          headerStyle={{}}
          showClose={false}
          titleStyle={{}}
          classes={{ card: 'sub--card' }}
          showFooter={false}
        >
          <div className="px-20 bg-main p-15 py-md-15">
            <p className="text-justify">{description}</p>
          </div>
        </SPCard>
      </SnapChatComponent>
    );
  };

  const activeVariations = priceVariations?.filter(
    (varr: PriceVariant) => varr.isActive,
  );
  return (
    <StyledAdvertise className="mb-80">
      <div className="mb-30 mb-md-50">
        <div className="text-center title-box">
          <div className="heading-box">
            <span className="icon">
              {isThumbnailActive && popThumbnail ? (
                <ImageModifications
                  imgeSizesProps={{
                    onlyMobile: true,
                    imgix: {
                      all: 'w=64&h=64',
                    },
                  }}
                  src={popThumbnail}
                  className="pop_thumbnail"
                  alt=""
                />
              ) : (
                <AdvertiseIcon />
              )}
            </span>
            <h2 className="text-capitalize">{title}</h2>
          </div>

          <div className="text-justify font-weight-normal text-description">
            {description}
          </div>
        </div>
      </div>
      {!!activeVariations?.length ? (
        activeVariations.map((variation: PriceVariant) => {
          switch (variation.type) {
            case SocialPlatforms.YOUTUBE:
              return (
                <div key={variation._id}>{youtubeComponent(variation)}</div>
              );
            case SocialPlatforms.INSTAGRAM:
              return (
                <div key={variation._id}>{instagramComponent(variation)}</div>
              );
            case SocialPlatforms.TWITTER:
              return (
                <div key={variation._id}>{twitterComponent(variation)}</div>
              );
            case SocialPlatforms.ONLYFANS:
              return (
                <div key={variation._id}>{onlyfansComponent(variation)}</div>
              );
            case SocialPlatforms.TIKTOK:
              return (
                <div key={variation._id}>{tiktokComponent(variation)}</div>
              );
            case SocialPlatforms.FACEBOOK:
              return (
                <div key={variation._id}>{facebookComponent(variation)}</div>
              );
            case SocialPlatforms.SNAPCHAT:
              return (
                <div key={variation._id}>{snapChatComponent(variation)}</div>
              );
            default:
              return null;
          }
        })
      ) : (
        <div style={{ maxWidth: '402px', margin: '0 auto' }}>
          <NewButton
            block
            type="primary"
            shape="circle"
            className="btn-disabled"
          >
            This Pop currently has no data.
          </NewButton>
        </div>
      )}
    </StyledAdvertise>
  );
};

export default Advertise;
