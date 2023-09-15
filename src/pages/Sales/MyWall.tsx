import { ArrowBack } from 'assets/svgs';
// import PinPost from 'components/Feature/PinPost';
import EditPostModal from 'components/Models/EditPostModal';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import VirtualItem from 'components/VirtualItem';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useBrowserBack from 'hooks/useBrowserBack';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import MemberWelcomePage from 'pages/MemberWelcomePage';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import {
  selectPostLength,
  selectWallPosts,
  setSelectedScheduledPost,
  toggleEditPost,
} from 'store/reducer/member-post';
import styled from 'styled-components';
import Post from './Post';
import DeleteModal from './components/Model/DeleteModal';
import StatisticsModal from './components/Model/StatisticsModal';

dayjs.extend(utc);
dayjs.extend(relativeTime);
const RqLoader = styled(RequestLoader)`
  margin-top: 1rem;

  &.bottom-loader {
    margin: 0;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 0;
    background: rgba(255, 255, 255, 0.4);
    padding: 10px 0;

    .sp_dark & {
      background: rgba(0, 0, 0, 0.4);
    }
  }
`;
const BackArrow = styled.div`
  /* position: absolute; */
  /* left: -80%; */
  cursor: pointer;
  transition: all 0.3ms ease;
  &:hover {
    color: var(--pallete-primary-main);
  }
`;
type ModelOptions = 'delete' | 'edit' | '';
// const PAGE_LIMIT = 10;
const ESTIMATED_ITEM_HEIGHT = 500;
function MyWall(props: {
  managedAccountId?: string;
  managedUser?: any;
  className?: string;
  createPost?: boolean;
  isPreview?: boolean;
  backButton?: boolean;
  showAttachmentViwe?: boolean;
  showRightView?: boolean;
  allowActions?: boolean;
  getPaginatedPosts?: (...args: any[]) => Promise<any>;
  onTogglePostLike?: (...args: any[]) => Promise<any>;
  onToggleCommentLike?: (...args: any[]) => Promise<any>;
  onCommentspagination?: (...args: any[]) => Promise<any>;
  onAddComemnt?: (...args: any[]) => Promise<any>;
  onDeletePost?: (id: string) => Promise<any>;
  onAddReplyToComment?: (...args: any[]) => Promise<any>;
  onPostCommentRepliesPagination?: (...args: any[]) => Promise<any>;
  onToggleCommentReplyLike?: (...args: any[]) => Promise<any>;
  onPinClick?: (item: IPost) => void;
  onUnPinPost?: (postId: string) => void | Promise<any>;
}): ReactElement {
  const {
    className,
    managedAccountId,
    isPreview = false,
    backButton = false,

    getPaginatedPosts,

    onDeletePost,

    onPinClick,
    onAddComemnt,
    onAddReplyToComment,
    onCommentspagination,
    onPostCommentRepliesPagination,
    onToggleCommentLike,
    allowActions,
    managedUser,
    onToggleCommentReplyLike,
    onTogglePostLike,
    showRightView,
  } = props;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line
  const scrollbarRef = useRef<any>(null);

  const { showLeftView } = useControllTwopanelLayoutView();

  const [openModel, setOpenModel] = useState<ModelOptions>('');

  const pinPosts = useAppSelector((state) => state.memberPost?.pinPosts);
  const { items } = useAppSelector((state) => selectWallPosts(state));
  const postLength = useAppSelector((state) => selectPostLength(state));
  const { pressed, isDesktop: isDesktopview, direction } = useBrowserBack();
  const ref = useRef(null);
  const listREf = useRef(null);
  const isMyPostsFetching = useAppSelector(
    (state) => state.memberPost.isMyPostsFetching,
  );

  const [selected, setSelected] = useState<any>();
  const onConformToDelete = (val: ModelOptions, obj: Record<string, any>) => {
    setSelected(obj);
    setOpenModel(val);
  };

  useEffect(() => {
    if (!isDesktopview && pressed && direction === 'prev') {
      showLeftView();
    }
  }, [pressed, direction]);

  useEffect(() => {
    const d: any = document.getElementById('wrapper');
    if (!!d) {
      d.classList.add('wrapper-area');

      return () => {
        d.classList.remove('wrapper-area');
      };
    }
  }, []);

  const onEditItem = (item: IPost) => {
    dispatch(setSelectedScheduledPost(item));
    dispatch(toggleEditPost({ isOpen: true }));
  };
  const onDeleteItem = (item: IPost) => {
    onConformToDelete('delete', item || {});
  };
  const onPinItem = (item: IPost) => {
    onPinClick?.(item);
  };

  // const pinPosts = pinArray.map((p) => ({
  //   ...(pinKey?.[p] || {}),
  //   pin: true,
  // }));
  const LoadMore = async (e: any) => {
    if (items?.length < postLength) {
      const { scrollTop, scrollHeight, clientHeight } = e.target as any;
      const pad = 100; // 100px of the bottom

      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isMyPostsFetching) {
        const pinArray = Object.keys(pinPosts || {});
        await getPaginatedPosts?.({
          skip: items?.length - pinArray.length || 0,
        }).catch((e) => console.log(e));
      }
    }
  };

  const scrollElement = document.querySelector('#my-post-scroller')
    ?.firstChild as HTMLElement;
  const getComponent = () => {
    // const pinArray = Object.keys(pinKey || {});
    // const isUserVerified =
    //   (managedUser || user)?.isEmailVerified &&
    //   (managedUser || user)?.idIsVerified;
    return (
      <React.Fragment>
        <div className="posts-wrap" ref={ref}>
          <Scrollbar onScroll={LoadMore} id="my-post-scroller">
            <div className="list-container" ref={listREf}>
              {items?.map((item: IPost) => (
                <VirtualItem
                  defaultHeight={ESTIMATED_ITEM_HEIGHT}
                  key={item.id}
                  root={scrollElement}
                  initialVisible={true}
                  visibleOffset={10000}
                  id={item.id}
                >
                  <Post
                    // key={item._id}
                    key={item.id}
                    postItem={item}
                    isSeller={true}
                    user={user}
                    onDeleteItem={onDeleteItem}
                    onEditItem={onEditItem}
                    onPinItem={onPinItem}
                    onAddComemnt={onAddComemnt}
                    onAddReplyToComment={onAddReplyToComment}
                    onPostCommentRepliesPagination={
                      onPostCommentRepliesPagination
                    }
                    onCommentspagination={onCommentspagination}
                    onToggleCommentLike={onToggleCommentLike}
                    onTogglePostLike={onTogglePostLike}
                    onToggleCommentReplyLike={onToggleCommentReplyLike}
                    managedAccountId={managedAccountId}
                    showRightView={showRightView}
                    allowActions={allowActions}
                    managedUser={managedUser}
                  />
                </VirtualItem>
              ))}
            </div>
          </Scrollbar>
        </div>
        <StatisticsModal
          title="Edit Post"
          isOpen={openModel === 'edit'}
          managedAccountId={managedAccountId}
          onClose={() => setOpenModel('')}
        />
        <DeleteModal
          isOpen={openModel === 'delete'}
          onClose={() => setOpenModel('')}
          onClick={() => {
            setOpenModel('');
            onDeletePost?.(selected?._id || '')
              .then(() => {
                toast.success('The post has been deleted successfully');
              })
              .catch(console.log);
          }}
        />

        {isMyPostsFetching && !!postLength && (
          <RqLoader
            isLoading={true}
            width="28px"
            height="28px"
            color="var(--pallete-primary-main)"
          />
        )}
      </React.Fragment>
    );
  };
  return (
    <div className={`${className} mt-20`}>
      <EditPostModal
        managedAccountId={managedAccountId}
        isOpen={true}
        onClose={() => {}}
      />

      {!isPreview ? (
        <>
          {backButton && !isDesktop && (
            <BackArrow
              className="mb-10 back-arrow"
              onClick={() => {
                showLeftView();
              }}
            >
              <ArrowBack /> <strong className="ml-5">Back</strong>
            </BackArrow>
          )}

          <>
            {isMyPostsFetching && !postLength && (
              <RqLoader
                isLoading={true}
                width="28px"
                height="28px"
                color="var(--pallete-primary-main)"
              />
            )}
            <div className="post-scrollerparant">
              {!isMyPostsFetching && !postLength && (
                <Scrollbar className="post-scroller">
                  <div className="p-10 empty-data">
                    <MemberWelcomePage />
                  </div>
                </Scrollbar>
              )}
              {getComponent()}
            </div>
          </>
        </>
      ) : (
        <React.Fragment>
          {isMyPostsFetching && !postLength && (
            <RqLoader
              isLoading={true}
              width="28px"
              height="28px"
              color="var(--pallete-primary-main)"
            />
          )}

          {getComponent()}
        </React.Fragment>
      )}
    </div>
  );
}

export default styled(MyWall)`
  height: 100%;
  position: relative;
  &.rightwall {
    /* padding-top: 0 !important; */
    margin-top: 0 !important;

    .post-scrollerparant {
      /* height: calc(${window.innerHeight + 'px'} - 114px); */
      margin: 0;
      /* 
      @media (max-width: 767px) {
        height: calc(${window.innerHeight + 'px'} - 279px);
      } */
      .post-card {
        max-width: 687px;
        width: 100%;
        margin: 0 auto;

        @media (max-width: 767px) {
          width: calc(100% - 30px);
        }
      }
    }
  }

  .posts-wrap {
    /* height: calc(${window.innerHeight + 'px'} - 50px); */
    height: 100%;
    padding-top: 15px;
    padding-bottom: 12px;
    margin: 0 auto;
    @media (max-width: 767px) {
      /* height: calc(${window.innerHeight + 'px'} - 279px); */
      padding-bottom: 15px;
    }
  }

  .back-arrow {
    padding: 15px 15px 0;
  }

  .card-header_name {
    .title {
      text-transform: capitalize;
    }
  }
  .post-scrollerparant {
    /* height: calc(100vh - 258px); */
    height: 100%;
    margin: 0 -15px;

    @media (max-width: 767px) {
      /* height: calc(100vh - 240px); */
    }

    .post-card {
      width: 100%;
    }

    .rc-virtual-list-holder-inner {
      padding: 15px;
      max-width: 702px;
      margin: 0 auto;
    }
  }
  .post-scroller {
    > div {
      z-index: 2;
    }
  }
  .delete-modal {
    text-align: center;
  }
  .card-header_name .title {
    cursor: pointer;
  }
  .posts_list {
    .rc-virtual-list-holder-inner {
      align-items: center;

      @media (max-width: 767px) {
        padding: 0 15px;
      }
    }
    .rc-virtual-list-scrollbar {
      width: 10;
      z-index: 1;
    }
  }
`;
