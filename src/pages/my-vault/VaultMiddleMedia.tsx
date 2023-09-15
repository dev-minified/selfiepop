import { AvatarName } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import ComponentsHeader from 'components/ComponentsHeader';
import MediaGallery from 'components/VaultMediaGallery';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import { isDesktop, isMobileOnly } from 'react-device-detect';
import 'react-h5-audio-player/lib/styles.css';
import { Link, useHistory } from 'react-router-dom';
import { getUnlockMediaVault } from 'store/reducer/vault';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';
interface Props {
  className?: string;
  TopHeader?: boolean;
}
const VaultLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  .header-link-area__link {
    padding-right: 5px;
  }
`;
function VaultMiddle({ className, TopHeader = true }: Props) {
  const { showLeftView } = useControllTwopanelLayoutView();
  const dispatch = useAppDispatch();
  const { userId } = parseQuery(location.search);
  const history = useHistory();
  const vaultMedia = useAppSelector((state) => state.vault.media);
  const isFetchingMedia = useAppSelector((state) => state.vault.loading);
  const type = useAppSelector((state) => state.vault.activeType);
  const vaultUser = useAppSelector((state) => state.vault.selectedUser);

  const LoadMore = async (e: any) => {
    if (vaultMedia?.items?.length < vaultMedia?.totalCount) {
      const { scrollTop, scrollHeight, clientHeight } = e as any;
      const pad = 100; // 100px of the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isFetchingMedia) {
        await dispatch(
          getUnlockMediaVault({
            sellerId: (userId as string) || '',
            type,
            params: {
              limit: 9,
              skip: vaultMedia?.items?.length || 0,
              order: 'desc',
              sort: getSortbyParam('createdAt'),
            },
          }),
        );
      }
    }
  };
  const link =
    `${window.location.host}/${vaultUser?.sellerId?.username}`.replace(
      'www.',
      '',
    );
  return (
    <div className={`${className} ${!isDesktop ? 'sale-is-Mobile' : ''}`}>
      {TopHeader && (
        <ComponentsHeader
          title={`${vaultMedia?.items?.length || 0} Items`}
          backUrl={!isDesktop ? '/vault' : ''}
          altArrow={!isDesktop ? true : false}
          icon={
            isMobileOnly ? (
              <VaultLinkWrapper>
                <Link
                  to={`/profile/${vaultUser?.sellerId?.username}`}
                  className="header-link-area__link"
                  target="_blank"
                >
                  {vaultUser?.sellerId?.pageTitle || 'Incognito User'}
                </Link>
                <AvatarStatus
                  fallbackComponent={
                    <AvatarName
                      fontSize={15}
                      width={50}
                      height={50}
                      text={vaultUser?.sellerId?.pageTitle || 'Incognito User'}
                    />
                  }
                  src={vaultUser?.sellerId?.profileImage}
                />
              </VaultLinkWrapper>
            ) : null
          }
          onClick={() => {
            showLeftView();
            history.push(`/vault`);
          }}
        />
      )}

      <MediaGallery
        userId={(userId as string) || ''}
        loadMore={LoadMore}
        navigator
      />
    </div>
  );
}
export default styled(VaultMiddle)`
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
    height: calc(100% - 123px);
  }

  .gallery-holder {
    padding: 0 30px;

    @media (max-width: 1023px) {
      padding: 0 18px;
    }

    @media (max-width: 767px) {
      padding: 0;
    }
  }

  .lg-react-element {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* padding: 16px 0; */

    .gallery-item,
    .img-container {
      width: calc(33.333% - 16px);
      margin: 0 8px 16px;
      padding-top: calc(33.333% - 16px);
      border-radius: 6px;
      overflow: hidden;

      /* @media (max-width: 767px) {
        width: calc(33.333% - 2px);
        padding-top: calc(33.333% - 2px);
      } */

      @media (max-width: 1420px) {
        width: calc(50% - 16px);
        padding-top: calc(50% - 16px);
      }

      @media (max-width: 1199px) {
        width: calc(33.333% - 16px);
        padding-top: calc(33.333% - 16px);
      }

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

  .video-length,
  .image-length,
  .audio-length {
    position: absolute;
    right: 10px;
    top: 10px;
    left: auto;
    bottom: auto;
    min-width: inherit;
    text-align: center;
    background: none;
    font-size: 13px;
    line-height: 15px;
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
    border-radius: 4px;
    padding: 0;
    z-index: 2;

    svg {
      width: 18px;
      height: 16px;
      filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.45));

      path {
        fill: currentColor;
        fill-opacity: 1;
      }
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
    padding: 20px 36px;

    @media (max-width: 1023px) {
      padding: 20px 18px;
    }

    @media (max-width: 767px) {
      padding: 8px;
    }

    .type-ctn {
      margin: 0;
      padding-left: 0px;
      display: flex;

      .items {
        cursor: pointer;
        background: var(--pallete-background-gray-secondary-400);
        font-weight: 500;
        border-radius: 20px;
        font-size: 14px;
        min-width: 48px;
        padding: 6px 16px;
        margin-right: 8px;
        text-align: center;
      }
      .active-item {
        background: rgba(229, 16, 117, 1);
        color: #fff;
      }
    }
  }
  /* .select-box {
    width: 130px;
    margin: 0 15px 0 0;
  }

  .react-select__value-container {
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
  }
  .react-select__control {
    border-radius: 40px;
    border-color: #d9e2ea;
    min-height: 28px;
    .react-select__indicator-separator {
      display: none;
    }
    .react-select__indicators {
      width: 28px;
      height: 28px;
    }
    .rc-badget-dot {
      display: none;
    }
  }
  .react-select__menu {
    overflow: hidden;
    border: 1px solid var(--pallete-colors-border);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    .react-select__menu-list {
      padding: 5px;
    }
    .react-select__option {
      background: none;
      color: #8d778d;
      padding: 6px 10px;
      min-width: inherit;
      margin: 0;
      text-align: left;
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      &:hover:not(.react-select__option--is-selected),
      &.react-select__option--is-focused:not(
          .react-select__option--is-selected
        ) {
        color: var(--pallete-text-secondary-100);
        background: rgba(230, 236, 245, 0.62);
      }
      &.react-select__option--is-selected {
        color: var(--pallete-text-secondary-100);
        background: none;
      }
    }
  }
  .sort_order {
    width: 30px;
    height: 30px;
    border: 1px solid var(--pallete-colors-border);
    background: var(--pallete-background-default);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover,
    &.active {
      background: var(--colors-indigo-200);
      color: #fff;
      border-color: var(--colors-indigo-200);
      path {
        fill: #fff;
      }
    }
    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      .sort-area {
        pointer-events: none;
      }
      &:hover,
      &.active {
        opacity: 0.6;
        background: none;
        color: var(--pallete-text-main);
        border-color: #d9e2ea;
        path {
          fill: #000;
        }
      }
    }
  }
  .slide-header {
    border-right: none;
  } */
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
