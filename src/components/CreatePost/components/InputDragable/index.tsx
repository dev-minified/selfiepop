import { Cross } from 'assets/svgs';
import { useEffect } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import DragableItem from './DragableItem';
import SortableList from './SortableList';
interface Props {
  value: any;
  onChange: Function;
  autoAddAndRemove?: boolean;
  selected?: number | null;
  setSelected: Function;
  setOutline: Function;
}
const TextAreaDragable = ({
  value,
  selected,
  autoAddAndRemove = true,
  setSelected,
  onChange,
  setOutline,
}: Props) => {
  const batchQuestionChange = (v: any) => {
    setOutline(v);
  };
  useEffect(() => {
    if (value?.length > 0) {
      setOutline(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateActive = (index: number, isActive: boolean) => {
    const newArray = value.slice();
    newArray[index] = { ...newArray[index], isActive };
    batchQuestionChange(newArray);
  };

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex === newIndex) return;
    const sortedArray = arrayMove<any>(value, oldIndex, newIndex).map(
      (item, index) => {
        if (typeof item === 'string') {
          return item;
        }
        return { ...item, sortOrder: index };
      },
    );
    onChange(sortedArray);
  };

  return (
    <div className="poll-sortable">
      <SortableList
        useDragHandle
        onSortEnd={onSortEnd}
        distance={5}
        selected={selected}
        items={value}
        renderItem={(item: any, index: number) => {
          return (
            <DragableItem
              icon={<Cross />}
              index={index}
              autoAddAndRemove={autoAddAndRemove}
              message={item}
              outlines={value}
              setOutline={setOutline}
              onEdit={(index: number) => setSelected(index)}
              onToggel={async () => {
                await updateActive(index, !item.isActive);
              }}
              {...item}
            />
          );
        }}
      />
    </div>
  );
};

export default TextAreaDragable;
