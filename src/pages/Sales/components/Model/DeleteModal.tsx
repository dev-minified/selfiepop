import { RecycleBin } from 'assets/svgs';
import Modal from 'components/modal';
import Button from 'components/NButton';
import styled from 'styled-components';
type DeleteModelProps = {
  onClick?: (...args: any[]) => void;
  title?: string;
  subTitle?: string;
  className?: string;
  onClose?: (...args: any[]) => void;
  isOpen?: boolean;
};
function DeleteModal({
  onClick,
  className,
  onClose,
  isOpen,
}: DeleteModelProps) {
  return (
    <div>
      <Modal
        isOpen={!!isOpen}
        onClose={onClose}
        showFooter={false}
        className={`${className}`}
        title={
          <>
            <span className="img-title img-delete">
              <RecycleBin />
            </span>{' '}
            {'Delete Post'}
          </>
        }
      >
        <div className="modal-content-holder">
          <p>Are you sure you want to delete this post?</p>
          <div className="text-right">
            <Button
              size="small"
              onClick={onClose}
              type="text"
              className="button-close"
            >
              CANCEL
            </Button>
            <Button size="small" type="text" onClick={onClick}>
              YES, DELETE
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default styled(DeleteModal)`
  max-width: 322px;

  .modal-content {
    padding: 25px 20px;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 0;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: var(--pallete-text-main-550);
  }

  .button {
    &.button-sm {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 10px;
      color: #000;
      border: none;

      &:hover {
        background: var(--pallete-primary-main);
        color: #fff;
        border: none;
      }

      &.button-close {
        color: rgba(0, 0, 0, 0.4);

        &:hover {
          color: #fff;
        }
      }
    }
  }
`;
