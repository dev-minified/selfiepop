import { DoubleArrow, Search } from 'assets/svgs/index';
import classNames from 'classnames';
import Input from 'components/focus-input';
import Select from 'components/Select';
import useOpenClose from 'hooks/useOpenClose';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  onChange?(value: string, type: 'text' | 'tag'): void;
  resultCount?: number;
  onSortChange?(sortOption: string, sortType: 'asc' | 'desc'): void;
  sortOptions?: { value: string; label: string }[];
}

const SearchBar: React.FC<Props> = (props) => {
  const { className, onChange, resultCount, onSortChange, sortOptions } = props;

  const [searchText, setSearchText] = useState<string>('');
  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [isResultCountVisible, showResultCount, hideResultCount] =
    useOpenClose();

  useEffect(() => {
    if (resultCount != null) {
      showResultCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultCount]);

  useEffect(() => {
    if (!!sortOptions?.length) {
      setSelectedSort(sortOptions[0].value);
    }
  }, [sortOptions]);

  return (
    <div className={`${className} members-filters-form`}>
      <div className="search-area-box">
        <div
          className={classNames('search-area-wrap', {
            'search-active': true,
          })}
        >
          <div className="name_search field-search">
            <div className="fields-wrap">
              <div className="search-area">
                <div className="search_from">
                  <Input
                    disableFloatingLabel={false}
                    placeholder="Member or Tag"
                    type="text"
                    icon={<Search />}
                    value={searchText}
                    onChange={(e) => {
                      onChange?.(e.target.value, 'text');
                      setSearchText(e.target.value);
                    }}
                  />
                  <Select
                    isSearchable={false}
                    value={sortOptions?.find(
                      (option) => selectedSort === option.value,
                    )}
                    options={sortOptions}
                    onChange={(e) => {
                      const value = `${e?.value}`;
                      setSelectedSort(value);
                      onSortChange?.(value, sortType);
                    }}
                    size="small"
                  />
                  <div
                    className={`sort_order ${sortType === 'desc' && 'active'}`}
                    // ${subsTotalCount < 2 && 'disabled'}
                  >
                    <div
                      className="sort-area"
                      onClick={() => {
                        const value = sortType === 'asc' ? 'desc' : 'asc';
                        setSortType(value);
                        onSortChange?.(selectedSort, value);
                      }}
                    >
                      <span>
                        <DoubleArrow />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isResultCountVisible && (
        <div
          className={classNames('result_count', {
            // isActive: showResultCount,
          })}
        >
          <span className="result-text">
            <strong className="result-val">{resultCount}</strong> results found
          </span>
          <span className="close_icon" onClick={hideResultCount}></span>
        </div>
      )}
    </div>
  );
};

export default styled(SearchBar)`
  padding: 14px 18px 0;
  margin: 0 -6px 20px;
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
`;
