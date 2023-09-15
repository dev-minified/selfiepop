import {
  updateCategorySorting,
  updateTheme,
  updateThemeCategory,
  updateThemeSorting,
} from 'api/theme';
import NewButton from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useState } from 'react';
import { setCategories, setSystemThemes } from 'store/reducer/theme';
import styled from 'styled-components';
import { arrayMove } from 'util/index';
import { SortableComponent } from '../CategoriesDragable';

function CurdModel({
  isOpen,
  onClose,
  categories,
  themes,
  className,
}: any): ReactElement {
  const [tab, setTab] = useState<'profile' | 'onBoard'>('profile');
  const [selectedCat, setSelectedCat] = useState<any>(undefined);
  const [isOpenCat, onOpenCat, onCloseCat] = useOpenClose();
  const dispatch = useAppDispatch();

  const onSortEndCat = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex === newIndex) return;
    const oldCategories = categories;
    const sortedArray = arrayMove<any>(oldCategories, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        [tab === 'onBoard' ? 'onBoardSortOrder' : 'sortOrder']: index,
      }),
    );

    const requestData: string[] = sortedArray.map(({ _id }: any) => _id);
    dispatch(setCategories(sortedArray));
    await updateCategorySorting({ type: tab, ids: requestData }).catch(() => {
      dispatch(setCategories(oldCategories));
    });
  };
  const onSortEndTheme = async ({
    oldIndex,
    newIndex,
    array: oldArray,
  }: {
    oldIndex: number;
    newIndex: number;
    array: any[];
  }) => {
    console.log({ end: 'onSortEndTheme' });
    if (oldIndex === newIndex) return;

    const sortedArray = arrayMove<any>(oldArray, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        [tab === 'onBoard' ? 'onBoardSortOrder' : 'sortOrder']: index,
      }),
    );

    const oldthemes = [...themes];

    const newThemes = themes.map((item: any) => {
      const findtheme = sortedArray.find((t: any) => t._id === item._id);
      if (findtheme?._id) {
        return findtheme;
      }
      return item;
    });

    const requestData: string[] = sortedArray.map(({ _id }: any) => _id);

    dispatch(setSystemThemes(newThemes));

    await updateThemeSorting({ type: tab, ids: requestData }).catch(() => {
      dispatch(setSystemThemes(oldthemes));
    });
  };

  const onCategoryToggelHanlder = async (cate: any) => {
    const updateCate = {
      ...cate,
      isActiveOnBoarding: !cate.isActiveOnBoarding,
    };
    const oldCategories = [...categories];
    const newCategories = [...categories].map((item) => {
      if (updateCate._id === item._id) return updateCate;
      return item;
    });

    dispatch(setCategories(newCategories));
    await updateThemeCategory({ id: cate._id, ...updateCate }).catch(() => {
      dispatch(setCategories(oldCategories));
    });
  };
  const onThemeToggelHandler = async (theme: any) => {
    const updatedTheme = {
      ...theme,
      isActiveOnBoarding: !theme.isActiveOnBoarding,
    };
    const oldThemes = [...themes];
    const newThemes = oldThemes.map((item: any) => {
      if (updatedTheme._id === item._id)
        return { ...item, isActiveOnBoarding: !item.isActiveOnBoarding };
      return item;
    });

    dispatch(setSystemThemes(newThemes));
    await updateTheme(updatedTheme._id, updatedTheme).catch(() => {
      dispatch(setSystemThemes(oldThemes));
    });
  };

  const handleCategorySave = async () => {
    const updateCate = selectedCat;

    const oldCategories = [...categories];
    const newCategories = [...categories].map((item) => {
      if (updateCate._id === item._id) return updateCate;
      return item;
    });

    dispatch(setCategories(newCategories));
    await updateThemeCategory({ id: updateCate._id, ...updateCate }).catch(
      () => {
        dispatch(setCategories(oldCategories));
      },
    );
    onCloseCat();
  };

  const onCategoryEdit = (cat: any) => {
    setSelectedCat(cat);
    onOpenCat();
  };
  const newCategories = [...categories];
  const newThemes = [...themes];
  return (
    <div className={className}>
      <Model
        isOpen={isOpen}
        onClose={onClose}
        showFooter={false}
        className={`${className} theme_listing_sorting_modal`}
      >
        <div className="theme-editor-actions">
          <div className="action">
            <NewButton
              type={tab === 'profile' ? 'primary' : undefined}
              block
              onClick={() => {
                setTab('profile');
              }}
            >
              My Profile
            </NewButton>

            <NewButton
              type={tab === 'onBoard' ? 'primary' : undefined}
              block
              onClick={() => {
                setTab('onBoard');
              }}
            >
              Onboarding
            </NewButton>
          </div>
        </div>
        <div className="scrollbar-holder">
          <Scrollbar>
            {tab === 'profile' ? (
              <SortableComponent
                categories={newCategories?.sort(
                  (a: any, b: any) => a?.sortOrder - b?.sortOrder,
                )}
                themes={newThemes?.sort(
                  (a: any, b: any) => a?.sortOrder - b?.sortOrder,
                )}
                onSortEndCat={onSortEndCat}
                onSortEndTheme={onSortEndTheme}
                onCategoryEdit={onCategoryEdit}
                unCatThemes={newThemes
                  ?.filter((theme: any) => !theme.categoryId)
                  .sort((a: any, b: any) => a.sortOrder - b.sortOrder)}
              />
            ) : (
              <SortableComponent
                categories={newCategories.sort(
                  (a: any, b: any) => a.onBoardSortOrder - b.onBoardSortOrder,
                )}
                themes={newThemes.sort(
                  (a: any, b: any) => a.onBoardSortOrder - b.onBoardSortOrder,
                )}
                onSortEndCat={onSortEndCat}
                onSortEndTheme={onSortEndTheme}
                onCategoryToggelHanlder={onCategoryToggelHanlder}
                onThemeToggelHandler={onThemeToggelHandler}
                onCategoryEdit={onCategoryEdit}
                showToggel
                unCatThemes={newThemes
                  ?.filter((theme: any) => !theme.categoryId)
                  ?.sort(
                    (a: any, b: any) => a.onBoardSortOrder - b.onBoardSortOrder,
                  )}
              />
            )}
          </Scrollbar>
        </div>
      </Model>
      <Model isOpen={isOpenCat} onClose={onCloseCat} onOk={handleCategorySave}>
        <FocusInput
          materialDesign
          label="Category"
          name="category"
          value={selectedCat?.name}
          onChange={(e) =>
            setSelectedCat({ ...selectedCat, name: e.target.value })
          }
        />
      </Model>
    </div>
  );
}
export default styled(CurdModel)`
  .modal-content {
    background: none;
  }
  .modal-header {
    background: #fff;
  }
  .modal-body {
    padding: 0;
  }
  .scrollbar-holder {
    height: calc(100vh - 200px);
  }
  .action {
    margin: 0;
    padding: 20px;
    background: #fff;
  }
  .rc-scollbar {
    border-radius: 0 0 0.3em 0.3em;
    overflow: hidden;
    > .sortable,
    > .rc-according {
      background: #fff;
      padding: 0 20px;

      .sp_dark & {
        /* background: none; */
      }
    }
  }
`;
