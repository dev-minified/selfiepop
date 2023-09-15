import {
  createTheme,
  createThemeCategory,
  deleteTheme,
  getThemeByCategory,
  getThemeCategories,
} from 'api/theme';
import {
  ArrowBack,
  ImageEdit,
  PlusFilled,
  SortIcon,
  Spinner,
} from 'assets/svgs';
import { AppAlert } from 'components/Model';
import Button from 'components/NButton';
import SimpleCard from 'components/SPCards/SimpleCard';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import { Time } from 'enums';
import { useScroll } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControlledState from 'hooks/useControlledState';
import useOpenClose from 'hooks/useOpenClose';
import ThemeCard from 'pages/my-profile/components/Editor/ThemeCard';
import React, {
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
  pushRendering,
  pushSystemThemes,
  restThemeState,
  setCurrentTheme,
  setSystemThemes,
  setCategories as setThemeCategories,
  // setThemesCount,
  setThemes,
  updateRendering,
} from 'store/reducer/theme';
import styled from 'styled-components';
import swal from 'sweetalert';
import { getChangeUrlsOnly } from 'util/index';
import { SortThemeList } from './ThemeDragable';
import CurdModel from './components/CurdModel';

const ThemeLibraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .theme-library-content__p {
    @media (max-width: 1199px) {
      width: 40%;
    }

    @media (max-width: 800px) {
      width: 34%;
    }

    @media (max-width: 767px) {
      width: 100%;
    }
  }

  .btns-actions {
    margin: 0;
    padding: 0 10px 0 0;

    @media (max-width: 767px) {
      width: 100%;
      justify-content: center;
    }

    .button {
      &.button-sm {
        @media (max-width: 767px) {
          min-width: inherit;
        }
      }

      + .button {
        @media (max-width: 767px) {
          margin-left: 8px;
        }
      }

      svg {
        @media (max-width: 370px) {
          display: block;
          margin: 0 auto 5px;
        }
      }
    }
  }
`;
const ThemesLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
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

const ThemeLibrary: React.FC<{
  className?: string;
  isOnboarding?: boolean;
  onCardClick?(theme: ITheme): void;
  refobj?: MutableRefObject<any>;
}> = forwardRef(
  ({ className, isOnboarding = false, onCardClick, refobj }, ref) => {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const categoryPointer = useRef(0);
    const renderingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('');
    const [themesLoading, setThemesLoading] = useState(false);
    const scroll = useScroll();

    const {
      systemThemes = [],
      allthemes = [],
      current,
      categories = [],
      totalThemesCount = { userThemeCount: 0, systemthemeCount: 0 },
    } = useAppSelector((state) => state.theme);
    const { user, setUser } = useAuth();

    const [defaultThemes] = useControlledState([], {
      value: systemThemes || [],
    });

    const [isApplying, setIsApplying] = useState<string>('');
    const [isSortingOpen, onSortingOpen, onSortingClose] = useOpenClose(false);
    const getSpThemes = () => {
      if (
        !themesLoading &&
        totalThemesCount.systemthemeCount > systemThemes.length
      ) {
        // eslint-disable-next-line
        // if (!isOnboarding) {
        //   setThemesLoading(() => true);
        //   startThemePolling({
        //     callBack: getThemesCb,
        //     systemThemePoll: true,
        //     query: {
        //       limit: 15,
        //       skip: systemThemes.length,
        //     },
        //   })
        //     .catch(() => {})
        //     .finally(() => {
        //       // eslint-disable-next-line
        //       setThemesLoading((_) => false);
        //     });
        // }
        // else {
        //   getThemes(getThemesCb, {
        //     limit: 15,
        //     skip: systemThemes.length,
        //   })
        //     .catch(() => {})
        //     .finally(() => {
        //       // eslint-disable-next-line
        //       setThemesLoading((_) => false);
        //     });
        // }
      }

      // if (isOnboarding && categoryPointer.current < categories.length) {
      if (!themesLoading) {
        setThemesLoading(() => true);
        getNextThemes(categories).then(() => {
          setThemesLoading(() => false);
        });
      }
    };
    useImperativeHandle(ref || refobj, () => ({
      handleScroll: () => {
        getSpThemes();
      },
    }));

    const pollRendering = () => {
      let intervalCount = 0;
      const interval = setInterval(() => {
        dispatch(updateRendering())
          .unwrap()
          .then(() => {
            intervalCount++;
            if (intervalCount > 12) {
              clearInterval(interval);
            }
          })
          .catch(() => {});
      }, 10 * Time.SECONDS);
      renderingIntervalRef.current = interval;
    };

    // useEffect(() => {
    //   pollRendering();
    // }, []);

    useEffect(() => {
      scroll.scrollYProgress.on('change', (progress) => {
        console.log({ progress });
        if (progress >= 0.99) {
          getSpThemes();
        }
      });

      return () => scroll.scrollYProgress.destroy();
    }, [
      themesLoading,
      totalThemesCount,
      allthemes?.length,
      systemThemes?.length,
      isOnboarding,
      categories,
    ]);
    useEffect(() => {
      // if (!isOnboarding) {
      //   setThemesLoading(true);
      //   startThemePolling({
      //     callBack: getThemesCb,
      //     systemThemePoll: true,
      //     query: {
      //       limit: 15,
      //       skip: 0,
      //     },
      //   }).catch(() => {
      //     setThemesLoading(false);
      //   });
      // }
      // else {
      //   getThemes(getThemesCb, {
      //     limit: 15,
      //     skip: 0,
      //   }).catch(() => {
      //     setThemesLoading(false);
      //   });
      // }

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 0);

      dispatch(restThemeState());

      return () => {
        // stopThemePolling();
        dispatch(restThemeState());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      async function categeries() {
        try {
          const response = await getThemeCategories();
          if (response.success) {
            const { items } = response;
            const order = isOnboarding ? 'onBoardSortOrder' : 'sortOrder';
            const categories = items.sort(
              (a: any, b: any) => a[order] - b[order],
            );
            dispatch(setThemeCategories(categories));
            setThemesLoading(true);
            getNextThemes(categories).then(() => setThemesLoading(false));
          }
        } catch (error) {}
      }
      categeries();
      return () => {
        if (!isOnboarding) {
          dispatch(setCurrentTheme(undefined));
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNextThemes = async (categories: any[]) => {
      if (categoryPointer.current >= categories.length) {
        return;
      }
      const categoryIds = categories
        .slice(categoryPointer.current, categoryPointer.current + 2)
        .map((cat: any) => cat._id);

      const themes: ITheme[] = await Promise.all(
        categoryIds.map((id) =>
          getThemeByCategory(id, {
            system: true,
            ...(isOnboarding
              ? {
                  published: true,
                  onboarding: true,
                }
              : {}),
          }),
        ),
      ).then((res) =>
        res.reduce(
          (acc, themeRes: any) => [...acc, ...(themeRes.data || [])],
          [],
        ),
      );

      categoryPointer.current = categoryPointer.current + 2;

      dispatch(pushSystemThemes(themes));

      if (themes.length > 0) {
        dispatch(
          pushRendering(
            themes
              .filter((theme) => theme.isRendering)
              .map((theme) => `${theme._id}`),
          ),
        );
        if (renderingIntervalRef.current) {
          clearInterval(renderingIntervalRef.current);
        }

        pollRendering();
      }

      if (themes.length < 10 && categoryPointer.current < categories.length) {
        await getNextThemes(categories);
        return;
      } else if (categoryPointer.current >= categories.length) {
        const themeRes = await getThemeByCategory('null', {
          system: true,
          ...(isOnboarding
            ? {
                published: true,
                onboarding: true,
              }
            : {}),
        });

        dispatch(pushSystemThemes(themeRes.data || []));
      }
    };

    // const getThemesCb = (props: ThemeProps) => {
    //   setThemesLoading(false);
    //   dispatch(setThemesCount(props.totalThemesCount));
    //   dispatch(setSystemThemes([...systemThemes, ...props.systemThemes]));
    // };

    const applySystemTheme = async (theme: ITheme) => {
      setIsApplying(`${theme._id}`);
      await createTheme({
        ...theme,
        isSystemTheme: false,
        isPublished: false,
        isDefault: false,
        isActive: true,
        baseURL: `${window.location.host}/${user.username}`,
        categoryId: (theme.categoryId as any)?._id,
      })
        .then((res) => {
          dispatch(setThemes([...allthemes, res?.theme]));
          setUser({ ...user, userThemeId: res.theme });
          swal(`${theme?.name}`, `Applied Successfully`, 'success').then(() =>
            history.push('/my-profile'),
          );
        })
        .catch((e) => {
          swal('Error', `Could not apply ${theme.name}`, 'error');
          console.log(e);
        });

      setIsApplying('');
    };

    const handleDelete = async (theme: ITheme) => {
      AppAlert({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        buttons: ['', { text: 'Delete', closeModal: false }],
        onConfirm: async () => {
          if (!theme?._id) return;
          await deleteTheme(theme._id).then(() => {
            if (theme.isSystemTheme) {
              const newThemes = systemThemes.filter((t) => t._id !== theme._id);
              dispatch(setSystemThemes(newThemes));
            }
            // swal?.close("sdfsdf");
          });
        },
      });
    };
    const saveCategory = async () => {
      try {
        setIsOpen(false);
        setCategory('');
        await createThemeCategory(category);
      } catch (error) {}
    };

    return (
      <div className={className}>
        {!isOnboarding && (
          <div className="theme-library-header">
            <Link
              to="/my-profile/themes-listing"
              className="btn-back"
              type="text"
            >
              <span className="img">
                <ArrowBack />
              </span>
              Back
            </Link>
            <h5>Theme Library</h5>
          </div>
        )}
        <div className="theme-library-content">
          <ThemeLibraryHeader>
            {!isOnboarding && (
              <p className="theme-library-content__p">
                Click the theme thumbnail to preview. Apply the theme by
                clicking the <span className="btn-text">Apply</span> button.
              </p>
            )}
            {user.enableSystemThemeAccess === true && !isOnboarding && (
              <div className="btns-actions">
                <Button
                  type="primary"
                  className="mb-10"
                  size="small"
                  onClick={onSortingOpen}
                  icon={<SortIcon />}
                >
                  Categories
                </Button>
                <Button
                  type="primary"
                  className="mb-10"
                  size="small"
                  icon={<PlusFilled />}
                  id="add-new-pop"
                  onClick={() => setIsOpen(true)}
                >
                  Add Category
                </Button>
              </div>
            )}
          </ThemeLibraryHeader>
          <SimpleCard showHeader={false} classes={{ card: '' }}>
            <div className="themes-listing-cards row">
              {user?.enableSystemThemeAccess && !isOnboarding && (
                <div className="themes-listing-card col-holder">
                  <ThemeCard
                    create
                    cardText="Create Your Own Theme!"
                    cardIcon={<ImageEdit />}
                    title="Custom Theme"
                    footerIcons={{ edit: false, add: false, delete: false }}
                    onClick={() => {
                      history.push(
                        '/my-profile/theme-editor?systemThemeCreate=true',
                      );
                    }}
                  />
                </div>
              )}
              {!!defaultThemes?.length ? (
                <>
                  {isOnboarding ? (
                    <SortThemeList
                      categories={[...categories].sort(
                        (a: any, b: any) =>
                          a.onBoardSortOrder - b.onBoardSortOrder,
                      )}
                      items={[...defaultThemes].sort(
                        (a: any, b: any) =>
                          a.onBoardSortOrder - b.onBoardSortOrder,
                      )}
                      onCardClick={onCardClick}
                      handleDelete={handleDelete}
                      applySystemTheme={applySystemTheme}
                      current={current}
                      getThumbnail={getThumbnail}
                      isApplying={isApplying}
                      isOnboarding={isOnboarding}
                    />
                  ) : (
                    <SortThemeList
                      categories={[...categories].sort(
                        (a: any, b: any) => a.sortOrder - b.sortOrder,
                      )}
                      items={[...defaultThemes].sort(
                        (a: any, b: any) => a.sortOrder - b.sortOrder,
                      )}
                      onCardClick={onCardClick}
                      handleDelete={handleDelete}
                      applySystemTheme={applySystemTheme}
                      current={current}
                      getThumbnail={getThumbnail}
                      isApplying={isApplying}
                      isOnboarding={isOnboarding}
                    />
                  )}
                </>
              ) : null}
            </div>
            {themesLoading ? (
              <ThemesLoading>
                <Spinner
                  width="28px"
                  height="28px"
                  color="var(--pallete-text-secondary-50)"
                />
              </ThemesLoading>
            ) : null}
          </SimpleCard>
        </div>
        <Model
          isOpen={isOpen}
          onClose={() => {
            setCategory('');
            setIsOpen(false);
          }}
          onOk={saveCategory}
        >
          <FocusInput
            materialDesign
            label="Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Model>
        <CurdModel
          isOpen={isSortingOpen}
          onClose={onSortingClose}
          categories={categories}
          themes={defaultThemes}
        />
      </div>
    );
  },
);

export default styled(ThemeLibrary)`
  .categoryTitle {
    width: 100%;
    display: block;
    font-size: 18px;
    line-height: 22px;
    font-weight: 500;
    margin: 0 0 30px;
    padding: 0 10px;

    @media (max-width: 767px) {
      margin: 0 0 15px;
      padding: 0 5px;
    }
  }
  .card-item-holder {
    width: 14.28%;
    padding: 0 10px;
    margin: 0 0 20px;

    @media (max-width: 2999px) {
      width: 16.66%;
    }

    @media (max-width: 1499px) {
      width: 20%;
    }

    @media (max-width: 1199px) {
      width: 25%;
    }

    @media (max-width: 1023px) {
      width: 33.333%;
    }

    @media (max-width: 767px) {
      width: 50%;
      padding: 0 5px;
      margin: 0 0 10px;
    }

    @media (max-width: 370px) {
      width: 100%;
    }

    .card-rendering {
      > img {
        opacity: 0;
        visibility: hidden;
        width: 100%;
        height: auto;
      }

      .card-rendering-text {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .theme-card {
      height: auto;
      min-height: inherit;
      border-color: var(--pallete-colors-border);

      &:hover {
        border-color: var(--colors-indigo-200);
      }

      &:before {
        display: none;
      }

      .theme-card-image {
        max-height: inherit;
        border: none;
        border-radius: 0;
      }
    }
  }
  .theme-library-header {
    background: var(--pallete-background-gray);
    padding: 15px 80px;
    position: relative;

    h5 {
      text-align: center;
      margin: 0;
      font-size: 18px;
      line-height: 20px;
      font-weight: 500;
    }

    .btn-back {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translate(0, -50%);
      color: var(--pallete-primary-darker);

      .img {
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: top;
        margin: 2px 6px 0 0;
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .card {
    background: none;
    border: none;
  }

  ${(props) => {
    if (!props.isOnboarding) {
      return `
        .theme-card {
          height: 371px;

          @media (max-width: 767px) {
            height: 257px;
          }

          .theme-card-image {
            max-height: inherit;
            border: 1px solid #e9e9eb;
            border-radius: 6px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-position: top;
            }
          }
        }
      `;
    }
    return `
    .themes-listing-card {
      padding: 0 10px;
      margin: 0 0 20px;

      @media (max-width: 1023px) {
        width: 249px;
        padding: 0 10px;
        margin: 0 0 20px;
        flex: inherit;
        max-width: inherit;
      }

      @media (max-width: 767px) {
        width: 174px;
        padding: 0 5px;
      }
      .theme-card {
        min-height: inherit;
        height: 267px;

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
  }}
  .category_section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .themes-listing-cards {
    margin: 0 -10px;

    @media (max-width: 767px) {
      margin: 0 -5px;
    }
  }

  .theme-library-content {
    ${({ isOnboarding }) => {
      if (isOnboarding) {
        return `
          background: var(--pallete-background-default);
        `;
      }
      return `
        padding: 30px 35px;
        background: var(--pallete-background-gray);

        @media (max-width: 1199px) {
          padding: 20px;
        }

        @media (max-width: 767px) {
          padding: 15px 10px;
        }

        @media (max-width: 480px) {
          // padding: 15px 0;
        }
      `;
    }}

    &__p {
      margin: 0 0 24px;
      color: var(--pallete-text-main-400);
      font-size: 15px;
      line-height: 18px;

      @media (max-width: 1199px) {
        margin: 0 0 20px;
      }

      .btn-text {
        min-width: 60px;
        border: 1px solid var(--pallete-colors-border);
        display: inline-block;
        vertical-align: middle;
        background: var(--pallete-background-default);
        text-align: center;
        padding: 2px 5px;
      }
    }
  }

  .col-holder {
    width: 249px;
    padding: 0 10px;
    margin: 0 0 20px;

    @media (max-width: 767px) {
      width: 174px;
      padding: 0 5px;
    }
  }

  .theme-editor-actions {
    max-width: 570px;
    margin: 0 auto;
  }
`;
