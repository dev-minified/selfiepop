import { VerticalDots } from 'assets/svgs';
import classNames from 'classnames';
import FocusInput from 'components/focus-input';
import React, { ReactElement } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import styled, { css } from 'styled-components';

const DragableCardStyle = styled.div<Props>`
  &.card-dragable {
    transition: all 0.25s ease;
    padding: 13px 9px 13px 5px;
    background:  var(--pallete-background-gray-secondary-100);
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
    position: relative;
    z-index: 2;
    border-radius: 5px;
    margin-bottom: 14px;
    color: #4d5a69;

    .sp_dark & {
      background: var(--pallete-background-primary-100);
      color: #999;
    }

    &.compact {
      background: var(--pallete-background-default);
      padding: 16px 9px 16px 5px;

      .sp_dark & {
        background: var(--pallete-background-primary-100);
      }

      &.inactive {
        .icon {
          background: none;

          svg {
            * {
              color: #d4d4d4 !important;
              fill: #d4d4d4 !important;

              .sp_dark & {
                color: #000 !important;
                fill: #000 !important;
              }
            }
          }
        }

        .card--title {
          color: #d4d4d4;

          .sp_dark & {
            color: #fff;
          }
        }

        .items-detail-info {
          color: #d4d4d4;

          .sp_dark & {
            color: #fff;
          }
        }

        .card--sub--title {
          color: #d4d4d4;

          .sp_dark & {
            color: #fff;
          }
        }
      }

      &:after {
        border-color: #cccaca;

        .sp_dark & {
          border-color: var(--pallete-colors-border);
        }
      }

      &.social_variation_twitter {
        .icon {
          svg {
            * {
              color: #55acee;
              fill: #55acee;
            }
          }
        }
      }

      &.social_variation_facebook {
        .icon {
          svg {
            * {
              color: #1877f2;
              fill: #1877f2;
            }
          }
        }
      }

      &.social_variation_youtube {
        .icon {
          svg {
            * {
              color: #f00;
              fill: #f00;
            }
          }
        }
      }

      &.social_variation_tiktok {
        .icon {
          svg {
            * {
              color: var(--pallete-text-main);
              fill: #000;

              .sp_dark & {
                color: var(--pallete-text-main);
                fill:var(--pallete-text-main);
              }
            }
          }
        }
      }

      &.social_variation_onlyfans {
        .icon {
          svg {
            * {
              color: #00AFF0;
              fill: #00AFF0;
            }
          }
        }
      }
      &.social_variation_snapchat {
        .icon {
          svg {
            * {
              color: #FFFC00;
              fill: #FFFC00;
            }
            #layer_1{
              path {
                fill: white;
              }
            }
          }
        }
      }
      .icon {
        width: 36px;
        min-width: 36px;
        height: auto;
        background: none;
        border: none;
        border-radius: 0;

        svg {
          width: 100%;
          height: auto;
          * {
            color: #724293;
            fill: #724293;
          }
        }
      }

      .type-sub-card {
        .header {
          .icon {
            width: 36px;
            min-width: 36px;
          }
        }
      }

      .card--title {
        color: #4d5a69;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        .sp_dark & {
          color: #fff;
        }
      }

      .card--sub--title {
        padding: 2px 0 0;
        color: #3f3f3f;
        font-size: 13px;
        line-height: 17px;

        .num {
          font-weight: 300;
        }
      }

      .items-detail-info {
        display: inline-block;
        vertical-align: top;

        @media (max-width: 640px) {
          display: block;
        }

        + .items-detail-info {
          padding-left: 35px;

          @media (max-width: 640px) {
            padding: 10px 0 0;
          }
        }
      }
    }
    }

    .button-default {
      background: var(--pallete-background-default);
    }

    .card-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &.inactive {
      cursor: default;
      background: var(--pallete-background-default);
      color: var(--pallete-text-main-250);

      .icon {
        background: #d5d5d5;
        color: #d5dade;

        img {
          filter: grayscale(100%);
          opacity: 0.2;
        }

        .default-star {
          #Layer_2,
          rect {
            .sp_dark & {
              fill: #000;
            }
          }
        }

        #Layer_2,
        rect {
          fill: #d5dade;
        }
      }

      .card--price {
        color: var(--pallete-text-main-250);
      }

      &:hover {
        background-color: var(--pallete-background-gray-lighter);
        border-color: var(--pallete-colors-border);
        color: rgba(0, 0, 0, 0.47);

        .sp_dark & {
          color: rgba(255, 255, 255, 0.47);
        }
      }
    }

    .card--price {
      display: inline-block;
      vertical-align: middle;
      border: 1px solid var(--pallete-colors-border);
      color: #e51075;
      font-size: 13px;
      line-height: 15px;
      margin: 0 0 0 12px;
      padding: 5px 9px;
      background: var(--pallete-background-default);
      border-radius: 4px;

      @media (max-width: 767px) {
        display: none;
      }
    }
  }

  &.card-dragable::after {
    content: '';
    border: 1px solid var(--pallete-colors-border);
    border-radius: 5px;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: -1;
    ${(props) =>
      props.error &&
      css`
        border-color: red;
      `}
  }

  &.card-dragable .drag-dots {
    color: #d5dade;
    margin-right: 12px;
    position: relative;
    cursor: grabbing;
    transition: all 0.4s ease;

    &:hover {
      color: var(--pallete-primary-main) !important;
    }

    &:before {
      position: absolute;
      left: -6px;
      right: -11px;
      top: -25px;
      bottom: -26px;
      content: '';
    }
  }

  &.card-dragable .icon {
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 100%;
    font-size: 19px;
    font-weight: 700;
    border: 1px solid var(--pallete-colors-border);
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 0 10px 0 0;
    position: relative;
    z-index: 1;
    overflow: hidden;
    background: var(--pallete-primary-darker);
    svg {
      width: 12px;
      * {
        color: #fff;
        fill: #fff;
      }
    }
  }

  &.card-dragable .icon img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  &.card-dragable .left-section {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    align-items: center;
    word-break: break-all;
    min-width: 0;

  }

  &.card-dragable .card--text {
    display: flex;
    flex-direction: column;
    min-width: 0;;
  }

  &.card-dragable .card--subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--pallete-text-main-500);
  }

  &.card-dragable .right-section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 10px;
  }

  &.card-dragable .btn-icon {
    width: 27px;
    height: 27px;
    background: var(--pallete-background-default);
    border-radius: 5px;
    border: 1px solid var(--pallete-colors-border);
    margin: 0 0 0 12px;
    position: relative;
    color: var(--pallete-text-main-250);
    cursor: pointer;
  }

  &.card-dragable .btn-icon.trash svg {
    width: 15px;
    height: 15px;
    position: relative;
    top: -3px;
    left: 5px;
  }

  &.card-dragable .btn-icon.edit svg {
    width: 20px;
    text-align: center;
    height: 20px;
    position: relative;
    top: -3px;
    left: 2px;
  }

  &.card-dragable:hover {
    box-shadow: none;
  }

  &.card-dragable.active {
    color: #e51075;
    background-color: #f4f6f9;
  }

  &.card-dragable.active .icon {
    background-color: #e51075;
    color: white;
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 100%;
  }

  &.card-dragable .btn-icon:hover {
    color: white;
    background: var(--pallete-primary-main);
  }
  &.card-dragable::before {
    background-color: var(--pallete-primary-main);
  }
  .toggle-switch {
    margin-right: 6px;
  }
  .button {
    + .button {
      margin-left: 6px;
    }
  }

  ${(props) =>
    props.showProgress &&
    css`
      .card-container:before {
        position: absolute;
        width: calc(${props.completed}% - 20px);
        left: 10px;
        bottom: 0;
        height: 1px;
        content: '';
        background-color: var(--pallete-primary-main);
        transition: all 0.5s ease;
      }
    `}

  @media (max-width: 480px) {
    &.card-dragable .card--title {
      font-size: 14px;
    }

    &.card-dragable .drag-dots {
      margin-right: 5px;
    }
  }
`;

interface Props {
  _id?: string;
  index?: number;
  isActive?: boolean;
  title?: string;
  message?: string;
  outlines?: any;
  autoAddAndRemove?: boolean;
  subtitle?: ReactElement | string;
  onToggel?: Function;
  onView?: Function;
  onEdit?: Function;
  setOutline?: Function;
  tag?: string | number | React.ReactNode;
  className?: string;
  icon?: ReactElement;
  extra?: ReactElement;
  onDeleteClick?(): void;
  onCancel?(): void;
  options?: {
    toggel?: boolean;
    delete?: boolean;
    edit?: boolean;
    view?: boolean;
    download?: boolean;
    tag?: boolean;
  };
  showProgress?: boolean;
  completed?: number;
  error?: false;
  downloadUrl?: string;
  dragHandle?: boolean;
}

function DragableItem({
  _id,
  index,
  isActive = false,
  outlines,
  autoAddAndRemove = true,

  className,
  setOutline,
  icon,
  message,

  showProgress = false,
  completed = 0,

  error = false,

  dragHandle = true,
}: Props): ReactElement {
  const DragHandler = SortableHandle(() => (
    <span className="drag-dots">
      <VerticalDots />
    </span>
  ));
  const outlinesHandle = () => {
    const lastindex = outlines?.length - 1;
    if (lastindex === index) {
      return;
    } else {
      outlines.splice(index, 1);
      setOutline?.([...outlines]);
    }
    return;
  };
  return (
    <DragableCardStyle
      key={_id || index}
      className={classNames(className, 'card-dragable', {
        inactive: !isActive,
      })}
      showProgress={showProgress}
      completed={completed}
      error={error}
    >
      <div className="card-container">
        {dragHandle && <DragHandler />}
        <span className="left-section" id="stopDraging">
          {icon && (
            <div onClick={outlinesHandle} className="img-icon">
              <span className="icon">{icon}</span>
            </div>
          )}
          <div className="card--text">
            <FocusInput
              materialDesign
              value={message}
              type="textarea"
              name="description"
              onChange={(e) => {
                const msg = [...outlines];
                msg[index || 0] = e.target.value;
                if (autoAddAndRemove) {
                  if (
                    index === outlines.length - 1 &&
                    msg[index || 0].length > 0
                  ) {
                    setOutline?.([...msg, '']);
                    return;
                  }
                }
                setOutline?.(msg);
              }}
              rows={2}
            />
          </div>
          {/* {tag && showTag && <div className="card--price">{tag}</div>} */}
        </span>

        <div className="right-section"></div>
      </div>
    </DragableCardStyle>
  );
}

export default DragableItem;
