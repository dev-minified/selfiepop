// import NewButton from 'components/NButton';
import { ChevronRight, SmileIcon } from 'assets/svgs';
import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  title: string;
  Icon?: ReactElement | ReactNode;
  ArrowIcon?: ReactElement | ReactNode;
  onClickTab: Function;
  isShow?: boolean;
  className?: string;
  UnReadCount?: number;
  showUnRead?: boolean;
  value?: Record<string, any>;
  extra?: React.ReactNode;
}

function SliderTab({
  onClickTab,
  title,
  UnReadCount = 0,
  showUnRead = false,
  Icon,
  className,
  extra,
}: Props): ReactElement {
  return (
    <>
      <div className={className}>
        <ul className={`list-course-detail`}>
          <li
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClickTab(e);
            }}
          >
            <div className="link-item">
              <div className="img-link">{Icon}</div>
              <div className="link-item-wrap">
                <div className="title-text">{title}</div>
                {showUnRead && (
                  <div className="unread-msg">
                    <SmileIcon />
                    <span className="number">{UnReadCount}</span>
                  </div>
                )}
              </div>
              {extra && <span className="extra-content">{extra}</span>}
              <span className="img-arrow">{<ChevronRight />}</span>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
export default styled(SliderTab)`
  &.edit-library {
    .list-course-detail {
      .img-link {
        background: var(--pallete-primary-main);
        color: #fff;
        padding: 8px;
      }

      .img-arrow {
        display: none;
      }
    }
  }
  .list-course-detail {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 18px;
    line-height: 22px;
    color: var(--pallete-text-main);
    font-weight: 400;

    li {
      border-bottom: 1px solid var(--pallete-colors-border);
    }

    .link-item {
      padding: 15px 75px 15px 70px;
      min-height: 60px;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      transition: all 0.4s ease;
      background: var(--pallete-background-default);

      @media (max-width: 767px) {
        padding: 15px 45px 15px 65px;
      }

      &:hover {
        background: var(--pallete-background-secondary);
      }
    }

    .img-link {
      width: 36px;
      height: 36px;
      position: absolute;
      left: 17px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pallete-primary-main);
      border-radius: 100%;

      @media (max-width: 767px) {
        left: 15px;
      }

      img,
      svg {
        max-width: 100%;
        height: auto;

        path {
          fill: currentColor;
        }
      }
    }

    .img-arrow {
      width: 10px;
      border-radius: 100%;
      color: #cfcfd4;
      position: absolute;
      right: 21px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 767px) {
        right: 15px;
      }

      svg {
        width: 100%;
        height: auto;
      }
    }

    .unread-msg {
      background: var(--pallete-background-gray-secondary-200);
      border-radius: 6px;
      padding: 7px 10px;
      color: var(--pallete-text-secondary);
      font-size: 18px;
      line-height: 21px;

      svg {
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px 0 0;
      }

      .number {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  .card-header-box {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2857;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 25px;

    .header-image {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-main);
      color: #e5e5e5;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      color: var(--pallete-text-main);
      font-size: 15px;
    }

    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 12px;
    }

    p {
      margin: 0;
    }
  }

  .sortable {
    margin: 0;
  }

  .pop-card-alt {
    border: none;

    .card-dragable {
      background: var(--pallete-background-default);

      .sp_dark & {
        background: var(--pallete-background-primary-100);
      }

      &:after {
        border-color: #d9d2da;
      }
    }
  }
`;
