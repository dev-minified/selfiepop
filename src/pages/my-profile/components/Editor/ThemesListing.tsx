import { deleteTheme, getTheme } from 'api/theme';
import { BrowseStack, Chromatic, InfoIcon, Star } from 'assets/svgs';
import classNames from 'classnames';
import { AppAlert } from 'components/Model';
import SimpleCard from 'components/SPCards/SimpleCard';
import { RequestLoader } from 'components/SiteLoader';
import ToolTip from 'components/tooltip';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useControlledState from 'hooks/useControlledState';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { setThemes as reduxSetTheme } from 'store/reducer/theme';
import styled from 'styled-components';
import { arrayFind, getChangeUrlsOnly } from 'util/index';
import ThemeCard from './ThemeCard';

const ThemesLoading = styled(RequestLoader)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
interface Props {
  selectedTheme?: ITheme;
  setSelectedTheme?(theme: ITheme | undefined): void;
  setIsApplyModalOpen?(isOpen: boolean): void;
  className?: string;
  isThemesLoading?: boolean;
  isThemesPolling?: boolean;
}

const getThumbnail = (theme?: ITheme) => {
  if (theme?.previewThumbnailPath) {
    const { url, fallbackUrl } = getChangeUrlsOnly(theme.previewThumbnailPath, {
      checkspexist: true,
    });
    return { url, fallbackUrl };
    // return theme.previewThumbnailPath;
  }

  return {
    url: '/assets/images/theme-preview-default.png',
    fallbackUrl: '/assets/images/theme-preview-default.png',
  };
};

const ThemesListing = ({
  className,
  setIsApplyModalOpen,
  selectedTheme,
  setSelectedTheme = () => {},
  isThemesLoading = false,
  isThemesPolling = false,
}: Props) => {
  const userThemes = useAppSelector((state) => state.theme.allthemes);
  const userId = useAuth()?.user?.userThemeId?._id;
  const { showRightView } = useControllTwopanelLayoutView();
  const [themes, setThemes] = useControlledState([], {
    defaultValue: userThemes,
  });
  const [userActiveTheme, setUserActiveTheme] = useState(
    arrayFind(userThemes, { isActive: true }),
  );
  // const userActiveTheme = arrayFind(userThemes, { isActive: true });

  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    setThemes(userThemes?.filter((theme) => !theme.isActive) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userThemes]);

  useEffect(() => {
    if (userId) {
      getTheme(userId)
        .then((data) => {
          setSelectedTheme(data?.theme);
          setUserActiveTheme(data?.theme);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userActiveTheme?._id, userId]);

  const handleDelete = async (theme: ITheme) => {
    AppAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this!',
      buttons: ['', { text: 'Delete', closeModal: false }],
      onConfirm: async () => {
        if (!theme?._id) return;
        await deleteTheme(theme._id).then(() => {
          const newThemes = userThemes.filter((t) => t._id !== theme._id);
          dispatch(reduxSetTheme(newThemes));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore-block
          swal?.close();
        });
      },
    });
  };

  const clickHandleSelectorTheme = (theme: ITheme) => {
    setSelectedTheme(theme);
    showRightView();

    if (theme._id !== userActiveTheme?._id) {
      setIsApplyModalOpen?.(true);
      return;
    }
    setIsApplyModalOpen?.(false);
  };

  return (
    <div className={classNames(className)}>
      <div className="listing-top">
        <div className={'head-btn'}>
          <h5 className="listing-title">
            <Chromatic />
            <span className="text"> Manage Your Themes</span>
          </h5>
          <ToolTip
            overlay={
              <span>
                Choose a theme from your collection, design your own theme using{' '}
                <br /> our advanced theme creator or pick a theme from one of
                the many <br /> premade themes in the theme library.
              </span>
            }
            placement="topRight"
          >
            <span className="link-info">
              <InfoIcon />
            </span>
          </ToolTip>
        </div>
        <p>
          Choose from one of the themes in your theme collection, browse the
          theme library or make your own new theme from scratch!
        </p>
        <div className="themes-listing-cards row">
          <div className="themes-listing-card col-4 mb-0">
            <ThemeCard
              rendering={userActiveTheme?.isRendering}
              image={getThumbnail(userActiveTheme).url}
              fallbackUrl={getThumbnail(userActiveTheme).fallbackUrl}
              title="Current Theme"
              footerIcons={{
                edit: 'Edit',
                add: false,
                delete: false,
              }}
              onClick={async () => {
                setSelectedTheme(userActiveTheme);
                setIsApplyModalOpen?.(false);
              }}
              onEditClick={() => {
                if (userActiveTheme?._id) {
                  setSelectedTheme(userActiveTheme);
                  setIsApplyModalOpen?.(false);
                  history.push(
                    `/my-profile/theme-editor?themeId=${userActiveTheme?._id}`,
                  );
                }
              }}
            />
          </div>
          <div className="themes-listing-card col-4 mb-0">
            <ThemeCard
              create
              cardText="Create Your Own Theme!"
              cardIcon={<Star />}
              title="Custom Theme"
              footerIcons={{ edit: false, add: false, delete: false }}
              onClick={() => {
                setSelectedTheme(undefined);
                setIsApplyModalOpen?.(false);
                history.push('/my-profile/theme-editor');
              }}
            />
          </div>
          <div className="themes-listing-card col-4 mb-0">
            <ThemeCard
              create
              cardText="Themes"
              cardIcon={<BrowseStack />}
              title="Theme Library"
              footerIcons={{ edit: false, add: false, delete: false }}
              onClick={() => {
                setSelectedTheme(undefined);
                setIsApplyModalOpen?.(false);
                history.push('/theme-library');
              }}
            />
          </div>
        </div>
      </div>
      <hr className="two--panel__divider" />

      <div className="themes-listing-container">
        <h4 className="themes-listing-title mb-15">Your Theme Collection</h4>
        {!!themes?.length ? (
          <SimpleCard
            showHeader={false}
            classes={{ card: 'px-20 pt-20 mb-40' }}
          >
            <div className="themes-listing-cards row">
              {themes?.map((theme, index) => (
                <div
                  key={`${theme.name}-${index}`}
                  className="themes-listing-card col-sm-4"
                >
                  <ThemeCard
                    rendering={theme.isRendering}
                    image={getThumbnail(theme).url}
                    fallbackUrl={getThumbnail(theme).fallbackUrl}
                    title={theme.name}
                    footerIcons={{
                      edit: true,
                      add: false,
                      delete: true,
                    }}
                    selected={theme._id === selectedTheme?._id}
                    onClick={() => clickHandleSelectorTheme(theme)}
                    onEditClick={() => {
                      setSelectedTheme(theme);
                      setIsApplyModalOpen?.(false);
                      history.push(
                        `/my-profile/theme-editor?themeId=${theme._id}`,
                      );
                    }}
                    onDeleteClick={() => handleDelete(theme)}
                  />
                </div>
              ))}
            </div>
          </SimpleCard>
        ) : null}
        {isThemesLoading || isThemesPolling ? (
          <ThemesLoading
            isLoading
            width="28px"
            height="28px"
            color="var(--pallete-text-secondary-50)"
          />
        ) : null}
      </div>
    </div>
  );
};

export default styled(ThemesListing)`
  .listing-top {
    padding-bottom: 14px;

    h5 {
      font-weight: 400;
      margin: 0;

      .text {
        display: inline-block;
        vertical-align: middle;
      }
    }

    p {
      font-size: 15px;
    }

    .theme-card.create {
      background-color: var(--pallete-background-default);
    }

    .listing-title svg {
      width: 28px;
      height: 28px;
      display: inline-block;
      vertical-align: top;
      margin: -4px 16px 0 4px;
    }

    .action {
      justify-content: space-between;
      display: flex;

      .button {
        width: calc(50% - 7px);

        + .button {
          margin: 0;
        }
      }
    }
  }
  .head-btn {
    display: flex;
    align-items: center;
    margin: 0 0 8px;
    justify-content: space-between;
    a {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }
    .link-info {
      width: 32px;
      height: 32px;
      border: 1px solid var(--pallete-primary-main);
      border-radius: 5px;
      min-width: 32px;
      margin: 0 0 0 20px;
      background: var(--pallete-background-default);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;

      .sp_dark & {
        border: none;
        background: var(--pallete-background-primary-light);
      }

      &:hover {
        border-color: var(--colors-indigo-200);
        background: var(--colors-indigo-200);

        svg {
          path {
            fill: #fff;
          }
        }
      }
      svg {
        width: 20px;
        height: auto;
        display: block;

        path {
          fill: var(--pallete-primary-main);
          fill-opacity: 1;
          transition: all 0.4s ease;

          .sp_dark & {
            fill: #fff;
          }
        }
      }
    }
  }
  .themes-listing-container {
    margin: 0 -16px;
    padding: 20px 16px;
    background: var(--pallete-background-default);

    .themes-listing-content {
      font-size: 15px;
      line-height: 20px;
      color: var(--pallete-text-main-400);
    }
  }

  .themes-listing-cards {
    margin: 0 -8px;

    @media (max-width: 1023px) {
      justify-content: center;
    }

    .card-rendering {
      > img {
        display: none;
      }
    }
  }

  .themes-listing-card .theme-card.create {
    padding: 13px;
    min-height: 353px;
  }

  .themes-listing-card .theme-card.create h6 {
    font-size: 22px;
    line-height: 26px;
  }

  .themes-listing-card .theme-card {
    min-height: 371px;
    border-color: var(--pallete-background-light);

    &:hover {
      border-color: var(--colors-indigo-200);
    }
  }

  .two--panel__divider {
    margin: 0 -16px;
    height: 1px;
  }

  .card {
    background: none;
    border: none;
    padding: 0 !important;
  }

  .themes-listing-card:not(.col-4) {
    @media (max-width: 1023px) {
      width: 249px;
      padding: 0 10px;
      margin: 0 0 20px;
      flex: inherit;
      max-width: inherit;
    }

    @media (max-width: 767px) {
      width: 176px;
      padding: 0 5px;
    }
  }

  .themes-listing-card.col-4 {
    .theme-card,
    .theme-card.create {
      @media (max-width: 767px) {
        height: 190px;
      }

      h6 {
        @media (max-width: 767px) {
          font-size: 12px;
        }
      }
    }

    .theme-card-footer .title {
      @media (max-width: 767px) {
        font-size: 12px;
      }
    }

    .theme-card-footer button {
      @media (max-width: 767px) {
        width: 22px;
        height: 22px;
      }
    }

    .theme-card-text {
      @media (max-width: 767px) {
        padding: 10px 0 0;
      }
    }
  }

  .themes-listing-card {
    padding: 0 8px;
    margin: 0 0 20px;

    @media (max-width: 767px) {
      padding: 0 5px;
    }

    .theme-card {
      min-height: inherit;
      height: 273px;

      @media (max-width: 1023px) {
        height: 371px;
      }

      @media (max-width: 767px) {
        height: 257px;
      }

      &.create {
        height: 273px;
        min-height: inherit;

        @media (max-width: 1023px) {
          height: 376px;
        }

        @media (max-width: 767px) {
          height: 262px;
        }

        .theme-card-inner {
          &:before {
            display: none;
          }
        }

        h6 {
          font-size: 16px;
          line-height: 20px;
          color: var(--colors-indigo-200);
        }
      }

      .theme-card-image {
        max-height: inherit;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
`;
