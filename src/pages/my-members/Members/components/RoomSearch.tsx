import { Cross, DoubleArrow, Search, Tag as TagIcon } from 'assets/svgs/index';
import classNames from 'classnames';
import ActionsDropDown from 'components/DropDownFilter';
import Input from 'components/focus-input';
import Button from 'components/NButton';
import { motion } from 'framer-motion';
import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement, useCallback, useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  count?: number;
  sortState?: string;
  showResultCount?: boolean;
  isTagActive: boolean;
  tags: string[];
  searchText: string;
  onResultCountClose?(): void;
  setSortState?: Function;
  setIsTagActive(value: boolean): void;
  onTagsUpdate(tags: string[]): void;
  onSearchTextUpdate(value: string): void;
  enableTagsearch?: boolean;
  selectedSort?: { value: string; label: string };
  setSelectedSort?: Function;
  enableSort?: boolean;
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
function RoomSearch({
  className,
  setSelectedSort,
  selectedSort,
  sortState = 'ascending',
  setSortState,
  count,
  showResultCount,
  isTagActive,
  onResultCountClose,
  setIsTagActive,
  onSearchTextUpdate,
  enableSort = false,
  tags,
  enableTagsearch = true,
  searchText,
}: Props): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  const subsTotalCount = useAppSelector(
    (state) => state.mysales.usersList?.totalCount,
  );
  const setVisbility = useCallback(
    (isVisible: boolean) => {
      setIsExpanded(isVisible);
    },
    [isExpanded],
  );
  return (
    <div className={`${className} members-filters-form`}>
      <div className="search-area-box">
        <div
          className={classNames('search-area-wrap', {
            'search-active': !isTagActive,
          })}
        >
          <div className="name_search field-search">
            <div className="fields-wrap">
              {enableTagsearch && (
                <Button
                  icon={<TagIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsTagActive(true);
                  }}
                />
              )}
              <div className="search-area">
                <div className="search_from">
                  <motion.div
                    className={`${isExpanded ? 'field-active' : ''} search-bar`}
                    animate={{ width: isExpanded ? '100%' : '32px' }}
                    transition={{ duration: 0.5 }}
                  >
                    <Input
                      disableFloatingLabel={false}
                      placeholder="Member or Tag"
                      type="text"
                      icon={
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setVisbility(true);
                          }}
                        >
                          <Search />
                        </span>
                      }
                      value={searchText}
                      onChange={(e) => {
                        onSearchTextUpdate(e.target.value);
                      }}
                      rightIcon={
                        <>
                          {isExpanded && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSearchTextUpdate('');
                                setVisbility(false);
                              }}
                            >
                              <Cross />
                            </span>
                          )}
                        </>
                      }
                    />
                  </motion.div>
                  {!isExpanded ? (
                    <ActionsDropDown
                      options={OPTIONS}
                      onChange={(e) => {
                        setSelectedSort?.(e);
                      }}
                    />
                  ) : null}
                  {enableSort && !isExpanded ? (
                    <div
                      className={`sort_order ${
                        sortState === 'Desc' && 'active'
                      } ${subsTotalCount < 2 && 'disabled'}`}
                    >
                      <div
                        className="sort-area"
                        onClick={() => {
                          if (sortState === 'Asc') {
                            setSortState?.('Desc');
                          } else {
                            setSortState?.('Asc');
                          }
                        }}
                      >
                        <span>
                          <DoubleArrow />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(!!searchText?.length || !!tags?.length) && (
        <div
          className={classNames('result_count', {
            isActive: showResultCount,
          })}
        >
          <span className="result-text">
            <strong className="result-val">{count}</strong> results found
          </span>
          <span className="close_icon" onClick={onResultCountClose}></span>
        </div>
      )}
    </div>
  );
}

export default styled(RoomSearch)`
  padding: 14px 18px 0;
  margin: 0 0 20px;
  background: var(--pallete-background-default);

  @media (max-width: 1199px) {
    padding: 15px 10px 0;
  }

  .search-area-box {
    position: relative;

    &:after {
      left: -18px;
      right: -18px;
      bottom: 0;
      height: 1px;
      content: '';
      background: var(--pallete-background-secondary);
      position: absolute;
      display: none;

      @media (max-width: 1199px) {
        left: -6px;
        right: -6px;
      }
    }
  }

  .search-area-wrap {
    white-space: nowrap;
    width: 100%;
    transition: all 0.4s ease;

    &.search-active {
      /* transform: translate(-100%, 0); */

      .field-search {
        /* height: 44px; */
      }
    }
  }

  .field-search {
    margin: 0 0 12px;
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: auto;

    &.tag_search {
      .fields-wrap {
        flex-direction: row-reverse;
      }

      .button {
        margin: 0 0 0 5px;
      }
    }

    &.isActive {
      .button {
      }
    }
  }

  .fields-wrap {
    display: flex;
    flex-direction: row;

    .button-icon-only {
      width: 44px;
      height: 44px;
      margin-right: 5px;
      background: #e6eaf5;
      border-color: #e6eaf5;

      svg {
        path {
          fill: var(--pallete-text-main-550);
        }
      }
    }

    .text-input {
      margin: 0 !important;

      .icon {
        color: #a7b0ba;
        height: 28px;
        left: auto;
        right: 8px;

        path {
          fill: #a7b0ba;
        }
      }
    }

    .search-area {
      flex-grow: 1;
      flex-basis: 0;
    }

    .form-control {
      height: 30px;
      background: var(--pallete-background-default);
      border: 1px solid #d4dee8;
      border-radius: 8px;
      border-radius: 30px;
      font-size: 13px;
      line-height: 16px;
      padding: 6px 50px 6px 17px;

      &:focus {
        padding-left: 17px;
      }

      &::placeholder {
        color: rgba(167, 176, 186, 0.63);
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

  .room_search_tags {
    margin: 10px 0 0;
    white-space: normal;

    label {
      margin: 0 5px 5px 0;
    }
  }

  .result_count {
    padding: 8px 40px 10px 18px;
    margin: 0 -18px;
    position: relative;
    font-size: 14px;
    line-height: 17px;
    color: #999;
    display: none;
    background: var(--pallete-background-gray);

    &:after {
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 1px;
      content: '';
      background: var(--pallete-background-secondary);
      position: absolute;
    }

    .result-val {
      color: var(--pallete-text-main);
      font-size: 17px;
      line-height: 21px;
      font-weight: 500;
    }

    .close_icon {
      position: absolute;
      right: 18px;
      top: 15px;
      width: 16px;
      height: 16px;
      cursor: pointer;

      &:after,
      &:before {
        width: 100%;
        height: 2px;
        background: var(--pallete-text-main-550);
        border-radius: 4px;
        content: '';
        top: 4px;
        transform: rotate(45deg);
        position: absolute;
      }

      &:after {
        transform: rotate(-45deg);
      }
    }

    &.isActive {
      display: block;
    }
  }

  .search_from {
    display: flex;
    flex-direction: row;
    align-items: center;

    .text-input {
      flex-grow: 1;
      flex-basis: 0;
    }

    .sm.default {
      width: 130px;
      margin: 0 15px;
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
        left: 0 !important;
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
