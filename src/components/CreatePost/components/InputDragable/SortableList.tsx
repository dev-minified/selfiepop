import React from 'react';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
} from 'react-sortable-hoc';
import styled from 'styled-components';

type ISortableListProps = SortableContainerProps & {
  items: any;
  renderItem: any;
  onSortEnd: any;

  selected?: number | string | null;

  itemKey?: string;
};
const Li = styled.li`
  z-index: 14;
  &.isdragging {
    .card-dragable {
      transition: all 0.25s ease;

      .drag-dots {
        color: var(--pallete-primary-darker);
      }
    }

    .img-container {
      width: 136px;
      height: 136px;
      padding-top: 0;

      @media (max-width: 767px) {
        width: 77px;
        height: 77px;
      }
    }
  }
`;
const ListItem = SortableElement<
  SortableElementProps & { sn: number; item: any; renderItem: any }
>(({ item, renderItem, sn }: { item: any; renderItem: any; sn: number }) => {
  return (
    <Li className="ui-sortable ui-sortable-handle ui-sortable-helper">
      {renderItem(item, sn)}
    </Li>
  );
});

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
          let key = index;
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
  const {
    lockAxis = 'y',
    disableAutoscroll = true,
    helperClass,
    ...rest
  } = props;
  return (
    <List
      lockAxis={lockAxis}
      disableAutoscroll={disableAutoscroll}
      helperClass={`${helperClass} isdragging`}
      {...rest}
    />
  );
};

export default SortableList;
