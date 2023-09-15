import classNames from 'classnames';
import RcTabs, {
  TabPane,
  TabPaneProps,
  TabsProps as RcTabsProps,
} from 'rc-tabs';
import { EditableConfig } from 'rc-tabs/lib/interface';
import * as React from 'react';
import styled from 'styled-components';

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';

export type { TabPaneProps };
export type SizeType = 'small' | 'middle' | 'large' | undefined;

const TabDefaultPrefix = 'rc-tabs';
export interface TabsProps extends Omit<RcTabsProps, 'editable'> {
  type?: TabsType;
  size?: SizeType;
  hideAdd?: boolean;
  centered?: boolean;
  addIcon?: React.ReactNode;
  onEdit?: (
    e: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => void;
}

function Tabs({
  type,
  className,
  size: propSize,
  onEdit,
  hideAdd,
  centered,
  ...props
}: TabsProps) {
  const {
    prefixCls: customizePrefixCls,
    // , moreIcon = <EllipsisOutlined />
  } = props;

  const prefixCls = customizePrefixCls || TabDefaultPrefix;

  let editable: EditableConfig | undefined;
  if (type === 'editable-card') {
    editable = {
      onEdit: (editType, { key, event }) => {
        onEdit?.(editType === 'add' ? event : key!, editType);
      },
      showAdd: hideAdd !== true,
    };
  }

  return (
    <RcTabs
      moreTransitionName={`${prefixCls}-slide-up`}
      {...props}
      className={classNames(
        {
          [`${prefixCls}-${propSize}`]: propSize,
          [`${prefixCls}-card`]: ['card', 'editable-card'].includes(
            type as string,
          ),
          [`${prefixCls}-editable-card`]: type === 'editable-card',
          [`${prefixCls}-centered`]: centered,
        },
        className,
      )}
      editable={editable}
      prefixCls={prefixCls}
    />
  );
}

Tabs.TabPane = TabPane;

export default styled(Tabs)`
  &.rc-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    @media (max-width: 767px) {
      height: calc(100% - 30px);
    }
  }

  &.rc-tabs-top {
    .rc-tabs-nav-list {
      display: flex;
      flex-direction: row;
    }
  }

  .rc-tabs-nav {
    position: relative;
    z-index: 2;
    padding: 0 0 1px;
    overflow-x: auto;
    overflow-y: hidden;

    &:after {
      z-index: -1;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      content: '';
    }
  }

  .rc-tabs-tab {
    flex: 1;
    padding: 12px 16px;
    color: var(--pallete-primary-main);
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: all 0.4s ease;
    text-align: center;
    min-width: 126px;
    position: relative;

    @media (max-width: 991px) {
      min-width: inherit;
      font-size: 14px;
      line-height: 18px;
      padding: 12px;
    }

    @media (max-width: 767px) {
      padding: 5px;
      font-size: 13px;
      line-height: 15px;
      min-width: 78px;
    }

    &:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      background: var(--pallete-background-default);
      height: 1px;
      content: '';
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
    }

    &.rc-tabs-tab-active {
      border-bottom-color: var(--pallete-primary-main);
    }

    svg {
      margin: -2px 10px 0 0;

      @media (max-width: 991px) {
        width: 17px;
        margin: -1px 5px 0 0;
      }

      path {
        fill: currentColor;
        opacity: 1;
      }
    }
  }

  .rc-tabs-nav-operations,
  .rc-tabs-ink-bar {
    display: none;
  }

  .rc-tabs-content-holder {
  }
`;
