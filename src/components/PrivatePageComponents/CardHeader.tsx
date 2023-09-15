import { PinSvg, VerticalDots } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { ReactElement, ReactNode, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

interface ICardHeaderProps {
  className?: string;
  showRightView?: boolean;
  title?: string | ReactElement | ReactNode | HTMLElement;
  subTitle?: ReactNode;
  img?: string;
  ontitleClick?: Function;
  onConformToDelete?: any;
  Rightside?: any;
  fallbackUrl?: string;
  isPinPost?: boolean;
  imgscreenSettings?: Record<string, any>;
  fallbackComponent?: JSX.Element;
  timeStamp?: ReactNode;
}

const CardHeader: React.FunctionComponent<ICardHeaderProps> = ({
  className,
  title = 'Mai Seohyn',
  subTitle = '4 hours ago',
  showRightView = true,
  img = '/assets/images/default-profile-img.svg',
  ontitleClick,
  Rightside,
  isPinPost = false,
  fallbackUrl,
  timeStamp = null,
  imgscreenSettings = {},
  fallbackComponent: FallbackComponent = null,
}) => {
  // const { isVisible, ref } = useDropDown(false, false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => {
    if (isVisible) {
      setIsVisible(false);
    }
  });
  const setVisbility = useCallback(
    (isVisible: boolean) => {
      setIsVisible(isVisible);
    },
    [isVisible],
  );
  return (
    <div className={className}>
      <div className="info-box">
        <div className="img">
          <ImageModifications
            imgeSizesProps={imgscreenSettings}
            src={img}
            alt="img description"
            fallbackUrl={FallbackComponent ? undefined : fallbackUrl}
            fallbackComponent={FallbackComponent}
          />
        </div>
        {(title || subTitle) && (
          <div className="text">
            {title && (
              <strong onClick={() => ontitleClick?.()} className="title">
                <>
                  {isPinPost && (
                    <span className="pin-item">
                      <PinSvg />
                    </span>
                  )}
                  {title}{' '}
                </>
              </strong>
            )}
            {subTitle && <span className="post-time">{subTitle}</span>}
          </div>
        )}
      </div>
      {timeStamp ? <span className="timestamp">{timeStamp}</span> : null}
      {showRightView && (
        <div
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible((v) => !v);
          }}
          className="options"
        >
          <VerticalDots />
          {isVisible && <Rightside setIsVisible={setVisbility} />}
        </div>
      )}
    </div>
  );
};

export default styled(CardHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 20px;

  @media (max-width: 479px) {
    padding: 0 0 15px;
  }

  .info-box {
    display: flex;
    align-items: center;

    .title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      color: var(--pallete-text-main-100);
      font-weight: 500;

      svg {
        margin: 0 0 0 8px;
        width: 16px;
        height: auto;
        display: inline-block;

        path {
          .sp_dark & {
            fill: #fff;
          }
        }
      }
    }

    .post-time {
      display: block;
      color: var(--pallete-text-main-150);
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;

      .sp_dark & {
        color: #b2b2b2;
      }
    }

    .img {
      width: 42px;
      height: 42px;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 15px 0 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .options-opener {
    display: block;
    transform: rotate(90deg);
    color: #a7b0ba;
    cursor: pointer;

    &:hover {
      color: var(--pallete-primary-main);
    }
  }
  &.dropdown-active {
    .options {
      background: #f5f8fd;
      color: var(--pallete-primary-main);
    }
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 36px;
    height: 36px;
    color: var(--pallete-primary-main);
    cursor: pointer;
    position: relative;
    z-index: 3;

    svg {
      transform: rotate(-90deg);
      color: var(--pallete-primary-main);
    }
  }

  .pin-item {
    display: inline-block;
    vertical-align: top;
    margin: 2px 5px 0 0;
    width: 14px;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
      margin: 0 !important;
    }
  }

  .actions {
    position: absolute;
    right: 0;
    top: 100%;
    width: 106px;
    border: 1px solid var(--pallete-colors-border);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    margin: 1px 0 0;
    padding: 0;
    list-style: none;
    font-size: 12px;
    line-height: 15px;
    font-weight: 500;
    color: #8d778d;
    background: var(--pallete-background-default);
    padding: 5px;
    cursor: default;

    li {
      &.delete {
        border-top: 1px solid #f0f2f6;

        .sp_dark & {
          border-top-color: transparent;
        }
      }

      .button {
        display: inline-block;
        vertical-align: top;
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

        &:hover {
          color: var(--pallete-text-secondary-100);
          background: rgba(230, 236, 245, 0.62);
        }
      }
    }
  }
`;
