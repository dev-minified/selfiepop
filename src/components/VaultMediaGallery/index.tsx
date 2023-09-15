import { defaultImagePlaceholder } from 'appconstants';
import attrAccept from 'attr-accept';
import GallaryViewModal from 'components/PrivatePageComponents/GallaryViewModal';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import useSingleAndDoubleClick from 'hooks/useSingleOrDoubleClick';
import VaultAttachment from 'pages/my-vault/VaultAttachment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import 'react-h5-audio-player/lib/styles.css';
import {
  getUnlockMediaVault,
  resetSpecificVaultState,
  setSelectedVaultType,
  setVaultMedia,
} from 'store/reducer/vault';
import styled from 'styled-components';
import {
  getChangeUrlsOnly,
  getImageURL,
  getSortbyParam,
  isValidUrl,
} from 'util/index';

interface Props {
  className?: string;
  userId?: string;
  isScrollable?: boolean;
  navigator?: boolean;
  loadMore?: (e: any) => void;
  attachmentClass?: string;
  showOptions?: {
    timeStampText?: boolean;
    video?: boolean;
    play?: boolean;
    audio?: boolean;

    image?: boolean;
  };
}
const types = [
  { label: 'All', value: 'all' },
  { label: 'Photos', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
];
const limit = 10;
const showOptionss = {
  timeStampText: true,
  video: true,
  play: true,
  audio: true,
  image: true,
};

function MediaGallery({
  className,
  loadMore,
  userId,
  isScrollable = true,
  navigator = false,
  showOptions = {},
  attachmentClass,
}: Props) {
  const dispatch = useAppDispatch();
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeType, setActiveType] = useState('all');
  const vaultMedia = useAppSelector((state) => state.vault.media);
  const isLoading = useAppSelector((state) => state.vault.loading);
  const userIdREf = useRef('');
  const handlerSwiperOpen = (index: number) => {
    setActiveSlide(index);
    onOpenModel();
  };
  useEffect(() => {
    dispatch(resetSpecificVaultState());
    if (!!userId && userIdREf.current !== userId) {
      userIdREf.current = userId;
      dispatch(
        getUnlockMediaVault({
          sellerId: (userId as string) || '',
          type: activeType,
          params: { limit, order: 'desc', sort: getSortbyParam('createdAt') },
        }),
      )
        .unwrap()
        .then(() => {});
    }
  }, [userId]);
  const clickHandler = useSingleAndDoubleClick(handlerSwiperOpen);
  const images: any = useMemo(() => {
    const images: any = [];

    vaultMedia?.items?.forEach((element: any) => {
      const isAudio = attrAccept({ type: element?.type }, 'audio/*');
      if (
        element &&
        isValidUrl(element.path || element.url) &&
        attrAccept({ type: element?.type }, 'image/*')
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size = 34311243, ...el } = { ...element };
        const desktopSettings = {
          defaultUrl: el.path,
          onlyDesktop: true,
          imgix: {
            all: 'fit=clip&h=900',
          },
        };
        // const { url: durl, fallbackUrl: dfallback } = getImageURL({
        const { url: durl } = getImageURL({
          url: el.path || el.url || '',
          settings: desktopSettings,
        });

        const mobileSettings: any = {
          defaultUrl: el.path,

          imgix: {
            all: 'h=500&w=500',
          },
        };

        mobileSettings.onlysMobile = true;

        const { url, fallbackUrl } = getImageURL({
          url: el.path || el.url || '',
          settings: mobileSettings,
        });

        images.push({
          ...el,
          src: durl,
          fallback: fallbackUrl ? fallbackUrl : el.path ? el.path : el.url,
          path: url,
          thumb: url,
          id: element._id,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { size, ...rest } = element;
        const type = attrAccept({ type: element?.type }, 'video/*')
          ? 'video/mp4'
          : element?.type;
        let src = element.url || element.path;
        let fallback = element.url || element.path;
        if (isAudio) {
          const { url, fallbackUrl } = getChangeUrlsOnly(
            element.path || element.url,
          );
          src = url;
          fallback = fallbackUrl;
        }
        images.push({
          width: '650',
          height: '200',
          ...rest,
          poster: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          fallback: fallback,
          thumb: isAudio ? '/assets/images/mp3-icon.png' : element.thumbnail,
          thumbfallback: isAudio
            ? '/assets/images/mp3-icon.png'
            : defaultImagePlaceholder,
          src: src,
          type,
          id: element._id,
        });
      }
    });
    return images || [];
  }, [vaultMedia?.items?.length]);
  const hanldeClose = () => {
    onCloseModel();
  };
  const MediaWrapper = () => {
    return (
      <div className="gallery-holder">
        <div className="lg-react-element">
          {vaultMedia?.items?.map((item: any, index: number) => {
            return (
              <VaultAttachment
                className={attachmentClass}
                key={item._id}
                createdAt={item.createdAt}
                onClick={() => {
                  // onClick?.(item);
                  clickHandler(index);
                }}
                media={item}
                ImageSizesProps={{
                  onlyMobile: true,
                }}
                showOptions={{ ...showOptionss, ...showOptions }}
              />
            );
          })}
        </div>
        {isLoading && (
          <RequestLoader
            isLoading
            width="28px"
            height="28px"
            color="var(--pallete-text-secondary-50)"
          />
        )}

        {!vaultMedia?.items?.length && !isLoading && (
          <div className="py-30 px-10 empty-data text-center">
            This seller don't have any media.
          </div>
          // <div className="p-10">
          //   <Button disabled block shape="circle">
          //     This seller don't have any media.
          //   </Button>
          // </div>
        )}
        <GallaryViewModal
          isOpen={isOpenModel}
          items={images}
          onClose={hanldeClose}
          currentSlideIndex={activeSlide}
          navigator={navigator}
        />
      </div>
    );
  };
  return (
    <div className={`${className} ${!isDesktop ? 'sale-is-Mobile' : ''}`}>
      <div className="sort-type">
        <ul className="type-ctn">
          {types?.map((ele) => (
            <li
              key={ele.value}
              onClick={() => {
                dispatch(setSelectedVaultType(ele.value));
                setActiveType(ele.value);
                dispatch(
                  getUnlockMediaVault({
                    sellerId: (userId as string) || '',
                    type: ele.value,
                    params: { limit },
                  }),
                )
                  .unwrap()
                  .then((data) => {
                    dispatch(setVaultMedia(data));
                  });
              }}
              className={`${
                ele.value === activeType ? 'active-item' : ''
              } items`}
            >
              {ele.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="vault-gallery-scroll">
        {isScrollable ? (
          <Scrollbar
            className="gallery-scroll"
            style={{ overflow: 'hidden' }}
            onUpdate={(e) => loadMore?.(e)}
          >
            <MediaWrapper />
          </Scrollbar>
        ) : (
          <MediaWrapper />
        )}
      </div>
    </div>
  );
}
export default styled(MediaGallery)`
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  height: 100%;

  &.sale-is-Mobile {
    height: calc(100vh - 130px);
  }

  .media {
    padding: 0;
  }

  .audio_thumbnail {
    position: absolute;
  }

  .user-detail {
    padding: 0;
  }

  .vault-gallery-scroll {
    height: calc(100% - 95px);
  }

  .lg-react-element {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .gallery-item,
    .img-container {
      width: calc(33.333% - 16px);
      margin: 0 8px 16px;
      padding-top: calc(33.333% - 16px);
      border-radius: 6px;
      overflow: hidden;
      @media (max-width: 479px) {
        width: calc(50% - 16px);
        padding-top: calc(50% - 16px);
      }

      .image-comp {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  .timestamp {
    position: absolute;
    left: 10px;
    top: 10px;
    min-width: 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 5px;
    z-index: 2;
  }

  .video-length {
    position: absolute;
    left: 10px;
    bottom: 10px;
    min-width: 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
    border-radius: 4px;
    padding: 4px 5px;
    z-index: 2;

    svg {
      width: 18px;
      height: 16px;
    }
  }

  .checkbox {
    pointer-events: none;
    position: absolute;
    right: 9px;
    top: 9px;
    width: 26px;
    height: 26px;
    z-index: 2;

    label {
      padding: 0;
    }

    input[type='checkbox']:checked + .custom-input-holder .custom-input {
      background: var(--pallete-primary-main);
      border-color: var(--pallete-primary-main);
    }

    .custom-input {
      margin: 0;
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 100%;
      background: none;

      &:after {
        display: none;
      }

      &:before {
        color: #fff !important;
        font-size: 9px !important;
      }
    }
  }
  .gallery-scroll {
    @media (max-width: 767px) {
      min-height: 0;
      flex-grow: 1;
      flex-basis: 0;
    }
  }
  .sort-type {
    /* width: 50%; */
    padding: 8px;
    .type-ctn {
      margin: 0;
      padding-left: 0px;
      display: flex;
      .items {
        cursor: pointer;
        background: var(--pallete-background-secondary);
        font-weight: 500;
        border-radius: 20px;
        font-size: 14px;
        min-width: 48px;
        padding: 4px 16px;
        margin-right: 8px;
        text-align: center;
      }
      .active-item {
        background: rgba(229, 16, 117, 1);
        color: #fff;
      }
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
