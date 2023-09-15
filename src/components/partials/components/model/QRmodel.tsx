import { ArrowBack, ArrowRight, QRIcon } from 'assets/svgs';
import Model from 'components/modal';
import NewButton from 'components/NButton';
import QrCodeGenrator from 'components/QrCodeGenrator';
import SelfiepopText from 'components/selfipopText';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
dayjs.extend(utc);

type IQRmodel = {
  className?: string;
  isOpen: boolean;
  userProfileLink?: string;
  link?: string;
  onClose?: (...args: any[]) => void;
  cbSubmit?: (...args: any[]) => void;
};
const QRmodel = ({
  className,
  isOpen,
  onClose,
  link,
  userProfileLink,
}: IQRmodel) => {
  const [view, setView] = useState('0');
  const [isCopied, copy] = useCopyToClipBoard();
  const [isCopy, setIsCopy] = useState(false);
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <div className={className}>
      <Model
        className={className}
        isOpen={isOpen}
        title={
          <div className="title-holder user_list">
            {view === '1' && (
              <div onClick={() => setView('0')} className="btn-back">
                <ArrowBack />
              </div>
            )}
            <span className="title-area">
              <span className="title-text">
                {view === '1' ? (
                  'QR Code'
                ) : (
                  <>
                    Share your <SelfiepopText />
                  </>
                )}
              </span>
              <span className="title-detail">
                {view === '1' ? (
                  <>
                    Here is your unique <SelfiepopText /> QR code that will
                    direct people to your <SelfiepopText /> public profile when
                    scanned.
                  </>
                ) : (
                  <>
                    Get more visitors by sharing your <SelfiepopText />.
                  </>
                )}
              </span>
            </span>
          </div>
        }
        showFooter={false}
        onClose={handleClose}
      >
        <div className="qr-options-area">
          {view === '0' && (
            <>
              <div className="qr_badge" onClick={() => setView('1')}>
                <div className="img-icon">
                  <QRIcon />
                </div>
                <span className="text">
                  My <SelfiepopText /> QR code
                </span>
                <span className="img-arrow">
                  <ArrowRight />
                </span>
              </div>
              <Link
                to={`/${userProfileLink}`}
                target="_blank"
                className="user-link-copy"
              >
                <span className="img-icon">
                  <i className="icon-star1"></i>
                </span>
                <span className="user-link">
                  selfiepop.com/<strong>{userProfileLink}</strong>
                </span>
                <NewButton
                  className={`${isCopied && isCopy ? 'link_copied' : 'color'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCopy(true);
                    copy(link);
                    toast.info('Copied the url');
                    setTimeout(() => {
                      setIsCopy(false);
                    }, 6000);
                  }}
                  outline
                  size="small"
                  shape="round"
                >
                  {isCopied && isCopy ? 'Copied' : 'Copy'}
                </NewButton>
              </Link>
            </>
          )}
          {view === '1' && (
            <>
              <QrCodeGenrator userProfileLink={userProfileLink} link={link} />
            </>
          )}
        </div>
      </Model>
    </div>
  );
};

export default styled(QRmodel)`
  max-width: 371px;
  .link_copied {
    background: var(--pallete-primary-main) !important;
    color: white !important;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    margin: 0;
  }

  .modal-content {
    padding: 15px;
  }

  .modal-header {
    padding: 0 0 18px;
    justify-content: center;
    position: relative;
  }

  .modal-body {
    padding: 15px 0 0;
  }

  .modal-title {
    text-align: center;
    position: relative;

    .title-text {
      display: block;
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 500;
      margin: 0 0 11px;
    }

    .title-detail {
      display: block;
      font-size: 14px;
      line-height: 18px;
      color: #626263;
    }
  }

  .qr_badge {
    position: relative;
    padding: 17px 80px 17px 50px;
    border: 2px solid transparent;
    background: #f5f5f6;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    transition: all 0.4s ease;
    cursor: pointer;
    margin: 0 0 12px;
    border-radius: 8px;

    .sp_dark & {
      background: #f5f5f6;
    }

    &:hover {
      /* background: var(--pallete-background-gray); */
      border-color: var(--pallete-primary-main);
    }

    .img-icon {
      position: absolute;
      width: 32px;
      left: 5px;
      top: 50%;
      transform: translate(0, -50%);

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .img-arrow {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
      width: 8px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .user-link-copy {
    position: relative;
    padding: 15px 80px 15px 50px;
    border: 2px solid #d3dee7;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    transition: all 0.4s ease;
    cursor: pointer;
    border-radius: 8px;
    color: var(--pallete-text-main-350);
    display: block;

    &:hover {
      .button {
        background: var(--pallete-primary-main);
        border-color: var(--pallete-primary-main);
        color: #fff;
      }
    }

    .img-icon {
      position: absolute;
      width: 32px;
      left: 5px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        font-size: 18px;
      }
    }

    .button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translate(0, -50%);
      min-width: 54px;
      padding: 4px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .user-link {
      display: inline-block;
      vertical-align: top;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #626263;
      max-width: 100%;

      strong {
        color: #000;
      }
    }
  }

  .btn-back {
    position: absolute;
    left: 0;
    top: 0;
    width: 18px;
    cursor: pointer;

    &:hover {
      color: var(--pallete-primary-darker);
    }

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .qr-container__qr-code {
    width: 184px;
    margin: 0 auto 15px;

    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .header-link-area__link-holder {
    text-align: center;
    display: inline-block;
    vertical-align: top;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #626263;
    max-width: 100%;

    strong {
      color: #000;
    }
  }

  .user-link-area {
    text-align: center;
    font-size: 13px;
    line-height: 15px;
    font-weight: 400;
    margin: 0 0 18px;

    .img-icon {
      font-size: 14px;
      line-height: 18px;
      margin: 0 5px 0 0;
    }

    .user-link {
      display: inline-block;
      vertical-align: top;
      color: #626263;
      max-width: 100%;

      strong {
        font-weight: 400;
        color: #000;
      }
    }
  }

  .qr-container__form {
    .button:not(:hover) {
      background: #000;
      border-color: #000;
      color: #fff;

      /* .sp_dark & {
        background: var(--pallete-background-light);
        border-color: var(--pallete-background-light);
      } */
    }
  }
`;
