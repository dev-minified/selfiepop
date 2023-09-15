import { FilterSvg } from 'assets/svgs';
import Tag from 'components/Tag';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const defaultOptions = [
  {
    label: 'Total Paid',
    value: 'earning',
  },
  { label: 'Recent Message', value: 'lastMessage' },
  { label: 'Date Joined', value: 'joinDate' },
  { label: 'Old Unread Message', value: 'oldestUnread' },
];
type OPTIONS = {
  label: string;
  value: string;
};
const ActionsDropDown = ({
  options = defaultOptions,
  className,
  onChange,
  active,
  optionspostions = 'right',
  showCloseIcon = false,
}: {
  options?: OPTIONS[];
  className?: string;
  onChange?: (e: any) => void;
  active?: OPTIONS;
  optionspostions?: 'left' | 'right';
  showCloseIcon?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(active);

  useEffect(() => {
    if (active?.label) {
      setActiveFilter(active);
    }

    return () => {};
  }, [active]);

  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => {
    if (isVisible) {
      setIsVisible(false);
    }
  });
  return (
    <div className={className}>
      {!!activeFilter && optionspostions === 'left' ? (
        <Tag
          label={activeFilter?.label}
          closeAble={showCloseIcon}
          showCloseIcon={showCloseIcon}
          onClose={() => {
            // setActiveFilter('');
            onChange?.('');
            setIsVisible(false);
          }}
        />
      ) : optionspostions === 'left' ? (
        <div />
      ) : null}
      <div
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible((v) => !v);
        }}
        className="options"
      >
        <span className="options-opener">
          <FilterSvg />
        </span>
        {isVisible ? (
          <ul className="actions">
            {options.map((ele) => {
              return (
                <li key={ele?.value}>
                  <span
                    className="option-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveFilter(ele);
                      onChange?.(ele);
                      setIsVisible(() => false);
                    }}
                  >
                    {ele?.label}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {!!activeFilter && optionspostions === 'right' ? (
        <Tag
          label={activeFilter?.label}
          closeAble={showCloseIcon}
          showCloseIcon={showCloseIcon}
          onClose={() => {
            setActiveFilter({ label: '', value: '' });
            onChange?.('');
            setIsVisible(false);
          }}
        />
      ) : optionspostions === 'right' ? (
        <div />
      ) : null}
    </div>
  );
};
export default styled(ActionsDropDown)`
  margin: 0 0 0 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;

  .options {
    position: relative;
  }

  .options-opener {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--pallete-text-lighter-200);
    color: var(--pallete-text-main);
    border-radius: 6px;
    transition: all 0.4s ease;
    cursor: pointer;

    &:hover {
      background: var(--pallete-background-light);

      path {
        fill-opacity: 1;
      }
    }

    path {
      fill: currentColor;
      fill-opacity: 0.8;
    }
  }

  .actions {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    top: 100%;
    margin: 5px 0 0;
    width: 170px;
    border-radius: 8px;
    font-size: 15px;
    line-height: 18px;
    z-index: 99;
    font-weight: 500;
    background: var(--pallete-text-lighter-400);
    overflow: hidden;

    .option-item {
      display: block;
      padding: 11px 20px;
      color: var(--pallete-text-main);
      transition: all 0.4s ease;
      cursor: pointer;
      white-space: normal;

      &.active {
        color: var(--pallete-primary-main);
      }

      &:hover:not(.active) {
        color: var(--pallete-text-lighter-50);
        background: var(--pallete-text-lighter-200);
      }
    }
  }

  label {
    margin: 0 0 0 16px;

    .label-text {
      background: var(--pallete-primary-main);
      font-size: 14px;
      line-height: 18px;
      padding: 9px 14px 8px 14px;
      display: flex;
      align-items: center;
      gap: 8px;

      .tag_close_icon {
        width: 14px;
        height: 10px;
        right: 12px;
        position: relative;
        top: auto;
        transform: none;
        right: auto;

        &:before,
        &:after {
          background: #fff;
        }
      }
    }
  }
`;
