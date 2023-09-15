import {
  Advertise,
  ChatSubscriptionIcon,
  CustomServices,
  DigitalDownload,
  Link as LinkIcon,
  Payma,
  PopLive,
  ProductAndServices,
  ProfileAvatar,
  Shoutout,
  Text,
  ThumbsUp,
  Youtube,
} from 'assets/svgs';
import classNames from 'classnames';
import Scrollbar from 'components/Scrollbar';
import {
  ENVIRONMENT,
  POP_BIOGRAPHY_DISABLE,
  POP_CHAT_SUBSCRIPTION_DISABLE,
  POP_CONTENT_BLOCK_DISABLE,
  POP_CUSTOM_SERVICES_DISABLE,
  POP_CUSTOM_VIDEO_DISABLE,
  POP_DIGITAL_DOWNLOADS_DISABLE,
  POP_LINK_DISABLE,
  POP_LIVE_DISABLE,
  POP_PAID_FANMAIL_DISABLE,
  POP_PAID_PROMOTIONS_DISABLE,
  POP_SECTION_TITLE_DISABLE,
  POP_YOUTUBE_VIDEO_DISABLE,
} from 'config';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { removePop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import { arrayFind } from 'util/index';
import PopWidget from './components/PopWidget';
function PopTypeList({ className }: { className?: string }): ReactElement {
  const { type, ...rest } = useQuery();
  const [isChatPopExist, setisChatPopExist] = useState(true);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const previewPopID = useAppSelector(
    (state) => state.popslice?.previewPop?.popLinksId,
  );
  useEffect(() => {
    if (previewPopID) {
      setTimeout(() => {
        dispatch(removePop());
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (user?._id) {
      const isChatPop = user.links?.find(
        (p) => p?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
      )?._id;
      setisChatPopExist(!!isChatPop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);
  const getWidgets = useCallback(
    (user: IUser) => {
      const disableSocailIconWidget = !arrayFind(user?.links, {
        linkType: 'socialLinks',
      });
      const allowUser =
        user?.enableMembershipFunctionality && !user.skipOnBoarding;
      switch (type) {
        case 'links':
          return (
            <Fragment>
              {POP_LINK_DISABLE && (
                <Link to={`/my-profile/link?type=simpleLink&subType=link`}>
                  <PopWidget
                    className="pop-item"
                    title="Basic Link"
                    subtitle="Link to any website address you want."
                    icon={<LinkIcon color="var(--pallete-primary-main)" />}
                  />
                </Link>
              )}
              {POP_SECTION_TITLE_DISABLE && (
                <Link to={`/my-profile/link?type=content&subType=sectionTitle`}>
                  <PopWidget
                    className="pop-item"
                    title="Section Title"
                    subtitle="Add a title to your Pop Page to organize your page content."
                    icon={<Text />}
                  />
                </Link>
              )}
              {POP_YOUTUBE_VIDEO_DISABLE && (
                <Link
                  to={`/my-profile/link?type=simpleLink&subType=youtubeLink`}
                >
                  <PopWidget
                    className="pop-item youtube-item"
                    title="YouTube/Vimeo Video"
                    subtitle="Share a youtube or vimeo video directly on your Pop Page."
                    icon={
                      <Youtube
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_BIOGRAPHY_DISABLE && (
                <Link to={`/my-profile/link?type=content&subType=biography`}>
                  <PopWidget
                    className="pop-item"
                    title="Biography"
                    subtitle="Share some information about yourself with your audience."
                    icon={<ProfileAvatar />}
                  />
                </Link>
              )}

              {POP_CONTENT_BLOCK_DISABLE && (
                <Link to={`/my-profile/link?type=content&subType=contentBlock`}>
                  <PopWidget
                    className="pop-item"
                    title="Content Block"
                    subtitle="Add a title so you can organize the Pops on your page."
                    icon={<Text />}
                  />
                </Link>
              )}

              {disableSocailIconWidget && (
                <Link to={`/my-profile/link?type=socialLinks`}>
                  <PopWidget
                    className="pop-item"
                    title="Social Icons"
                    subtitle="Social Icons linking to your profile."
                    icon={<ThumbsUp />}
                  />
                </Link>
              )}
              {POP_YOUTUBE_VIDEO_DISABLE && (
                <Link to={`/my-profile/services?section=links`}>
                  <PopWidget
                    className="pop-item youtube-item"
                    title="Product or Service"
                    subtitle="Add a link to a product or service you want to offer your followers."
                    icon={<ProductAndServices />}
                  />
                </Link>
              )}
            </Fragment>
          );
        case 'service':
          return (
            <Fragment>
              {POP_CUSTOM_VIDEO_DISABLE && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.SHOUTOUT,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Custom Video"
                    subtitle="Sell custom video training, greetings or any other video type  to your fans, followers and friends."
                    icon={
                      <Shoutout
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_PAID_FANMAIL_DISABLE && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.PAYMA,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Paid Q&A"
                    subtitle="Get paid to answer your fans and followers questions"
                    icon={
                      <Payma
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_LIVE_DISABLE && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.POPLIVE,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Pop Live"
                    subtitle="Get paid to host virtual meetings in your private video chat room."
                    icon={
                      <PopLive
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_DIGITAL_DOWNLOADS_DISABLE && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.DIGITAL_DOWNLOADS,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Digital Downloads"
                    subtitle="Sell education, art or any other pre-made digital media as a digital download. "
                    icon={
                      <DigitalDownload
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_CHAT_SUBSCRIPTION_DISABLE &&
                !isChatPopExist &&
                allowUser && (
                  <Link
                    to={`/my-profile/link?${stringify({
                      type: 'service',
                      subType: ServiceType.CHAT_SUBSCRIPTION,
                      mode: 'add',
                      ...rest,
                    })}`}
                  >
                    <PopWidget
                      className="pop-item"
                      title="Chat Subscription"
                      subtitle="Create Different Memberships level for your follwers. "
                      icon={
                        <ChatSubscriptionIcon
                          secondaryColor="var(--pallete-primary-main)"
                          primaryColor="white"
                        />
                      }
                    />
                  </Link>
                )}
              {((POP_PAID_PROMOTIONS_DISABLE && user.allowPromotions) ||
                ENVIRONMENT === 'development') && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.ADVERTISE,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Promotional Shoutouts"
                    subtitle="Provide Promotional Shoutouts to other brands through your social media channels."
                    icon={
                      <Advertise
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
              {POP_CUSTOM_SERVICES_DISABLE && (
                <Link
                  to={`/my-profile/link?${stringify({
                    type: 'service',
                    subType: ServiceType.ADDITIONAL_SERVICES,
                    mode: 'add',
                    ...rest,
                  })}`}
                >
                  <PopWidget
                    className="pop-item"
                    title="Custom Services"
                    subtitle="Offer any custom service you can complete in five days or less and deliver the results through your Pop Page. "
                    icon={
                      <CustomServices
                        secondaryColor="var(--pallete-primary-main)"
                        primaryColor="white"
                      />
                    }
                  />
                </Link>
              )}
            </Fragment>
          );
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, isChatPopExist],
  );

  return (
    <div className={classNames('pop_type_list', className)}>
      <Scrollbar>
        <div className="pop_list_wrapper">
          <div className="block-head">
            <div className="caption">
              {type === 'services'
                ? 'Choose which product or service you want to create for your Pop Page.'
                : 'Please choose the type of link you want to add to your page'}
            </div>
          </div>
          {getWidgets(user)}
        </div>
      </Scrollbar>
    </div>
  );
}

export default styled(PopTypeList)`
  height: 100%;
  background: var(--pallete-background-default);
  .pop_list_wrapper {
    padding: 24px 18px;

    .block-head h5 {
      font-weight: 500;
    }

    .pop-item {
      border-top: 1px solid var(--pallete-colors-border);
      position: relative;
      z-index: 2;

      &.pop-item-alt {
        .icon {
          background: var(--pallete-primary-main);
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;

          @media (max-width: 767px) {
            height: 34px;
            padding: 6px;
          }

          svg {
            max-width: 36px;
            border-radius: 0;

            path {
              fill: #fff !important;
            }
          }
        }
      }

      &:hover {
        &:before {
          opacity: 1;
          visibility: visible;
        }
      }

      &:before {
        z-index: -1;
        top: 10px;
        bottom: 10px;
        left: -10px;
        right: -10px;
        content: '';
        border-radius: 10px;
        background: var(--pallete-background-gray);
        position: absolute;
        transition: all 0.4s ease;
        opacity: 0;
        visibility: hidden;
      }

      .icon {
        border-radius: 100%;

        svg {
          border-radius: 100%;
        }
      }
    }
  }
`;
