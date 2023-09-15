// import { Announcement } from 'assets/svgs';
import { Announcement } from 'assets/svgs';
import Button from 'components/NButton';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import AvatarStatus from '../AvatarStatus';
type User = {
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
  pageTitle?: string;
};
type Props = {
  isOpen?: boolean;
  className?: string;
  user?: User;
  value?: string;
  onSave?: (...args: any) => void;
  error?: string;
  onCancel?: (...args: any) => void;
};

function UserShoutModel({
  isOpen,
  className,
  user,

  error,
  onSave,
  value,
  onCancel,
}: Props): ReactElement {
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [name, setName] = useState(value);
  const handleClose = () => {
    onCloseModel();
    onCancel?.();
  };

  useEffect(() => {
    if (isOpen) {
      onOpenModel();
      setName(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = () => {
    onCloseModel();

    onSave?.(name);
  };
  return (
    <Model
      className={`modal-popups ${className}`}
      isOpen={isOpenModel}
      title={
        <span className="title-holder user_name">
          <span className={`title-icon`}>{<Announcement />}</span>
          <span className="title-text">{'USER NICKNAME'}</span>
        </span>
      }
      showFooter={false}
      onClose={handleClose}
    >
      <div>
        <div className="img_section">
          <AvatarStatus
            imgSettings={{
              onlyMobile: true,
            }}
            src={user?.profileImage || '/assets/images/default-profile-img.svg'}
            fallbackUrl={'/assets/images/default-profile-img.svg'}
          />
          <div className="user-info">
            <strong className="name">
              {!!value ? value : `${user?.pageTitle ?? 'Incognito User'}`}
            </strong>
            <span className="user-name">@{user?.username}</span>
          </div>
        </div>
        <div>
          <FocusInput
            onChange={(e) => {
              setName(e.target.value);
            }}
            error={error}
            label="User Nickname"
            inputClasses="mb-25"
            name="username"
            value={name}
            materialDesign
          />
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
            onClick={handleSave}
          >
            SAVE
          </Button>
        </div>
      </div>
    </Model>
  );
}
export default styled(UserShoutModel)`
  max-width: 493px;

  .modal-header {
    border: none;
    padding: 20px 24px 0;

    .title-icon {
      margin: 0 15px 0 0;
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
    /* color: #c30585; */
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

  .btn-note {
    text-transform: uppercase;
    background: transparent;
    color: #357ea9;
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
