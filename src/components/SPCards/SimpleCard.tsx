import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  title?: string | React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  classes?: { card?: string; body?: string; header?: string };
  styles?: {
    card?: React.CSSProperties;
    header?: React.CSSProperties;
    body?: React.CSSProperties;
  };
  icon?: string | React.ReactElement;
  className?: string;
  subtitle?: string;
}

const SectionStyle = styled.div`
  &.rc-card-header-large {
    > .rc-card-header {
      align-items: center;
      .icon {
        width: 54px;
        height: 54px;
        background: none;
        border: 2px solid var(--pallete-colors-border);

        svg {
          width: 34px;
          height: auto;
        }
      }

      .rc-card-title {
        font-size: 20px;
        line-height: 24px;
      }

      .rc-card-sub-title {
        font-size: 13px;
        color: var(--pallete-text-main-500);
      }
    }
  }
  .rc-card-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    color: rgba(#000, 0.68);
    margin: 0 0 20px;

    .icon {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-darker);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      overflow: hidden;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .card-section-right {
      flex-grow: 1;
      flex-basis: 0;
      padding: 0 0 0 10px;
    }

    .rc-card-title {
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      color: var(--pallete-text-main);
      margin: 0 0 3px;
    }
  }
`;

export function CardSection({
  children,
  header,
  extra,
  title,
  subtitle,
  icon,
  className,
}: Props): ReactElement {
  const iClass = classNames(className, 'card-section', {
    has__icon: icon,
    has_extra: extra,
    has_subtitle: subtitle,
  });
  return (
    <SectionStyle className={iClass}>
      {header || (
        <div className="rc-card-header">
          {icon && (
            <span className="icon">
              {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
            </span>
          )}
          <div className="card-section-right">
            <div className="rc-card-title">{title}</div>
            {subtitle && <div className="rc-card-sub-title">{subtitle}</div>}
            {extra && <div className="right">{extra}</div>}
          </div>
        </div>
      )}
      {children}
    </SectionStyle>
  );
}

export default function SimpleCard({
  showHeader = true,
  title,
  header,
  classes = {},
  showFooter,
  extra,
  styles = {},
  children,
}: Props): ReactElement {
  const { card: cardClass, body: bodyClass, header: headerClass } = classes;
  const { card: cardStyle, header: headerStyle, body: bodyStyle } = styles;
  return (
    <div className={`card ${cardClass}`} style={cardStyle}>
      {showHeader && (
        <div className={`card-header ${headerClass}`} style={headerStyle}>
          <div className="rc-card-header">
            {header ? header : <div className="rc-card-title">{title}</div>}
            <div className="right">{extra}</div>
          </div>
        </div>
      )}

      <div className={`card-body-wrapper ${bodyClass}`} style={bodyStyle}>
        {children}
      </div>

      {showFooter && <div className="card-footer text-muted">{showFooter}</div>}
    </div>
  );
}
