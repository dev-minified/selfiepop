import { Notes } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import Button from 'components/NButton';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
type User = {
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
};
type Props = {
  isOpen?: boolean;
  className?: string;
  user?: User;
  onSave?: (...args: any) => void;
  error?: string;
  onCancel?: (...args: any) => void;
};

function UserNotesModel({
  isOpen = false,
  className,
  onSave,
  onCancel,
}: Props): ReactElement {
  const [note, setNote] = useState<string>();

  const handleClose = () => {
    onCancel?.();
  };

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave?.(note);
  };

  return (
    <Model
      className={`modal-popups ${className}`}
      isOpen={isOpen}
      title={
        <span className="title-holder user_name">
          <span className={`title-icon`}>{<Notes />}</span>
          <span className="title-text">Add a Note</span>
        </span>
      }
      showFooter={false}
      onClose={handleClose}
    >
      <div>
        <div>
          <FocusInput
            label={
              <span>
                <span className="text-capitalize">Your Note...</span>
              </span>
            }
            inputClasses="mb-20"
            id="description"
            name="description"
            type="textarea"
            rows={6}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            value={note}
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
export default styled(UserNotesModel)`
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
