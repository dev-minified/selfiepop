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
  z-index: 10;
  &.isdragging .card-dragable {
    transition: all 0.25s ease;
    padding: 0;
    padding: 0;
    border: none;

    &:hover {
      background: none;
    }

    &:after {
      display: none;
    }

    .right-section {
      display: none;
    }

    .text-input {
      margin-bottom: 0 !important;
    }

    .left-section {
      display: block;
      word-break: normal;
    }

    .drag-dots {
      margin-bottom: 28px;
    }

    .img-icon {
      position: absolute;
      width: 15px;
      height: 15px;
      right: 10px;
      top: 5px;

      .icon {
        margin: 0;
        width: 100%;
        height: 100%;
        background: none;
        border: none;
        min-width: inherit;

        svg {
          height: auto;

          circle {
            fill: #000;
            opacity: 1;
          }
        }
      }
    }

    .materialized-input {
      textarea.form-control {
        min-height: 70px;
      }
    }

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
