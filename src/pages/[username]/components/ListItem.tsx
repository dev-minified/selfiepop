import { GetPopIcon } from 'appconstants';
import classNames from 'classnames';
import Image from 'components/Image';

import { ServiceType } from 'enums';
import { ReactElement, ReactNode } from 'react';
import styled, { withTheme } from 'styled-components';

interface Props {
  title: string | ReactNode;
  icon?: string;
  fallbackUrl?: string;
  onClick?: any;
  theme?: ITheme;
  type?: ServiceType;
  showIcon?: boolean;
  className?: string;
  linkType?: string;
  isLoading?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

const StyledListItem = styled.a`
  position: relative;
  display: block;
  font-size: 22px;
  line-height: 26px;
  color: var(--pallete-text-main);
  background-color: var(--pallete-background-gray-lighter);
  padding: 5px 83px;
  text-align: center;
  min-height: 60px;
  display: flex;
  // height: 70px;

  @media (max-width: 767px) {
    padding: 5px 60px;
    font-size: 18px;
    line-height: 21px;
    min-height: 52px;
  }

  .btn-wrap {
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .social--icon {
    background: none;
  }
  ${({ theme }) =>
    ` background: ${theme?.button?.buttonColor};
     color: ${theme?.button?.textColor};
     border: 2px solid ${theme?.button?.outlineColor};
    `}

  ${({ theme }) => {
    if (theme?.button?.style?.includes('soft-square')) {
      return `
        border-radius: 4px;
      `;
    }
    if (theme?.button?.style?.includes('circule')) {
      return `
        border-radius: 35px;
      `;
    }
  }}

  ${({ theme }) => {
    if (theme?.button?.style?.includes('soft-shadow')) {
      return `
        box-shadow: 4px 4px 4px ${theme?.button?.shadowColor}; ;
      `;
    }
    if (theme?.button?.style?.includes('hard-shadow')) {
      return `
        box-shadow: 4px 4px 0 ${theme?.button?.shadowColor};
      `;
    }
  }}


  // icon setting
  .btn-wrap > span {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translate(0, -50%);
    margin: 0;
    border-radius: 0;
    border: none;
    overflow: hidden;

    @media (max-width: 767px) {
      left: 11px;
    }

    svg {
      @media (max-width: 767px) {
        width: 40px;
        height: 40px;
      }
    }

    ${({ theme }) => {
      if (theme?.button?.style?.includes('soft-square')) {
        return `
          border-radius: 4px;
        `;
      }
      if (theme?.button?.style?.includes('circule')) {
        return `
          border-radius: 100%;
        `;
      }
    }}
  }

  img {
    border-radius: 0;
  }

  &:hover {
    background: #f3f3f3;
    ${({ theme }) =>
      `
        background: ${theme?.button?.buttonRollOverColor};
        color: ${theme?.button?.textRollOverColor};
        border-color: ${theme?.button?.outlineRollOverColor};
      `}

    ${({ theme }) => {
      if (theme?.button?.style?.includes('soft-shadow')) {
        return `
          box-shadow: 4px 4px 4px ${theme?.button?.shadowRollOverColor};
        `;
      }
      if (theme?.button?.style?.includes('hard-shadow')) {
        return `
          box-shadow: 4px 4px 4px ${theme?.button?.shadowRollOverColor};
        `;
      }
    }}
  }
`;

export function ListItem({
  title,
  icon,
  onClick,
  type,
  fallbackUrl,
  theme,
  className,
  linkType,
  disabled,
  ...rest
}: Props): ReactElement {
  const { additional } = theme || {};
  const { showIcon = true, onContextMenu = null } = rest;

  return (
    <StyledListItem
      className={classNames(`profile-btn mb-10 mb-md-15 ${className} `, {
        [`pop-${type}`]: type,
        [`disabled`]: disabled,
      })}
      onClick={!disabled ? onClick : () => {}}
      {...(onContextMenu ? { onContextMenu } : {})}
    >
      <div className="btn-wrap">
        {showIcon && (
          <span className={`social--icon social_links social-icon_${linkType}`}>
            {!!icon ? (
              linkType ? (
                <GetPopIcon
                  type={linkType}
                  primaryColor={additional?.iconPrimaryColor}
                  secondaryColor={additional?.iconSecondaryColor}
                />
              ) : (
                <Image src={icon} fallbackUrl={fallbackUrl} />
              )
            ) : (
              <div>
                <GetPopIcon
                  type={type}
                  primaryColor={additional?.iconPrimaryColor}
                  secondaryColor={additional?.iconSecondaryColor}
                />
              </div>
            )}
          </span>
        )}
        {title}
      </div>
    </StyledListItem>
  );
}

export default withTheme(styled(ListItem)``);
