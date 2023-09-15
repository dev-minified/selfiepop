// import { Bell } from 'assets/svgs';
import { Bell } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import Model from 'components/modal';
import Switchbox from 'components/switchbox';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import PhoneVerification from './PhoneVerification';

type Props = {
  isOpen?: boolean;
  className?: string;
  user?: any;
  loggedUser?: any;
  value?: boolean;
  error?: string;
  onSave?: (...args: any) => void | Promise<any>;
  onCancel?: (...args: any) => void;
};

function NotificationModel({
  isOpen,
  className,
  user,
  value,
  onSave,
  onCancel,
  loggedUser,
}: Props): ReactElement {
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [isChecked, setIsChecked] = useState(false);
  const [isProfileVerified, setIsProfileVerified] = useState(false);
  const { setUser, user: authUsre } = useAuth();

  const handleClose = () => {
    onCloseModel();
    onCancel?.();
  };

  useEffect(() => {
    if (isOpen) {
      onOpenModel();
      setIsChecked(!!value);
      setIsProfileVerified(!!loggedUser?.isPhoneNumberVerified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = async (isChekedd?: boolean) => {
    onCloseModel();
    onSave?.(isChekedd || isChecked);
  };

  const handleSubmitnumber = async (isChecked?: boolean, phone?: string) => {
    setIsChecked(true);
    setUser({
      ...authUsre,
      isPhoneNumberVerified: true,
      isPhoneNumberSkip: false,
      phone: phone,
      phoneNumber: phone,
    });
    handleSave(true);
  };
  return (
    <Model
      className={className}
      isOpen={isOpenModel}
      title={
        <span className="title-holder user_notification">
          <span className="title-icon"> {<Bell />} </span>
          <span className="title-text">{'TEXT NOTIFICATIONS'}</span>
        </span>
      }
      showFooter={false}
      onClose={handleClose}
    >
      <div>
        <div className="mb-20 img_section">
          <AvatarStatus
            imgSettings={{
              onlyDesktop: true,
            }}
            fallbackUrl={'/assets/images/default-profile-img.svg'}
            src={user?.profileImage || '/assets/images/default-profile-img.svg'}
          />
          <div className="user-info">
            <strong className="name">{`${
              user?.pageTitle ?? 'Incognito User'
            }`}</strong>
            <span className="user-name">@{user?.username}</span>
          </div>
        </div>
        {isProfileVerified ? (
          <>
            <div className="notification_handler">
              <span className="bar-title">Text Notifications: </span>
              <Switchbox
                status={false}
                size="small"
                value={isChecked}
                onChange={(e: any) => {
                  setIsChecked(e.target.checked);
                }}
              />
              <span className={`check-status ${isChecked ? 'checked' : ''}`}>
                {isChecked ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="action_buttons">
              <Button
                shape="round"
                className="btn-note"
                size="small"
                onClick={handleClose}
              >
                CANCEL
              </Button>

              <Button
                shape="round"
                className="btn-note"
                size="small"
                onClick={() => handleSave()}
              >
                SAVE
              </Button>
            </div>
          </>
        ) : (
          <PhoneVerification
            loggedUser={loggedUser}
            seller={user}
            phone={loggedUser?.phone || loggedUser?.phoneNumber}
            onSubmit={handleSubmitnumber}
          />
        )}
      </div>
    </Model>
  );
}
export default styled(NotificationModel)`
  max-width: 493px;
  /* overflow: hidden; */
  .modal-header {
    border: none;
    padding: 20px 24px 0;
    color: #252631;

    .title-icon {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      width: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .title-text {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
  }

  .modal-body {
    padding: 17px 24px;
  }

  .modal-content {
    border-radius: 6px;
  }

  .img_section {
    display: flex;
    align-items: center;
    margin: 0 0 34px;

    .user-image {
      width: 50px;
      height: 50px;
    }

    .user-info {
      padding: 0 0 0 13px;
      flex-grow: 1;
      flex-basis: 0;
    }

    .name {
      display: block;
      font-size: 20px;
      line-height: 24px;
      color: #252631;
      font-weight: 500;
    }

    .user-name {
      display: block;
      color: #778ca2;
      font-size: 14px;
      line-height: 17px;
    }
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    margin: 0 -10px 0 0;

    .button {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  .notification_handler {
    background: rgba(196, 196, 196, 0.15);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    margin: 0 0 23px;
    font-weight: 400;

    .bar-title {
      margin: 0 20px 0 15px;
    }

    .check-status {
      margin: 0 0 0 10px;
      min-width: 40px;
      color: #a3a3a3;
      font-weight: 500;
      &.checked {
        color: #1da1f3;
      }
    }

    .toggle-switch input:checked + .switcher {
      background: #255b87 !important;
    }

    /* .toggle-switch {
      input {
        &:checked {
          + .switcher {
            background: #a27fa6;
          }
        }
      }
    } */

    .switcher {
      background: rgba(199, 179, 201, 0.44) !important;

      &:before {
        background: #fff !important;
      }

      .sp_dark & {
        /* background: #000 !important; */
      }
    }
  }

  .btn-note {
    color: #357ea9;
    text-transform: uppercase;
    background: transparent;
    padding: 3px 10px;

    &:hover {
      color: #fff;
    }

    &.button-sm {
      padding: 3px 10px;
    }

    svg {
      width: 14px;
    }
  }
`;
