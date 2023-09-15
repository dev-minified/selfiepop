// import { StarFill } from 'assets/svgs';
import { FireIcon } from 'assets/svgs';
import Button from 'components/NButton';
import Model from 'components/modal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useEffect, useState } from 'react';
import { getAllSubsCriptionSubList } from 'store/reducer/chat';
import styled from 'styled-components';
import MemberShipUpgrade from './MemberShipUpgrade';
type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;
  className?: string;
};

function FavoritesModel({ onClose, isOpen, className }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const [upgrade, setUpgrade] = useState(false);
  const handleClose = () => {
    onClose && onClose();
  };

  useEffect(() => {
    setUpgrade?.(false);
    if (isOpen) {
      dispatch(getAllSubsCriptionSubList()).catch((e) => console.log(e));
    }
  }, [isOpen]);
  const toggleUpgrade = () => {
    setUpgrade(!upgrade);
  };
  return (
    <>
      <Model
        className={className}
        isOpen={isOpen}
        title={
          <div className="title-holder user_list">
            <span className="title-area">
              <span className={`title-icon`}>{<FireIcon />}</span>
              <span className="title-text">{'MEMBERSHIP UPGRADE'}</span>
            </span>
            {/* <div className="sort_icon">{<Sort />}</div> */}
          </div>
        }
        showFooter={false}
        onClose={handleClose}
      >
        {!upgrade ? (
          <MemberShipUpgrade toggleUpgrade={toggleUpgrade} />
        ) : (
          <div className="detail-area">
            <div className="membership-area">
              <strong className="title">
                Are you sure you want to change your membership?
              </strong>
              <div className="profile-detail">
                <div className="profile-image">
                  <img
                    src={'/assets/images/default-profile-pic.png'}
                    alt="user"
                  />
                </div>
                <strong className="user-name">Mai Seohyn - Tier 2</strong>
                <Button
                  shape="circle"
                  type="primary"
                  className="price-btn"
                  size="middle"
                >
                  $3.99
                </Button>
                <span className="duration">30 Days</span>
              </div>
            </div>
            <div className="action_buttons">
              <Button onClick={toggleUpgrade} className="btn-note" size="small">
                CANCEL
              </Button>
              <Button
                onClick={() => {
                  setUpgrade(!upgrade);
                }}
                className="btn-note"
                size="small"
              >
                YES, CHANGE
              </Button>
            </div>
          </div>
        )}
      </Model>
    </>
  );
}

export default styled(FavoritesModel)`
  max-width: 493px;

  .modal-header {
    padding: 20px 24px 13px;
    border-bottom-color: #e6ecf1;
    /* color: #c30585; */

    .title-icon {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      width: 14px;

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
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;

    .title-holder {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .modal-body {
    padding: 0;
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    padding: 13px 16px;
    border-top: 1px solid #e6ecf1;

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

  .loader-holder {
    padding: 20px;
    text-align: center;
  }

  .membership-area {
    padding: 23px 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    max-height: calc(100vh - 170px);
    overflow: auto;

    .title {
      display: block;
      color: #050505;
      margin: 0 0 23px;
      font-weight: 400;

      .sp_dark & {
        /* color: #fff; */
      }
    }

    .profile-detail {
      background: #f4f6f9;
      border-radius: 4px;
      padding: 15px;

      .price-btn {
        cursor: default;
        pointer-events: none;
      }
    }

    .profile-image {
      border: 2px solid #fff;
      width: 54px;
      height: 54px;
      border-radius: 100%;
      margin: 0 auto 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      display: block;
      font-weight: 500;
      margin: 0 0 4px;
    }

    .button {
      min-width: 103px;
      padding: 6px 10px;
    }
  }

  .duration {
    display: block;
    font-size: 14px;
    line-height: 18px;
    padding: 10px 0 0;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);

    .sp_dark & {
      /* color: rgba(255, 255, 255, 0.85); */
    }
  }
`;
