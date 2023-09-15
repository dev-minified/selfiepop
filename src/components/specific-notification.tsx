import { IDVerificationStatuses } from 'appconstants';
import Button from 'components/NButton';
import { useAppSelector } from 'hooks/useAppSelector';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayout';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import 'styles/notification-bar.css';
import { setChatLayoutHeight } from 'util/index';
import { sendEmailVerificationLink, update } from '../api/User';
import useAuth from '../hooks/useAuth';
import InvitationStatus from './Model/InvitationStatus';
import StripeVerificationId from './StripeIdVerification';
import { toast } from './toaster';
const NoticationBarWrapper = styled.div<{ bg: string }>`
  ${({ bg }) => {
    if (bg) {
      return css`
        background: ${bg} !important;
        text-align: center;
      `;
    }
    return '';
  }}
`;
const ReactFuncation: React.FC<any> = ({
  isOpen: open,
  onClose,
  user: u,
  isPublicPage,
  className,
}) => {
  const history = useHistory();
  const { setUser: setUserContext } = useAuth();

  const [emailSend, setEmailSend] = useState<string | undefined>('Resend');
  const [disableButton, setDisableButton] = useState(false);
  const [user, setUser] = useState(u);
  const eventInfo = useAppSelector((state) => state.eventSlice.attendieInfo);
  useEffect(() => {
    setUser(u);
  }, [u]);
  const handleClose = () => {
    onClose();

    setTwoPanelLayoutHeight();
    setChatLayoutHeight({ id: 'chat-layout' });
  };

  const ActivateProfile = async () => {
    await update({ isActiveProfile: true }).then(() => {
      setUserContext({ ...user, isActiveProfile: true });
      setUser({ ...user, isActiveProfile: true });
      history.push(`/${user.username}`);
    });
  };
  const goToEditProfile = async () => {
    handleClose();
    history.push('/my-profile');
  };
  const sentVerificationLink = async () => {
    setEmailSend('Sending');
    try {
      await sendEmailVerificationLink(user.email);

      setEmailSend('Sent');
      setDisableButton(true);
      setTimeout(() => {
        setEmailSend('Resent');
        setDisableButton(false);
      }, 30000);
    } catch (error: any) {
      setEmailSend('Resent');
      setDisableButton(false);
      if (error?.message) {
        if (error?.message.trim() === 'This user Already Verified') {
          toast.error('Email already verified!');
          setUserContext({ ...user, isEmailVerified: true });
          setUser({ ...user, isEmailVerified: true });
          if (user?.userSetupStatus > 9) {
            handleClose();
          }
        }
      }
    }
  };
  const handleSuccess = () => {
    setUserContext({
      ...user,
      idVerificationStatus: IDVerificationStatuses.processing,
    });
    setUser({
      ...user,
      idVerificationStatus: IDVerificationStatuses.processing,
    });
  };
  const {
    message,
    buttonText,
    onButtonClick,
    showCloseButton,
    showLink,
    type,
    showEmailLinks,
    showOkButton = true,
    showVerificationButton = false,
    showinfoIcon = true,
    bg = '',
  }: any = InvitationStatus(user, {
    goToEditProfile,
    ActivateProfile,
    isPublicPage,
    handleClose,
    button: sentVerificationLink,
    emailSent: emailSend,
    eventInfo,
  });

  const isDefault = type === 'default';
  const HandleBtn = () => {
    if (onButtonClick) onButtonClick();
  };

  return (
    <div className={`${className} ${open ? 'N-bar show' : 'N-bar m-close'}`}>
      <NoticationBarWrapper
        className={`notification-bar info ${!isDefault && 'bordered'} `}
        bg={bg}
      >
        <div
          className={`${
            isDefault && 'container sm-container'
          } d-flex justify-content-center justify-content-md-between align-items-center flex-wrap flex-md-nowrap`}
        >
          <div
            className={`notification-bar__left-box text-center  ${
              bg ? 'w-100' : 'text-md-left'
            }`}
          >
            {showCloseButton && (
              <span onClick={handleClose} className="notification-bar__close">
                <i className="icon icon-close"></i>
              </span>
            )}
            {showinfoIcon ? (
              <span className="notification-bar__title">
                <div className="icon icon-info"></div>
              </span>
            ) : null}
            {message}{' '}
            {showLink && (
              <Link to="/my-profile">
                <span>Click here to go to your dashboard.</span>
              </Link>
            )}
          </div>
          <div className="top_banner_actions">
            {!showVerificationButton ? (
              <>
                {showEmailLinks ? (
                  <Button
                    className="btn-bar btn-inverse"
                    onClick={() => {
                      history.push('/account');
                    }}
                  >
                    <span>Change email</span>
                  </Button>
                ) : null}
                {showOkButton && (
                  <Button
                    onClick={HandleBtn}
                    className="btn-bar"
                    disabled={disableButton}
                  >
                    {buttonText ? buttonText : 'OK'}
                  </Button>
                )}
              </>
            ) : (
              <StripeVerificationId
                buttonTitle={buttonText}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </NoticationBarWrapper>
    </div>
  );
};

export default styled(ReactFuncation)`
  .btn-bar {
    color: white;
    min-width: 128px;

    @media (max-width: 767px) {
      min-width: 110px;
    }

    &.btn-inverse {
      &:not(:hover) {
        background: var(--pallete-background-default);
        color: var(--pallete-primary-main);

        .sp_dark & {
          background: #333;
          color: #fff;
        }
      }
    }
  }
`;
