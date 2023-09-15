import { checkOrderExists } from 'api/Order';
import {
  ProfleTickIcon,
  PublicFacebook,
  PublicInstagram,
  PublicSnapChat,
  PublicTwitter,
  PublicYoutube,
  Tiktok,
} from 'assets/svgs';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import VideoPlay from 'components/VideoPlay';
import WelcomeModal from 'components/WelcomeModals/WelcomeModal';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
// import { ServiceType } from 'enums';
import useAuth from 'hooks/useAuth';
import { useOnClickOutside } from 'hooks/useClickOutside';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { setOrder } from 'store/reducer/checkout';
import styled, { withTheme } from 'styled-components';
import { useAnalytics } from 'use-analytics';

import {
  arrayFilter,
  getImageURL,
  getLocalStorage,
  getLocation,
  isValidUrl,
  removeLocalStorage,
  setLocalStorage,
} from 'util/index';
// import UserLoggedOutForm from './ChatsubscriptionForm';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import ListItem from './components/ListItem';
import PageDescription from './components/PageDescription';
import PageTagline from './components/PageTagLine';
import PageTitle from './components/PageTitle';
import SectionTitle from './components/SectionTitle';

const SocialNetworks = styled.div`
  display: flex;
  justify-content: center;
  a {
    margin: 0 10px;
    transition: all 0.4s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
`;
const SenstiveBlock = styled.div`
  background: #ffffff;
  border-radius: 12px;
  margin: 0 0 15px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.25);
  padding: 20px;
  color: #666666;
  font-size: 16px;
  line-height: 19px;
  font-weight: 400;
  text-align: center;

  h2 {
    font-size: 20px;
    line-height: 24px;
    margin: 0 0 10px;
    color: var(--pallete-text-main);
    font-weight: 500;
  }

  p {
    margin: 0 0 20px;
  }

  .button {
    min-width: 270px;

    &:not(:hover) {
      background: #000;
      color: #fff;
      border-color: #000;
    }
  }
`;
const getTopSection = (theme: any, user: any) => {
  // let className = 'mt-40';
  let className = '';
  if (!theme?.profile?.isActive) {
    className = 'mt-40 no-margin';
  }
  if (
    theme?.profile?.isActive &&
    user?.pageTitle &&
    user?.tagLine &&
    user?.description
  ) {
    className = '';
  }
  if (
    theme?.profile?.isActive &&
    !user?.pageTitle &&
    !user?.tagLine &&
    !user?.description
  ) {
    className = 'mt-10 mt-md-30 no-margin';
  }
  if (
    !theme?.profile?.isActive &&
    user?.pageTitle &&
    user?.tagLine &&
    !user?.description
  ) {
    className = 'my-40 mt-md-75 mb-md-70';
  }
  if (
    !theme?.profile?.isActive &&
    user?.pageTitle &&
    !user?.tagLine &&
    !user?.description
  ) {
    className = 'mb-40 mt-50 mt-md-100 mb-md-80';
  }
  if (
    !theme?.profile?.isActive &&
    !user?.pageTitle &&
    !user?.tagLine &&
    !user?.description
  ) {
    className = 'mt-30 mt-md-100';
  }
  const isVerified = user?.idIsVerified && user?.isEmailVerified;
  return (
    <div className={className}>
      <>
        <PageTitle>
          {user ? <>{user.pageTitle || ''}</> : <Skeleton width="40%" />}{' '}
          {isVerified ? (
            <ProfleTickIcon
              width={'20'}
              height="20"
              fill={theme?.additional?.titleColor || 'black'}
            />
          ) : null}
        </PageTitle>
        <PageTagline>
          {user ? <>{user?.tagLine}</> : <Skeleton width="30%" />}
        </PageTagline>
        {user && <PageDescription>{user?.description}</PageDescription>}
      </>
    </div>
  );
};
const LinksSkeleton: React.FC = () => {
  return (
    <>
      <h3>
        <Skeleton width="30%" height={30} />
      </h3>
      <Skeleton className="mb-10" height={50} count={2} />
      <h3>
        <Skeleton width="30%" height={30} />
      </h3>
      <Skeleton className="mb-10" height={50} count={4} />
    </>
  );
};
const getSocialMediaIcon = (
  link: { type: string; url: string },
  theme: ITheme,
  onClick: () => void,
) => {
  let icon: any = null;
  switch (link.type) {
    case 'instagram':
      icon = <PublicInstagram key={link?.url} />;
      break;
    case 'tiktok':
      icon = <Tiktok key={link?.url} />;
      break;
    case 'twitter':
      icon = <PublicTwitter key={link?.url} />;
      break;
    case 'youtube':
      icon = <PublicYoutube key={link?.url} />;
      break;
    case 'facebook':
      icon = <PublicFacebook key={link?.url} />;
      break;
    case 'snapchat':
      icon = <PublicSnapChat key={link?.url} />;
      break;
  }
  return icon ? (
    <a
      href={getLocation(link.url).href}
      target="_blank"
      key={link?.url}
      rel="noreferrer"
      onClick={onClick}
      style={{ color: theme.socialIcon?.iconColor || '#3C2A4F' }}
      onContextMenu={(e) => {
        e.preventDefault();
        window.open(getLocation(link.url).href, '_blank');
      }}
    >
      {icon}
    </a>
  ) : null;
};
const PublicProfile: React.FC<any> = ({
  user,
  theme,
  twoPanelLayout,
  preview,
  isPreview,
}) => {
  const history = useHistory();
  const { user: loggedUser, loggedIn } = useAuth();

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isProfileAllowSelling, setIsProfileAllowSelling] = useState(
    user?.allowSelling,
  );
  const dispatch = useAppDispatch();
  // const previewpop = useAppSelector(
  //   (state) => state.popslice?.previewPop?.popLinksId,
  // );
  const [showDropDown, setShowDropDown] = useState<string>('');
  const [isBuyerNotAllowPurchases, setIsBuyerNotAllowPurchases] =
    useState(false);
  const [services, setServices] = useState<IUserLink[]>([]);
  // const [ischatExist, setIsChatExist] = useState<boolean>(false);
  // const gstUser = useAppSelector((state) => state.checkout?.guestUser);
  const analytics = useAnalytics();
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setShowDropDown?.('');
  });
  const handleContextMenu = useCallback(
    (event: any, item: any) => {
      event.preventDefault();
      onRightClickHandler(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?._id, loggedUser?._id],
  );
  useEffect(() => {
    setTimeout(() => {
      window &&
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    }, 700);
  }, []);
  useEffect(() => {
    if (user?._id) {
      if (!loggedIn || loggedUser?._id !== user?._id) {
        if (loggedUser?._id && loggedUser?._id !== user?._id) {
          if (!loggedUser?.allowPurchases) {
            toast.error(USERCHARGEBACKMESSAGE);
          }
          setIsBuyerNotAllowPurchases(!loggedUser?.allowPurchases);
        }

        setIsProfileAllowSelling(user?.allowSelling && user?.idIsVerified);
      } else {
        setIsProfileAllowSelling(true);
      }
      // if (!isPreview) {
      //   checkifGuestOrloggedIn({
      //     loggedUser: loggedUser,
      //     publicUser: user,
      //   }).then((uUser: any) => {
      //     if (uUser?.user) {
      //       const lUser = uUser.user;

      //       if (!uUser.isLoggedIn) {
      //         dispatch(setGuestUser(lUser));
      //       }
      //       const isAlreadyexist =
      //         analytics.storage.getItem('__user_id') !== lUser?.data?._id;
      //       if (isAlreadyexist) {
      //         analytics.identify(lUser?.data?._id);
      //       }
      //       analytics.track('public_profile_visit', {
      //         userProfileViewed: user?._id,
      //       });
      //     }
      //   });
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loggedUser?._id]);

  useEffect(() => {
    if (!!user) {
      if (loggedUser?._id) {
        removeLocalStorage('passwordset');
      } else {
        setLocalStorage('passwordset', false);
      }
      if (!loggedIn || loggedUser._id !== user._id) {
        if (user.profileStatus !== 'active' || !user.isActiveProfile) {
          return history.push('/profile-unavailable');
        }
      } else if (
        loggedIn &&
        (!user.isActiveProfile ||
          !user.isEmailVerified ||
          !user.idIsVerified) &&
        !twoPanelLayout &&
        !preview &&
        getLocalStorage('welcomeModalClosedByUser', false) !== 'true'
      ) {
        setIsWelcomeModalOpen(true);
        setLocalStorage('welcomeModalClosedByUser', 'false', false);
      }
      const userLinks: IUserLink[] = arrayFilter(user.links as IUserLink[], {
        isActive: true,
      })
        ?.filter((f) => !f.isTemp)
        ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
      setServices(userLinks);
      // setServices(
      //   userLinks.filter(
      //     (link) =>
      //       link.linkType &&
      //       link.popLinksId?.popType !== ServiceType.CHAT_SUBSCRIPTION,
      //   ),
      // );
      // const isChatExist = userLinks.find(
      //   (l) =>
      //     l.linkType === 'service' &&
      //     l.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION &&
      //     l?.isActive,
      // );
      // setIsChatExist(!!isChatExist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const checkFor = async (id = '') => {
    try {
      return await checkOrderExists(id).then((res: any) => {
        if (res?.isExist) {
          // setIsLoading(false);

          history.push(`/messages/subscriptions?userId=${user?._id}&type=chat`);

          return false;
        }
        // setIsLoading(false);
        return true;
      });
    } catch (error) {
      // setIsLoading(false);
      return true;
    }
  };
  const onLinkViewSendAnalytics = async (
    link: any,
    socialLink?: IUser['socialMediaLinks'][number],
  ) => {
    const d: any = {
      linkTitle: null,
      linkID: null,
      linkURL: null,
      type: null,
      popType: null,
      price: 0,
    };
    if (link.popType) {
      d.popType = link.popType;
    }
    if (link.linkType) {
      d.linkTitle = link.title;

      if (link.linkType === 'socialLinks') {
        d.linkID = socialLink?._id;
        d.linkType = 'socialLink';
        d.linkURL = getLocation(socialLink?.url || '').href;
      } else {
        d.linkID = link._id;
        d.linkType = 'link';
        d.linkURL = getLocation(link.url).href;
      }
    } else {
      d.linkTitle = link.title;
      d.linkID = link._id;
      d.linkURL = `/${user?.username}/${link.popName}`;
      d.linkType = 'pop';
      d.price = link.price;
    }
    return d;
  };
  async function onClickHandler(this: any) {
    try {
      if (this.linkType) {
        this.linkType !== 'innerCircleLink' &&
          window.open(getLocation(this.url).href, '_blank');
        this.linkType === 'innerCircleLink' &&
          window.open(
            `${window.location.protocol}//${window.location.host}/signup/${user.username}`,
            '_blank',
          );
      }
    } catch (error) {
      console.log('');
    }
    const link = await onLinkViewSendAnalytics(this);
    if (link.linkType === 'pop') {
      !isPreview &&
        analytics.track('purchase_started', {
          purchasedFrom: user?._id,
          purchaseTypeSlug: link?.popType,
          purchaseAmount: link?.price,
          itemId: this._id,
        });

      dispatch(setOrder({}));
      if (
        !isPreview &&
        link?.popType === ServiceType.CHAT_SUBSCRIPTION &&
        loggedUser?._id
      ) {
        checkFor(this._id)
          .then((data) => {
            if (data) {
              history.push(link.linkURL);
            }
          })
          .catch(() => {
            history.push(link.linkURL);
          });
      } else {
        history.push(link.linkURL);
      }
    }
    if (!isPreview) {
      analytics.track('link_clicked', {
        userProfileViewed: user?._id,
        linkId: this._id,
        type: link.linkType == 'pop' ? link.linkType : link?.popType,
      });
    }
  }
  async function onRightClickHandler(item: any) {
    const link = await onLinkViewSendAnalytics(item);
    if (item.linkType === 'innerCircleLink') {
      window.open(
        `${window.location.protocol}//${window.location.host}/signup/${user.username}`,
        '_blank',
      );
      return;
    }

    if (link.linkType === 'pop') {
      !isPreview &&
        analytics.track('purchase_started', {
          purchasedFrom: user?._id,
          purchaseTypeSlug: link?.popType,
          purchaseAmount: link?.price,
          itemId: link?.linkID,
        });
    }
    !isPreview &&
      analytics.track('link_clicked', {
        userProfileViewed: user?._id,
        linkId: link?.linkID,
        type: link.linkType == 'pop' ? link.linkType : link?.popType,
      });

    try {
      if (isBuyerNotAllowPurchases) {
        return;
      }
      dispatch(setOrder({}));
      if (
        !isPreview &&
        link?.popType === ServiceType.CHAT_SUBSCRIPTION &&
        loggedUser?._id
      ) {
        checkFor(link?.linkID)
          .then((data) => {
            if (data) {
              window.open(link.linkURL, '_blank');
            }
          })
          .catch(() => {
            window.open(link.linkURL, '_blank');
          });
      } else {
        window.open(link.linkURL, '_blank');
      }
    } catch (error) {
      console.log('');
    }
  }

  const getService = (item: any, rest: any) => {
    if (!isProfileAllowSelling) {
      return null;
    }
    const {
      _id,
      actionText = 'Exclusive Content',
      title,
      popThumbnail,
      popType,
      isThumbnailActive,
    } = item.popLinksId;
    // if (previewpop?._id === _id) {
    //   _id = previewpop?._id;

    //   title = previewpop?.title;
    //   popThumbnail = previewpop?.popThumbnail;
    //   popType = previewpop?.popType;
    //   isThumbnailActive = previewpop?.isThumbnailActive;
    //   actionText = previewpop?.actionText;
    // }
    let iconUrl = popThumbnail;
    let fallbackUri = popThumbnail;
    if (isValidUrl(popThumbnail)) {
      const { url, fallbackUrl } = getImageURL({
        url: popThumbnail,
        settings: {
          onlyMobile: true,
          imgix: {
            all: 'w=64&h=64',
          },
        },
      });
      iconUrl = url;
      fallbackUri = fallbackUrl;
    }
    return (
      <ListItem
        disabled={isBuyerNotAllowPurchases}
        key={_id}
        title={popType !== ServiceType.CHAT_SUBSCRIPTION ? title : actionText}
        icon={iconUrl}
        fallbackUrl={fallbackUri}
        type={popType}
        showIcon={isThumbnailActive}
        onClick={onClickHandler.bind(item.popLinksId)}
        onContextMenu={(e: any) => {
          dispatch(setOrder({}));
          if (
            popType === ServiceType.CHAT_SUBSCRIPTION &&
            !isPreview &&
            loggedUser?._id
          ) {
            checkFor(item.popLinksId?._id)
              .then((data) => {
                if (data) {
                  handleContextMenu(e, item.popLinksId);
                }
              })
              .catch(() => {
                handleContextMenu(e, item.popLinksId);
              });
          } else {
            handleContextMenu(e, item.popLinksId);
          }
        }}
        {...rest}
      />
    );
  };

  const GetListItem: React.FC<{
    item: IUserLink;
    user: IUser & { subtitle?: string };
  }> = ({ item, user, ...rest }) => {
    let iconUrl = item?.imageURL;
    let fallbackUri = item?.imageURL;
    if (isValidUrl(item?.imageURL)) {
      const { url, fallbackUrl } = getImageURL({
        url: item?.imageURL,
        settings: {
          onlyMobile: true,
          imgix: {
            all: 'w=64&h=64',
          },
        },
      });
      iconUrl = url;
      fallbackUri = fallbackUrl;
    }
    switch (item?.linkType) {
      case 'socialLinks':
        return (
          <SocialNetworks key={item?._id} onClick={() => {}} className="my-30">
            {user?.socialMediaLinks?.map((link) =>
              getSocialMediaIcon(link, theme, () => {
                !isPreview &&
                  analytics.track('link_clicked', {
                    userProfileViewed: user?._id,
                    linkId: link?._id,
                    type: item?.linkType,
                  });
              }),
            )}
          </SocialNetworks>
        );
      case 'sectionTitle':
        return <SectionTitle key={item?._id}>{item.title}</SectionTitle>;
      case 'contentBlock':
        return <p key={item?._id}>{item.content}</p>;
      case 'biography':
        return (
          <div className="mb-16" key={item._id} {...rest}>
            <div>
              {!!user?.subtitle && (
                <h4 className="text-center">{user?.subtitle}</h4>
              )}
              {!!user?.description && (
                <p className="text-center">{user?.description}</p>
              )}
            </div>
          </div>
        );
      case 'simpleLink':
      case 'innerCircleLink':
        return (
          <div>
            <ListItem
              fallbackUrl={fallbackUri}
              key={item._id}
              title={item.title}
              setShowDropDown={setShowDropDown}
              linkType={!isValidUrl(item?.imageURL) ? item?.platfrom : ''}
              icon={iconUrl}
              onClick={
                !item?.isSensitve
                  ? onClickHandler.bind(item)
                  : () => {
                      if (item?._id === showDropDown) {
                        setShowDropDown('');
                        return;
                      }
                      setShowDropDown(item?._id as string);
                    }
              }
              showIcon={item.isThumbnailActive}
              onContextMenu={(e: any) => {
                if (!item?.isSensitve) {
                  return handleContextMenu(e, item);
                }
                if (item?._id === showDropDown) {
                  setShowDropDown('');
                  return;
                }
                setShowDropDown(item?._id as string);
              }}
              {...rest}
            />
            {item?.isSensitve && item?._id === showDropDown && (
              <SenstiveBlock ref={ref}>
                <h2>Sensitive Content</h2>
                <p>
                  This link may contain content that is not appropriate for all
                  audiences.
                </p>
                <Button onClick={onClickHandler.bind(item)}>Continue</Button>
              </SenstiveBlock>
            )}
          </div>
        );
      case 'youtubeLink':
        const { mute, autoPlay, loop, url } = item;
        return (
          <VideoPlay
            key={item._id}
            url={url}
            loop={loop}
            mute={mute}
            playing={autoPlay}
            {...rest}
          />
        );
      case 'service':
        if (!item?.popLinksId?._id) return null;
        return getService(item, rest);
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="profile--info">{getTopSection(theme, user)}</div>
        <div id="public-landing">
          {user ? (
            <>
              {/* {ischatExist &&
                user?.enableMembershipFunctionality &&
                isEmailVerified &&
                isProfileAllowSelling &&
                getSubForm} */}
              <div id="service-listing" className="mb-15">
                {services.map((item: any, idx) => (
                  <GetListItem key={item?._id || idx} item={item} user={user} />
                ))}
              </div>
            </>
          ) : (
            <LinksSkeleton />
          )}
        </div>
      </div>

      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setIsWelcomeModalOpen(false);
          setLocalStorage('welcomeModalClosedByUser', 'true', false);
        }}
        publicProfile
        user={user}
      />
    </>
  );
};
export default withTheme(styled(PublicProfile)``);
