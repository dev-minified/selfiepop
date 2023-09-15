import { Cross, Search, Tag as TagIcon } from 'assets/svgs/index';
import classNames from 'classnames';
import Input from 'components/focus-input';
import Button from 'components/NButton';
import Tag from 'components/Tag';
import { ReactElement, useState } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  count?: number;
  showResultCount?: boolean;
  isTagActive: boolean;
  tags: string[];
  searchText: string;
  onResultCountClose?(): void;
  setIsTagActive(value: boolean): void;
  onTagsUpdate(tags: string[]): void;
  onSearchTextUpdate(value: string): void;
  enableTagsearch?: boolean;
}

function RoomSearch({
  className,
  count,
  showResultCount,
  isTagActive,
  onResultCountClose,
  setIsTagActive,
  onSearchTextUpdate,
  onTagsUpdate,
  tags,
  enableTagsearch = true,
  searchText,
}: Props): ReactElement {
  const [tagInput, setTagInput] = useState<string>('');

  return (
    <div className={className}>
      <div className="search-area-box">
        <div
          className={classNames('search-area-wrap', {
            'search-active': !isTagActive,
          })}
        >
          <div className="tag_search field-search">
            <div className="fields-wrap">
              <Button icon={<Search />} onClick={() => setIsTagActive(false)} />
              <div className="search-area">
                <div className="search_from">
                  <Input
                    disableFloatingLabel={false}
                    type="text"
                    placeholder="search"
                    icon={<TagIcon />}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        const isAlreadyExist = tags.find(
                          (t) => t.trim() === tagInput.trim(),
                        );
                        if (!isAlreadyExist) {
                          const newTags = [...tags, tagInput];
                          onTagsUpdate(newTags);
                          setTagInput('');
                        }
                      }
                    }}
                  />
                </div>
                <div className="room_search_tags">
                  {tags.map((t, idx) => (
                    <Tag
                      key={idx}
                      label={t}
                      onClose={(tag) => {
                        const newTags = [...tags.filter((t) => t !== tag)];
                        onTagsUpdate(newTags);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="name_search field-search">
            <div className="fields-wrap">
              {enableTagsearch && (
                <Button
                  icon={<TagIcon />}
                  onClick={() => setIsTagActive(true)}
                />
              )}
              <div className="search-area">
                <div className="search_from">
                  <Input
                    disableFloatingLabel={false}
                    placeholder="Search"
                    type="text"
                    rightIcon={
                      !!searchText?.length ? (
                        <span
                          onClick={onResultCountClose}
                          className="cross-icon"
                        >
                          <Cross />
                        </span>
                      ) : (
                        <span className="search-icon">
                          <Search />
                        </span>
                      )
                    }
                    value={searchText}
                    onChange={(e) => onSearchTextUpdate(e.target.value)}
                  />
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
  padding: 15px 20px 0;

  @media (max-width: 1199px) {
    padding: 15px 10px;
  }

  .search-area-box {
    overflow: hidden;
  }

  .search-area-wrap {
    white-space: nowrap;
    width: 100%;
    transition: all 0.4s ease;

    &.search-active {
      transform: translate(-100%, 0);

      .field-search {
        height: 44px;
      }
    }
  }

  .field-search {
    margin: 0 0 15px;
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: auto;
    overflow: hidden;

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
    }

    .icon {
      color: var(--pallete-primary-main);

      path {
        fill: var(--pallete-primary-main);
      }
    }

    .search-area {
      flex-grow: 1;
      flex-basis: 0;

      .rightIcon {
        position: absolute;
        right: 16px;
        width: 16px;
        top: 50%;
        transform: translate(0, -50%);

        .search-icon {
          opacity: 0.4;
        }

        .cross-icon {
          width: 12px;
          display: block;
          margin: 0 0 0 auto;
          opacity: 0.8;
          cursor: pointer;

          &:hover {
            opacity: 1;
          }
        }

        svg {
          width: 100%;
          height: auto;
          display: block;
        }
      }
    }

    .form-control {
      height: 44px;
      background: var(--pallete-background-secondary);
      border: none;
      border-radius: 22px;
      padding-right: 40px;
      transition: all 0.4s ease;

      &:hover {
        .sp_dark & {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
      }

      &::placeholder {
        color: #8b7fa6;

        .sp_dark & {
          color: rgba(255, 255, 255, 0.6);
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
    border-bottom: 1px solid var(--pallete-background-secondary);
    padding: 0 30px 10px 0;
    position: relative;
    font-size: 14px;
    line-height: 17px;
    color: #999;
    display: none;

    .result-val {
      color: var(--pallete-text-main-550);
      font-size: 17px;
      line-height: 21px;
    }

    .close_icon {
      position: absolute;
      right: 0;
      top: 5px;
      width: 13px;
      height: 13px;
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
`;
