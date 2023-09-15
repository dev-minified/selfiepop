import { ArrowBack } from 'assets/svgs';
import Image from 'components/Image';
import { cloneElement, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  className?: string;
  backUrl?: string;
  showBackIcon?: boolean;
  title?: string | ReactElement | ReactNode;
  Icon?: string | ReactElement | ReactNode;
  onClick?: (e: any) => void;
  children?: ReactElement;
  icon?: string | ReactElement | ReactNode;
}

export const EditBack = ({
  className,
  backUrl,
  title,
  onClick,
  children,
  icon,
}: Props) => {
  const Icon =
    typeof icon === 'string' ? <Image src={icon} alt="header icon" /> : icon;
  return (
    <div className={`${className} edit-back`}>
      {children ? (
        cloneElement(children, { className, backUrl, title, onClick })
      ) : (
        <>
          <Link to={backUrl || ''} className="link-back" onClick={onClick}>
            <ArrowBack />
          </Link>
          <strong className="title">{title}</strong>
          {Icon && <span className="image-icon">{Icon}</span>}
          {/* <span className="link-image">
        <Eye />
      </span> */}
        </>
      )}
    </div>
  );
};

export default styled(EditBack)`
  background: var(--pallete-background-gray);
  font-size: 16px;
  line-height: 1.5;
  padding: 13px 60px 12px;
  position: relative;
  color: var(--pallete-primary-darker);
  text-align: center;
  border-bottom: 1px solid var(--pallete-colors-border);
  min-height: 51px;

  + .custom-scroll-bar,
  ~ .custom-scroll-bar {
    height: calc(100% - 50px) !important;
  }

  a {
    color: var(--pallete-primary-darker);
  }

  .title {
    font-weight: 500;
  }

  .link-back {
    line-height: 1;
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    width: 20px;
    height: 20px;

    &:before {
      background: transparent;
      width: 40px;
      height: 40px;
      content: '';
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
    }

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .link-image {
    position: absolute;
    right: 28px;
    top: 50%;
    max-width: 28px;
    transform: translate(0, -50%);

    svg {
      min-width: 20px;
    }
  }
`;
