import { UpDownArrow } from 'assets/svgs';
import ActionsDropDown from 'components/DropDownFilter';
import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;

  sortState?: string;
  onSortChange?: Function;
  value?: { label: string; value: string };
  onChange?: Function;
  options: { label: string; value: string }[];
  defaultValue: { label: string; value: string };
  optionspostions?: 'left' | 'right';
  sortable?: boolean;
}
const OPTIONS = [
  {
    label: 'Total Paid',
    value: 'earning',
  },
  { label: 'Recent Message', value: 'lastMessage' },
  { label: 'Date Joined', value: 'joinDate' },
  { label: 'Old Unread Message', value: 'oldestUnread' },
];
function FilterOptions({
  className,
  onChange,

  sortable = true,
  onSortChange,
  options = OPTIONS,
  value: active,
  optionspostions = 'right',
  defaultValue,
}: Props): ReactElement {
  // const [active, setActive] = useState(value?.label ? value : defaultValue);

  return (
    <div className={`${className} members-filters-form`}>
      <div className="fields-wrap">
        <ActionsDropDown
          className="options_dropdown"
          options={options}
          showCloseIcon={active?.value !== ''}
          active={active}
          onChange={(e) => {
            // setActive(e);
            onChange?.(e);
          }}
          optionspostions={optionspostions}
        />
        {sortable ? (
          <span
            className="sort_order"
            onClick={(e) => {
              console.log('click');
              e.preventDefault();
              e.stopPropagation();
              onSortChange?.();
            }}
          >
            <UpDownArrow />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default styled(FilterOptions)`
  /* padding: 14px 18px 0; */
  /* margin: 0 -6px 20px; */
  background: var(--pallete-background-default);

  @media (max-width: 1199px) {
    /* padding: 15px 10px 0; */
  }
  .fields-wrap {
    display: flex;
    width: 100%;
    align-items: center;
    .options_dropdown {
      display: flex;
      justify-content: space-between;
      margin: 0;
      label {
        margin: 0;
      }
      .options {
        margin-right: 10px;
        .actions {
          transform: translate(-50%, 0);

          @media (max-width: 767px) {
            transform: none;
            right: 0;
          }
        }
      }
    }
  }
  .sort_order {
    width: 30px;
    height: 30px;
    /* border: 1px solid var(--pallete-colors-border); */
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.4s ease;

    &.active {
      .sort-area {
        span {
          transform: rotate(0);
        }
      }
    }

    &:hover {
      background: var(--colors-indigo-200);
      color: #fff;
      border-color: var(--colors-indigo-200);

      path {
        fill: #fff;
      }
    }

    .sort-area {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        display: inline-block;
        transform: rotate(180deg);
        vertical-align: top;
        transition: all 0.4s ease;
      }

      svg {
        width: 24px;
        height: auto;

        path {
          .sp_dark & {
            fill: var(--pallete-text-main);
          }
        }
      }
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;

      .sort-area {
        pointer-events: none;
      }

      &:hover,
      &.active {
        opacity: 0.6;
        background: none;
        color: var(--pallete-text-main);
        border-color: #d9e2ea;

        path {
          fill: #000;
        }
      }
    }
  }

  .react-select__value-container {
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
  }

  .react-select__control {
    border-radius: 40px;
    border-color: #d9e2ea;
    min-height: 28px;
    .react-select__indicator-separator {
      display: none;
    }

    .react-select__indicators {
      width: 28px;
      height: 28px;
      background: none;
    }
  }

  .react-select__menu {
    overflow: hidden;
    border: 1px solid var(--pallete-colors-border);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
    border-radius: 4px;

    .react-select__menu-list {
      padding: 5px;
    }

    .react-select__option {
      background: none;
      color: #8d778d;
      padding: 6px 10px;
      min-width: inherit;
      margin: 0;
      text-align: left;
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;

      &:hover:not(.react-select__option--is-selected),
      &.react-select__option--is-focused:not(
          .react-select__option--is-selected
        ) {
        color: var(--pallete-text-secondary-100);
        background: rgba(230, 236, 245, 0.62);
      }

      &.react-select__option--is-selected {
        color: var(--pallete-text-secondary-100);
        background: none;
      }
    }
  }

  .search-bar {
    &:not(.field-active) {
      .form-control {
        opacity: 0;
        visibility: hidden;
        padding: 0;
      }

      .icon {
        width: 32px;
        height: 32px;
        background: var(--pallete-text-lighter-200);
        color: var(--pallete-text-main);
        border-radius: 6px;
        transition: all 0.4s ease;
        cursor: pointer;
        right: auto;
        transform: none;

        &:hover {
          background: var(--pallete-background-light);

          path {
            fill-opacity: 1;
          }
        }
      }
    }

    .text-input {
      position: relative;

      .form-control {
        height: 44px;
        background: var(--pallete-background-primary-light);
        border: 1px solid var(--pallete-background-secondary);
        padding: 6px 17px 6px 45px;
        font-size: 15px;
        line-height: 18px;

        &::placeholder {
          .sp_dark & {
            color: var(--pallete-text-main);
          }
        }
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        left: 8px;
        top: 50%;
        right: auto;
        transform: translate(0, -50%);

        span {
          display: block;
          width: 16px;
          height: 16px;
        }

        svg {
          display: block;
        }

        path {
          fill: var(--pallete-text-main);
          fill-opacity: 0.8;
        }
      }
    }

    .rightIcon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
      opacity: 0.6;
      cursor: pointer;
    }
  }
`;
