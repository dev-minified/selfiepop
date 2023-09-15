import { Edit, VerticalDots } from 'assets/svgs';
import DragableItem from 'components/InlinePopForm/DragableItem';
import NewButton from 'components/NButton';
import According from 'components/according';
import Switchbox from 'components/switchbox';
import SortableList from '../../components/InlinePopForm/SortableList';

export const SortableComponent = ({
  categories,
  themes,
  onSortEndCat,
  onSortEndTheme,
  showToggel,
  onCategoryToggelHanlder,
  onThemeToggelHandler,
  unCatThemes,
  onCategoryEdit,
}: any) => {
  return (
    <>
      <SortableList
        items={categories}
        distance={5}
        onSortEnd={onSortEndCat}
        helperClass="sortableHelper"
        renderItem={(cat: any) => {
          const cthemes = themes.filter(
            (th: any) => th?.categoryId?._id === cat._id,
          );
          return (
            <According
              Svg={VerticalDots}
              title={cat.name?.toLocaleUpperCase()}
              styles={{
                icon: { backgroundColor: 'var(--pallete-background-default)' },
              }}
              extra={
                <div>
                  <NewButton
                    type="default"
                    outline
                    size="x-small"
                    icon={<Edit />}
                    onClick={() => onCategoryEdit(cat)}
                    style={{ marginRight: '10px' }}
                  />
                  {showToggel ? (
                    <Switchbox
                      size="small"
                      status={false}
                      value={cat.isActiveOnBoarding}
                      onChange={() => {
                        onCategoryToggelHanlder && onCategoryToggelHanlder(cat);
                      }}
                    />
                  ) : undefined}
                </div>
              }
            >
              <div className="price--variation">
                <SortableList
                  useDragHandle
                  items={cthemes}
                  distance={5}
                  onSortEnd={(data: any, e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSortEndTheme({ ...data, array: cthemes });
                  }}
                  helperClass="sortableHelper"
                  renderItem={(theme: any) => {
                    return (
                      <DragableItem
                        title={`${theme.name} (${
                          theme.isPublished ? 'published' : 'unpublished'
                        })`}
                        options={{ toggel: showToggel }}
                        isActive={!showToggel || theme.isActiveOnBoarding}
                        onToggel={() => {
                          onThemeToggelHandler && onThemeToggelHandler(theme);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </According>
          );
        }}
      />
      {!!unCatThemes?.length && (
        <According
          showIcon={false}
          title={'UNCATEGORIZED'}
          styles={{ icon: { backgroundColor: 'white' } }}
        >
          <div className="price--variation">
            <SortableList
              useDragHandle
              items={unCatThemes}
              distance={5}
              onSortEnd={(data: any, e: any) => {
                e.preventDefault();
                e.stopPropagation();
                onSortEndTheme({ ...data, array: unCatThemes });
              }}
              helperClass="sortableHelper"
              renderItem={(theme: any) => {
                return (
                  <DragableItem
                    title={`${theme.name} (${
                      theme.isPublished ? 'published' : 'unpublished'
                    })`}
                    options={{ toggel: showToggel }}
                    isActive={!showToggel || theme.isActiveOnBoarding}
                    onToggel={() => {
                      onThemeToggelHandler && onThemeToggelHandler(theme);
                    }}
                  />
                );
              }}
            />
          </div>
        </According>
      )}
    </>
  );
};
