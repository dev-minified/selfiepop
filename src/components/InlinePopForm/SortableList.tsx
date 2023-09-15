import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import styled from 'styled-components';

interface ISortableListProps {
  items: any;
  renderItem: any;
  onSortEnd: any;
  shouldCancelStart?: any;
  distance?: number;
  selected?: number | string | null;
  axis?: 'x' | 'y' | 'xy';
  helperClass?: string;
  useDragHandle?: boolean;
  itemKey?: string;
}
const Li = styled.li`
  z-index: 14;
  &.isdragging .card-dragable {
    transition: all 0.25s ease;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #dcbde7;

    .drag-dots {
      color: var(--pallete-primary-darker);
    }
  }
`;
const ListItem = SortableElement<any>(
  ({ item, renderItem, sn }: { item: any; renderItem: any; sn: number }) => {
    return (
      <Li className="ui-sortable ui-sortable-handle ui-sortable-helper">
        {renderItem(item, sn)}
      </Li>
    );
  },
);

const List = SortableContainer(
  ({
    items,
    selected,
    itemKey = '',
    renderItem,
    ...rest
  }: ISortableListProps) => {
    return (
      <ul className="sortable">
        {items.map((item: any, index: number) => {
          let key = item[itemKey] || index;
          if (itemKey === 'array__index') key = item[index] + index;
          return (
            <ListItem
              key={key}
              sn={key}
              index={index}
              item={item}
              disabled={selected === index}
              renderItem={renderItem}
              {...rest}
            />
          );
        })}
      </ul>
    );
  },
);

const SortableList: React.FC<ISortableListProps> = (props) => {
  return (
    <List
      lockAxis="y"
      disableAutoscroll
      helperClass={`${props.helperClass} isdragging`}
      {...props}
    />
  );
};

export default SortableList;
