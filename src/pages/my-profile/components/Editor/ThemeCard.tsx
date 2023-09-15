import classNames from 'classnames';
import Image from 'components/Image';
import NewButton from 'components/NButton';
import React from 'react';
import styled from 'styled-components';
import { Edit, Plus, RecycleBin, Star } from '../../../../assets/svgs';

interface IThemeCardProps {
  cardText?: string;
  title?: string;
  create?: boolean;
  image?: string;
  showFooter?: boolean;
  footerIcons?: {
    edit?: boolean | string;
    add?: boolean;
    delete?: boolean;
    apply?: { loading: boolean; disabled: boolean };
  };
  showRemoveIcon?: boolean;
  cardIcon?: React.ReactNode;
  gradient?: string;
  selected?: boolean;
  onClick?: Function;
  onEditClick?: Function;
  onAddClick?: Function;
  onApplyClick?: Function;
  onDeleteClick?: any;
  className?: string;
  rendering?: boolean;
  fallbackUrl?: string;
}

const ThemeCard = (props: IThemeCardProps) => {
  const {
    className,
    cardText,
    title,
    create = false,
    image,
    footerIcons = { edit: true, add: true },
    showRemoveIcon = false,
    showFooter = true,
    cardIcon,
    gradient,
    selected = false,
    onClick,
    onEditClick,
    onAddClick,
    onDeleteClick,
    rendering = false,
    onApplyClick,
    fallbackUrl = '',
  } = props;
  const handleClick = (e: any) => {
    onClick && onClick(e);
  };

  return (
    <div className={classNames('theme-card-container', className)}>
      <div
        className={`theme-card-border ${selected && 'selected'}`}
        onClick={handleClick}
      >
        <div className={`theme-card ${create && 'create'}`}>
          {create ? (
            <div className="theme-card-inner">
              {cardIcon && <div className="theme-card-icon">{cardIcon}</div>}
              <div className="theme-card-text">
                <h6>{cardText}</h6>
              </div>
            </div>
          ) : rendering ? (
            <div className="theme-card-inner card-rendering">
              <img
                src={'/assets/images/theme-rendering.png'}
                className="loading-image"
                alt="theme rendering"
              />
              <div className="card-rendering-text">
                <div>
                  <div className="theme-card-icon loader-icon">
                    <Star
                      primaryColor="#fff"
                      secondaryColor="var(--colors-indigo-200)"
                    />
                  </div>
                  <div className="theme-card-text">
                    <h6 className="loader-heading">
                      Generating <br />
                      Theme
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="theme-card-image">
              {image ? (
                <Image src={image} fallbackUrl={fallbackUrl} />
              ) : gradient ? (
                <div
                  className="gradient"
                  style={{ backgroundImage: gradient }}
                />
              ) : null}
              {showRemoveIcon && (
                <div
                  className="btn-action btn-remove"
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                  ) => {
                    e.stopPropagation();
                    onDeleteClick?.();
                  }}
                >
                  <RecycleBin />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showFooter && (
        <div className="theme-card-footer">
          <h6 className="title">{title}</h6>
          {footerIcons.delete && (
            <NewButton
              type="default"
              outline
              size="x-small"
              icon={<RecycleBin />}
              onClick={() => {
                onDeleteClick?.();
              }}
            />
          )}
          {footerIcons.edit && (
            <NewButton
              type="default"
              outline
              size="x-small"
              icon={<Edit />}
              onClick={() => {
                onEditClick?.();
              }}
            />
          )}
          {footerIcons.add && (
            <NewButton
              type="default"
              outline
              size="x-small"
              icon={<Plus />}
              onClick={() => {
                onAddClick?.();
              }}
            />
          )}
          {footerIcons.apply && (
            <NewButton
              className="btn-apply"
              type="default"
              outline
              isLoading={footerIcons.apply?.loading}
              disabled={footerIcons.apply?.disabled}
              size="x-small"
              onClick={() => {
                onApplyClick?.();
              }}
            >
              Apply
            </NewButton>
          )}
        </div>
      )}
    </div>
  );
};

export default styled(ThemeCard)`
  .theme-card {
    width: 100%;
    min-height: 238px;
    border: 2px solid var(--pallete-colors-border);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .btn-apply {
    background: var(--pallete-background-default) !important;

    &:hover {
      background: var(--colors-indigo-200) !important;
    }
  }

  .theme-card:before {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    content: '';
    z-index: -1;
    border: 2px solid var(--pallete-colors-border);
    border-radius: 6px;
    display: none;
  }

  .theme-card:hover {
    border-color: var(--colors-indigo-200);
  }

  .theme-card:hover .theme-card-icon.edit {
    background: var(--colors-indigo-200);
    color: #fff;
  }

  .theme-card:hover .theme-card-icon,
  .theme-card:hover .theme-card-text {
    color: var(--colors-indigo-200);
  }

  .theme-card.create {
    padding: 5px;
    min-height: 228px;
  }

  .theme-card-inner {
    width: 100%;
    height: 100%;
    min-height: inherit;
    /* border: 1px dashed #d5dade; */
    border-radius: 8px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .theme-card-inner:before {
    z-index: -1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 2px dashed var(--pallete-colors-border);
    content: '';
    border-radius: 8px;
  }

  .theme-card-icon {
    width: 45px;
    color: var(--pallete-text-main-400);
    transition: color 0.4s ease;

    .star {
      #Layer_1 {
        fill: var(--pallete-background-default);
      }
      #Layer_2 {
        fill: var(--colors-indigo-200);
      }
    }
  }

  .theme-card-icon svg {
    width: 100%;
    height: auto;
    color: var(--colors-indigo-200);
  }

  .theme-card-icon.edit {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 10px;
    transition: background 0.4s ease;
  }

  .theme-card-icon.edit:hover {
    background: var(--colors-indigo-200);
  }

  .theme-card-icon.edit svg {
    width: 45px;
    height: auto;
  }

  .theme-card-text {
    text-align: center;
    padding: 10px 20px 0;
    font-size: 16px;
    line-height: 18px;
    transition: color 0.4s ease;
  }

  .theme-card-footer {
    padding: 13px 0 0;
    justify-content: space-between;
    display: flex;
    align-items: center;
  }

  .theme-card-footer .title {
    color: var(--colors-darkGrey-300);
    font-size: 14px;
    margin: 0;
    flex-grow: 1;

    .sp_dark & {
      color: #fff;
    }
  }

  .theme-card-footer .title:only-child {
    text-align: center;
  }

  .theme-card .theme-card-image {
    width: 100%;
    height: 100%;
    min-height: inherit;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    max-height: 240px;
  }

  .theme-card .theme-card-image img,
  .theme-card .theme-card-image .gradient {
    height: auto;
    max-height: 100%;
    object-fit: cover;
    display: block;
    margin: 0 auto;
    min-height: inherit;
    width: 100%;
  }

  .theme-card .theme-card-image .gradient {
    height: 100%;
    width: 100%;
    border-radius: 6px;
    z-index: -2;
  }
  .theme-card-footer .btn-action,
  .theme-card-image .btn-action {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .theme-card-footer .btn-action {
    color: #afacac;
    border: 1px solid var(--pallete-colors-border);
    border-radius: 3px;
    width: 28px;
    height: 28px;
    margin-left: 5px;
  }

  .theme-card-image .btn-remove {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    padding: 5px;
    width: 27px;
    height: 27px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.4s ease;
  }

  .theme-card-image .btn-remove:hover {
    background: var(--colors-indigo-200);
  }

  .theme-card-image .btn-remove svg {
    width: 14px;
    height: auto;
  }
  .theme-card-border {
    border-radius: 6px;
    position: relative;
  }

  .theme-card-border:before {
    position: absolute;
    left: -6px;
    right: -6px;
    top: -6px;
    bottom: -6px;
    content: '';
    border: 2px solid #e51075;
    border-radius: 10px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
  }

  .theme-card-border.selected:before {
    opacity: 1;
    visibility: visible;
  }

  .button + .button {
    margin-left: 6px;
  }

  .loader-icon {
    color: var(--colors-indigo-200);
    width: 56px;
    height: 56px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    position: relative;

    &:after {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      border: 3px solid var(--colors-indigo-200);
      border-top: 3px solid #fff;
      border-radius: 100%;
      width: 100%;
      height: 100%;
      animation: spin 2s linear infinite;
    }

    svg {
      width: 34px;
      height: 34px;
    }
  }

  .loader-heading {
    color: var(--colors-indigo-200);
    font-weight: 500;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
