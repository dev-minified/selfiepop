import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import ComponentsHeader from 'components/ComponentsHeader';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useWallHook from 'hooks/useWallHook';
import { ReactElement, useState } from 'react';
import { selectPostLength, selectWallPosts } from 'store/reducer/member-post';
import { setActiveProfileMemberShip } from 'store/reducer/profileVisitor';
import { getUnlockMediaVault } from 'store/reducer/vault';
import styled from 'styled-components';

import { RequestLoader } from 'components/SiteLoader';
import ProfileMediaTabs from './ProfileMediaTabs';
import Subscribecomp from './components/Subscribecomp';
dayjs.extend(utc);
dayjs.extend(relativeTime);
const RqLoader = styled(RequestLoader)`
  position: fixed;
  top: 95%;
  z-index: 9;
  left: 50%;
  transform: translateX(-60%);
  /* display: flex; */
  /* justify-content: center; */
  width: 100%;
`;
const ProfileVisitorLeftSide = ({
  className,
}: {
  className?: string;
}): ReactElement => {
  const user = useAuth()?.user;
  const dispatch = useAppDispatch();
  const [activeTabs, setActiveTabs] = useState('1');
  const [isLoadiing, setIsLoading] = useState(false);
  const selectedProfile = useAppSelector(
    (state) => state.profileVisitor.selectedProfile,
  );
  const activeMemberShip = useAppSelector(
    (state) => state.profileVisitor.activeMemberShip,
  );
  const vaultMedia = useAppSelector((state) => state.vault.media);
  const { items } = useAppSelector((state) => selectWallPosts(state));
  const postLength = useAppSelector((state) => selectPostLength(state));
  const pinPosts = useAppSelector((state) => state.memberPost?.pinPosts);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const isMyPostsFetching = useAppSelector(
    (state) => state.memberPost.isMyPostsFetching,
  );
  const type = useAppSelector((state) => state.vault.activeType);
  const isFetchingMedia = useAppSelector((state) => state.vault.loading);

  const { handlePaginationPosts } = useWallHook({
    sellerId: selectedProfile?._id || '',
    buyerId: user?._id || '',
    isBuyer: true,
    isBuyerView: true,
  });
  const onChangeTab = (tab: string) => {
    setActiveTabs(tab);
  };
  const getPostPagination = async (e: any) => {
    if (items?.length < postLength) {
      const { scrollTop, scrollHeight, clientHeight } = e.target as any;
      const pad = 100; // 100px of the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isMyPostsFetching) {
        const pinArray = Object.keys(pinPosts || {});
        try {
          setIsLoading(true);
          await handlePaginationPosts?.({
            skip: items?.length - pinArray.length || 0,
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    }
  };
  const getMediaPagination = async (e: any) => {
    if (vaultMedia?.items?.length < vaultMedia?.totalCount) {
      const { scrollTop, scrollHeight, clientHeight } = e.target as any;
      const pad = 100; // 100px of the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isFetchingMedia) {
        setIsLoading(true);
        return await dispatch(
          getUnlockMediaVault({
            sellerId: (selectedProfile?._id as string) || '',
            type,
            params: {
              limit: 9,
              skip: vaultMedia?.items?.length || 0,
            },
          }),
        )
          .unwrap()
          .then((d) => {
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      }
    }
  };
  const LoadMore = async (e: any) => {
    try {
      if (activeTabs == '1') {
        await getPostPagination(e);

        return;
      }
      await getMediaPagination(e);
    } catch (error) {}
  };

  const isSubNotExist = !!(activeMemberShip && activeMemberShip?._id);
  const isUserVerified =
    selectedProfile?.isEmailVerified && selectedProfile.idIsVerified;
  const coverImage = selectedProfile?.coverPhoto?.isActive
    ? selectedProfile.coverPhoto?.image
    : '/assets/images/defaultCover.png';
  return (
    <div className={`${className} left-block`}>
      <Scrollbar onScroll={LoadMore}>
        <div className="content-wapper">
          <div className="top-content">
            <ComponentsHeader
              // onClick={onbackClick}
              backUrl={'/new-feeds'}
              title={
                <h4 className="name_title">
                  {selectedProfile?.pageTitle ?? 'Incognito User'}{' '}
                  {isUserVerified ? (
                    <ProfleTickIcon width="14" height="14" fill="#fff" />
                  ) : null}
                </h4>
              }
            />

            <div className="bg-img">
              <ImageModifications
                imgeSizesProps={{ onlyDesktop: true }}
                src={coverImage}
                fallbackUrl={'/assets/images/defaultCover.png'}
              />
            </div>
            <div className="block-subcription">
              <div className="suggested-user-details">
                <div className="image-holder">
                  <ImageModifications
                    imgeSizesProps={{ onlyMobile: true }}
                    src={selectedProfile?.profileImage}
                    // src={
                    //   selectedProfile?.profileImage ||
                    //   '/assets/images/default-profile-img.svg'
                    // }
                    // fallbackUrl={'/assets/images/default-profile-img.svg'}
                    fallbackComponent={
                      <AvatarName
                        text={selectedProfile?.pageTitle || 'Incongnito User'}
                      />
                    }
                  />
                </div>
              </div>
              <div className="text-holder">
                <strong className="title">
                  {selectedProfile?.pageTitle || 'Incongnito User'}
                  {isUserVerified ? (
                    <ProfleTickIcon
                      width="14"
                      height="14"
                      fill="var(--pallete-primary-main)"
                    />
                  ) : null}
                </strong>
                <span className="user-name">
                  {`@${selectedProfile?.username}`}
                  <span className="last-seen">{`Last seen ${dayjs(
                    (selectedProfile as any)?.offlineAt,
                  )
                    .utc()
                    .fromNow()}`}</span>
                </span>
                <p>{selectedProfile?.description}</p>
              </div>
              {isSubNotExist ? (
                <Button
                  size="large"
                  type="primary"
                  shape="circle"
                  block
                  onClick={() => {
                    if (!user.allowPurchases) {
                      toast.error(USERCHARGEBACKMESSAGE);
                      return;
                    }
                    setIsModelOpen(true);
                  }}
                >
                  {`Subscribe for ${
                    !!activeMemberShip?.price
                      ? `$${activeMemberShip?.price}`
                      : 'free'
                  }`}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
          {isModelOpen ? (
            <Subscribecomp
              title="Your Monthly subscription to"
              onSubmitCallback={() => {
                setIsModelOpen(false);
                dispatch(setActiveProfileMemberShip(undefined));
                toast.success('You successfully subscribed this user');
              }}
              onClose={() => setIsModelOpen(false)}
            />
          ) : null}
          {selectedProfile?.allowSelling && (
            <ProfileMediaTabs onChangeTab={onChangeTab} />
          )}
          {isLoadiing ? (
            <RqLoader
              isLoading={true}
              width="30px"
              height="30px"
              color="var(--pallete-primary-main)"
            />
          ) : null}
        </div>
      </Scrollbar>
    </div>
  );
};
export default styled(ProfileVisitorLeftSide)`
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;

  .top-content {
    position: relative;
  }

  .bg-img {
    height: 280px;
    position: relative;

    @media (max-width: 767px) {
      height: 160px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .slide-header {
    background: none;
    position: absolute;
    padding: 18px 20px;
    left: 0;
    top: 0;
    right: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.52) 5.95%,
      rgba(0, 0, 0, 0) 86.37%
    );
    border: none;
    color: #fff;

    .link-back {
      color: #fff;
    }

    .title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;

      .name_title {
        margin: 0;
      }

      svg {
        margin: 0 0 0 5px;
      }
    }
  }

  .block-subcription {
    padding: 0 61px;
    font-size: 16px;
    line-height: 20px;
    margin: 0 0 35px;

    @media (max-width: 1199px) {
      padding: 0 30px;
    }

    @media (max-width: 767px) {
      margin: 0 0 15px;
      padding: 0 15px;
      line-height: 24px;
    }

    &:after {
      position: absolute;
      left: 32px;
      right: 32px;
      bottom: 0;
      height: 2px;
      content: '';
      background: var(--pallete-primary-main);
      display: none;
    }

    .image-holder {
      width: 142px;
      height: 142px;
      border-radius: 100%;
      border: 4px solid #ffffff;
      overflow: hidden;
      margin: -71px 0 22px;
      position: relative;

      @media (max-width: 767px) {
        width: 100px;
        height: 100px;
        margin: -50px 0 9px;
        border: 2px solid var(--pallete-background-default);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      display: block;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      margin: 0 0 4px;

      svg {
        margin: 0 0 0 5px;
      }

      path {
        .sp_dark & {
          fill: #fff;
        }
      }
    }

    .user-name {
      display: block;
      font-weight: 400;
      color: var(--pallete-text-light-200);
      font-size: 14px;
      line-height: 16px;
      margin: 0 0 14px;
    }

    .last-seen {
      position: relative;
      padding: 0 0 0 20px;

      &:before {
        position: absolute;
        left: 8px;
        top: 50%;
        width: 4px;
        height: 4px;
        content: '';
        background: var(--pallete-text-light-200);
        border-radius: 100%;
        transform: translate(0, -50%);
      }
    }

    p {
      margin: 0 0 23px;
    }

    .button {
      &:hover {
        border-color: #fff;
        background: none;
        color: #fff;
      }
    }
  }

  .mt-20 {
    margin-top: 0 !important;

    .posts-wrap {
      border: none;
    }

    .list-container {
      padding-top: 0;
    }

    .pop-card {
      margin: 0;
    }
  }

  .rc-tabs-tabpane {
    .pb-20 {
      position: relative;
      border-bottom: 1px solid var(--pallete-primary-main);
    }
  }

  .pop-card {
    padding: 20px 0 0;
    border: none;
  }

  .card-footer-area {
    border: none;
    margin: 0;
  }

  .button {
    &.button-lg {
      padding: 12px 20px;
    }
  }

  .content-wapper {
    max-width: 784px;
    margin: 0 auto;
  }

  .add_comment_content {
    .pop-card {
      padding: 0;
    }

    .tip-row {
      margin-left: 0;
      margin-right: 0;
    }
  }
`;
