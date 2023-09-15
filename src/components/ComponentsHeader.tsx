import { ArrowBack } from 'assets/svgs';
import { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Image from './Image';

interface Props {
  title?: string | ReactElement | ReactNode;
  icon?: string | ReactElement | ReactNode;
  backUrl?: string;
  className?: String;
  onClick?: (e: any) => void;
  altArrow?: boolean;
  centertitle?: boolean;
}

const ComponentsHeader = ({
  title,
  icon,
  className,
  backUrl,
  onClick,
  altArrow,
  centertitle = false,
}: Props) => {
  const Icon =
    typeof icon === 'string' ? <Image src={icon} alt="header icon" /> : icon;
  return (
    <div className={`${className} slide-header`}>
      <div className="title-holder">
        {backUrl && !altArrow && (
          <Link to={backUrl as string} className="link-back" onClick={onClick}>
            <ArrowBack />
          </Link>
        )}
        {backUrl && altArrow && (
          <span className="link-back" onClick={onClick}>
            <ArrowBack />
          </span>
        )}
        {title && !centertitle && <strong className="title">{title}</strong>}
      </div>
      {title && centertitle && (
        <strong className="title centertitle">{title}</strong>
      )}
      {Icon && <span className="image-icon">{Icon}</span>}
    </div>
  );
};

export default styled(ComponentsHeader)`
  background: var(--pallete-background-default);
  padding: 6px 17px;
  border-bottom: 1px solid var(--pallete-colors-border);
  border-right: 1px solid var(--pallete-colors-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 16px;
  color: var(--pallete-primary-darker);
  min-height: 50px;
  position: relative;
  z-index: 2;

  @media (max-width: 767px) {
    border-right: none;
  }

  .mobile_view & {
    border-right: none;
  }

  .sp_dark & {
    color: rgba(255, 255, 255, 0.6);
  }

  .link-back {
    color: var(--pallete-primary-darker);
    cursor: pointer;

    .sp_dark & {
      color: var(--pallete-text-main);
    }

    svg {
      width: 15px;
      height: auto;
      margin: 0 15px 0 0;
    }
  }

  .title-holder {
    display: flex;
    align-items: center;

    .sp_dark & {
      color: var(--pallete-text-main);
    }

    .title {
      font-weight: 400;
    }
  }

  .title {
    font-weight: 600;

    a {
      color: var(--pallete-primary-darker);

      .sp_dark & {
        color: var(--pallete-text-main);
        /* opacity: 0.6; */
      }

      .user-profile-preifx {
        opacity: 0.6;
      }
    }
  }
  .sp_dark & .centertitle {
    color: var(--pallete-text-main);
  }
  .slide-header-text {
    font: 600 14px/16px 'Roboto', sans-serif;
  }

  .image-icon {
    &:hover {
      .sp_dark & {
        color: var(--pallete-text-main);
      }
    }
  }
`;
