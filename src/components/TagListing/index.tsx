import StikcyDropDown from 'components/StickyDropDown';
import Tag from 'components/Tag';
import Tooltip from 'components/tooltip';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

type Props = {
  className?: string;
  tags: { value: string; removable?: boolean }[];
  onRemoveTag?: (value: string, idx: number) => void;
};

const TagListing: React.FC<Props> = (props) => {
  const { className, tags = [], onRemoveTag } = props;

  const [activeTagIndex, setActiveTagIndex] = useState<number>();
  const mobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className={`${className} member-tags-frame`}>
      <div
        className={`member-tags-wrap ${
          (tags?.length as number) > 3 && 'show_count'
        }`}
      >
        {tags.map((tag, index) =>
          activeTagIndex !== index ? (
            <span
              onMouseEnter={(e) => {
                if (e.target) {
                  const width = (e.target as any).clientWidth;

                  if (width >= 70 || (mobile && width >= 40)) {
                    setActiveTagIndex(index);
                  }
                }
              }}
              className={`member-tag tag_${index}`}
              key={`${tag.value}-${index}`}
            >
              <Tag
                label={tag.value}
                closeAble={tag.removable}
                onClose={() => onRemoveTag?.(tag.value, index)}
              />
            </span>
          ) : (
            <Tooltip overlay={tag.value} key={`${tag.value}-${index}`}>
              <span className="member-tag" key={`${tag.value}-${index}`}>
                <Tag
                  label={tag.value}
                  closeAble={tag.removable}
                  onClose={() => onRemoveTag?.(tag.value, index)}
                />
              </span>
            </Tooltip>
          ),
        )}
        <StikcyDropDown
          className="dotsDrop"
          button={(props) => {
            return (
              <>
                {tags.length > 3 && (
                  <span
                    className="counter"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.handleToggle(e);
                    }}
                    ref={props.ref}
                  >
                    <span className="arrow"></span>
                  </span>
                )}
              </>
            );
          }}
          items={tags}
          renderItems={(props) => {
            const { items = [] } = props;
            return (
              <div className="more-member-tags">
                {items.map((item: any, idx: number) => {
                  return (
                    <div key={`${item}-${idx}`}>
                      <span className="member-tag" title={item.value}>
                        <Tag
                          label={item.value}
                          closeAble={item.removable}
                          onClose={() => onRemoveTag?.(item.value, idx)}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default styled(TagListing)`
  .member-tags-area {
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      flex-wrap: wrap;
    }

    .member-total-amount {
      color: #a27fa6;
      font-size: 14px;
      line-height: 16px;
      font-weight: 500;
      margin: 0 5px 0 0;
      letter-spacing: 0.5;

      @media (max-width: 767px) {
        width: 100%;
      }
    }

    .counter {
      background: rgba(172, 180, 221, 0.32);
      display: inline-block;
      vertical-align: top;
      color: #fff;
      font-size: 12px;
      line-height: 14px;
      padding: 2px 7px;
      cursor: pointer;
      margin: 1px 5px 1px 0;
      border-radius: 18px;
      font-weight: 500;
      transition: all 0.4s ease;
      min-height: 18px;

      &:hover {
        background: var(--colors-indigo-500);

        .arrow {
          border-color: #fff transparent transparent transparent;
        }
      }
    }

    .arrow {
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: var(--pallete-text-secondary-150) transparent transparent
        transparent;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .member-tags-wrap {
    overflow: hidden;
    white-space: nowrap;
    line-height: 1.2;

    .member-tag {
      background: none;
      margin: 0;
      padding: 0;

      @media (max-width: 767px) {
        max-width: 50px;
      }
      &:nth-child(3) {
        + .member-tag,
        ~ .member-tag {
          display: none !important;
        }
      }

      &:nth-child(2) {
        + .member-tag,
        ~ .member-tag {
          @media (max-width: 767px) {
            display: none !important;
          }
        }
      }
    }
  }
  .tag_close_icon {
    display: none;
  }
  .label-text {
    font-size: 12px;
    line-height: 14px;
    background: var(--pallete-text-secondary-150);
    padding: 2px 7px 2px 7px;

    .label {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 56px;
      display: inline-block;
      vertical-align: top;
    }
  }

  .dotsDrop {
    display: inline-block;
    vertical-align: top;
  }

  .user-detail {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 5px 0 15px;
  }

  .more-info {
    text-align: right;
    color: #9d9e9f;
    font-size: 11px;
    line-height: 13px;
    font-weight: 500;
  }

  .orders-detail-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .time-info {
    margin: 3px 0 10px;
  }

  .order-info {
    background: #16c107;
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 15px;
    padding: 2px 7px 1px;
    border-radius: 3px;
    font-weight: 500;

    span {
      display: inline-block;
      vertical-align: top;
      padding: 0 0 0 2px;
    }
  }

  .unread-messages,
  .account-subscriptions {
    display: inline-block;
    vertical-align: top;
    background: var(--colors-indigo-500);
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    line-height: 16px;
    padding: 1px 7px;
    font-weight: 500;
    margin: 0 0 0 5px;
  }

  .account-subscriptions {
    background: #838385;
  }

  .number {
    min-width: 22px;
    height: 17px;
    background: var(--pallete-primary-main);
    color: #ffffff;
    border-radius: 3px;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    display: inline-block;
    vertical-align: top;
    text-align: center;
  }

  .user-name {
    color: var(--pallete-text-main-550);
    font-weight: 500;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: #fff;

      svg {
        path {
          fill: #fff;
        }
      }
    }
  }

  .description {
    color: var(--pallete-primary-main);
    font-size: 15px;
    line-height: 18px;
    font-weight: 400;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.active {
    background: var(--pallete-background-secondary);
  }
`;
