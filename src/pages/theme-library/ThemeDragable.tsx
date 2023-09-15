import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import ThemeCard from 'pages/my-profile/components/Editor/ThemeCard';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { setCurrentTheme } from 'store/reducer/theme';

interface ISortableListProps {
  [key: string]: any;
  items: ITheme[];
  isOnboarding?: boolean;
  categories?: any[];
  current?: ITheme;
}

export const SortThemeList = (props: ISortableListProps): any => {
  const { items, categories, ...restProps } = props;
  const [listing, setListing] = useState<any>([]);
  useEffect(() => {
    let themeListing =
      categories?.map((cat) => {
        return {
          category: cat,
          items: items.filter((i: any) => i.categoryId?._id === cat._id),
        };
      }) || [];
    const unCat = items.filter((i: any) => !i.categoryId?._id);
    themeListing = themeListing.filter((value) => value.items.length > 0);
    if (unCat.length > 0) {
      themeListing = [...themeListing, { category: null, items: unCat }];
    }

    setListing(themeListing);
  }, [categories, items]);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { user } = useAuth();
  return listing.map(({ category, items }: any, index: number) => {
    const isActiveThemeexist =
      items?.length > 0 &&
      items?.find((theme: any) => theme.isActiveOnBoarding);
    return (
      ((category == null && isActiveThemeexist) ||
        (category && category.isActiveOnBoarding) ||
        (!restProps.isOnboarding && items.length > 0)) && (
        <span key={category?._id || index} className="category_section">
          {
            <span className="categoryTitle">
              {category?.name || 'Uncategorized'}
            </span>
          }
          {items
            .filter((item: any) => {
              if (item.isActiveOnBoarding || !restProps.isOnboarding) {
                return true;
              }
              return false;
            })
            .map((theme: ITheme, index: number) => {
              return (
                <div className="card-item-holder" key={theme?._id || index}>
                  <ThemeCard
                    rendering={theme.isRendering}
                    image={restProps.getThumbnail(theme).url}
                    fallbackUrl={restProps.getThumbnail(theme).fallbackUrl}
                    title={theme.name}
                    selected={theme._id === restProps.current?._id}
                    footerIcons={
                      !restProps.isOnboarding
                        ? {
                            edit: user?.enableSystemThemeAccess,
                            add: false,
                            apply: {
                              loading: restProps.isApplying === theme._id,
                              disabled: !!restProps.isApplying,
                            },
                            delete:
                              user?.enableSystemThemeAccess && !theme.isDefault,
                          }
                        : {}
                    }
                    onApplyClick={() => {
                      restProps.applySystemTheme(theme);
                    }}
                    onClick={async () => {
                      if (restProps.isOnboarding) {
                        restProps.onCardClick?.(theme);
                        return;
                      }

                      history.push(`/theme-library/preview?theme=${theme._id}`);
                    }}
                    onDeleteClick={() => restProps.handleDelete(theme)}
                    onEditClick={() => {
                      dispatch(setCurrentTheme(theme));
                      history.push(
                        `/my-profile/theme-editor?systemThemeCreate=true&themeId=${theme._id}`,
                      );
                    }}
                  />
                </div>
              );
            })}
        </span>
      )
    );
  });
};
