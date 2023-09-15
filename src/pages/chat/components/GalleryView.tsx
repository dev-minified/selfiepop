import { ArrowDown, Spinner } from 'assets/svgs';
import axios from 'axios';
import AttachmentLightBoxGallery from 'components/AttachmentLightBoxGallery';
import EmptydataMessage from 'components/EmtpyMessageData';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { getAllMedia, setMedia } from 'store/reducer/chat';
import styled from 'styled-components';

interface Props {
  postTemplate?: any;
  className?: string;
  showOptions?: {
    video?: boolean;
    play?: boolean;
    timeStampText?: boolean;
    edit?: boolean;
    closeIcon?: boolean;
    selectable?: boolean;
    showprogress?: boolean;
  };
}
const GalleryLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
//TODO: Implement Load more
const GalleryView: React.FC<Props> = (props) => {
  const {
    className,

    showOptions = {
      timeStampText: false,
      video: false,
      play: false,
      edit: false,
      closeIcon: false,
      selectable: false,
      showprogress: false,
    },
  } = props;
  const dispatch = useAppDispatch();
  const selectedSub = useAppSelector(
    (state) => state.chat.selectedSubscription,
  );
  const cancelToken = useRef<any>();
  const media = useAppSelector((state) => state.chat.media);
  const isGalleryLoading = useAppSelector(
    (state) => state.chat.isGalleryLoading,
  );
  useEffect(() => {
    if (selectedSub?._id) {
      if (cancelToken.current !== undefined) {
        cancelToken.current.cancel('Operation canceled due to new request.');
      }
      cancelToken.current = axios.CancelToken.source();
      dispatch(setMedia({ items: [], hasMore: false }));
      dispatch(
        getAllMedia({
          id: selectedSub._id,
          options: {
            params: {
              limit: isMobile ? 10 : 15,
            },
            cancelToken: cancelToken.current.token,
          },
        }),
      );
    }
  }, [dispatch, selectedSub?._id]);
  const loadMore = async () => {
    if (selectedSub?._id && !!media.items?.length) {
      if (cancelToken.current !== undefined) {
        cancelToken.current.cancel('Operation canceled due to new request.');
      }
      cancelToken.current = axios.CancelToken.source();
      dispatch(
        getAllMedia({
          id: selectedSub._id,
          options: {
            params: {
              limit: isMobile ? 10 : 15,
              endingBefore: media.items[media.items?.length - 1]._id,
            },
            cancelToken: cancelToken.current.token,
          },
        }),
      );
    }
  };
  if (isGalleryLoading && !media.items?.length) {
    return (
      <GalleryLoader>
        <Spinner color="var(--pallete-primary-main)" />;
      </GalleryLoader>
    );
  }

  return (
    <div className={className}>
      <Scrollbar>
        <div className={`media`} id={'gallary-gallery'}>
          {!!media.items?.length && (
            <AttachmentLightBoxGallery
              media={media.items}
              showOptions={showOptions}
            />
          )}
        </div>
        {isGalleryLoading && !!media.items?.length && (
          <LoaderWrapper>
            <Spinner
              width="28px"
              height="28px"
              color="var(--pallete-text-secondary-50)"
            />
          </LoaderWrapper>
        )}
        {media.hasMore && !isGalleryLoading && (
          <Button
            onClick={loadMore}
            icon={<ArrowDown />}
            block
            outline
            className="mt-10 mb-20"
          >
            Load More
          </Button>
        )}

        {!media.items?.length && !isGalleryLoading && (
          <EmptydataMessage text=" You don't have any media." />
        )}
      </Scrollbar>
    </div>
  );
};

export default styled(GalleryView)`
  padding: 5px;
  overflow: hidden;
  height: 100%;

  .media {
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 767px) {
      padding: 14px 0;
    }
  }
`;
const LoaderWrapper = styled.div`
  z-index: 9;
  display: flex;
  padding-bottom: 1rem;
  padding-top: 1rem;
  justify-content: center;

  -moz-user-select: none;
  -webkit-user-select: none;
`;
