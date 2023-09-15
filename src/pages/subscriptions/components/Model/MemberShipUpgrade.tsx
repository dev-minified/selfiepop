// import { StarFill } from 'assets/svgs';
import Checkbox from 'components/checkbox';
import Button from 'components/NButton';
import { ReactElement, useState } from 'react';
import styled from 'styled-components';

type Props = {
  onClose?: (...args: any) => void;
  isOpen?: boolean;
  className?: string;
  toggleUpgrade?: (status: Record<string, any>) => void | Promise<any>;
  items?: any[];
};

function FavoritesModel({
  onClose,
  className,
  toggleUpgrade,
  items,
}: Props): ReactElement {
  const [checkStatus, setCheckStatus] = useState<Record<string, any>>({});

  const handleClose = () => {
    onClose && onClose();
  };

  const handleUpdate = (item: any, isAdd: boolean, listId: string) => {
    setCheckStatus({
      [listId]: { ...item, checked: isAdd },
    });
  };
  const handleToggle = () => {
    toggleUpgrade?.(checkStatus);
  };

  const key = Object.keys(checkStatus || {});
  return (
    <div className={className}>
      <div className="list">
        <div className="list_items">
          {items?.map((item, index) => {
            return (
              <div className="list_item" key={index}>
                <Checkbox
                  className="chat_checkbox"
                  checked={checkStatus[item?._id]?.checked}
                  onChange={(val: any) =>
                    handleUpdate(item, val.target.checked, item?._id || '')
                  }
                />
                <div className="list_desc">
                  <div className="list-title">
                    <strong className="title">{item.title}</strong>
                    <span className="description">{item.description}</span>
                  </div>
                  <div className="package-detail">
                    <span className="price">
                      $ {(parseFloat(item?.price) || 0)?.toFixed(2)}
                    </span>
                    {/* <span className="duration">{item.days || 30}</span> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="action_buttons">
          <Button className="btn-note" size="small">
            CANCEL
          </Button>
          <Button className="btn-note" size="small">
            UPGRADE
          </Button>
        </div> */}
        <div className="action_buttons package-detail-area">
          <div className="update-info">
            {key.length > 0 && checkStatus[key[0]].checked
              ? `Change your 30 Days Membership for $${Number(
                  checkStatus[key[0]]?.price || 0,
                ).toFixed(2)}`
              : 'Change your 30 Days Membership'}
          </div>
          <div className="btns-holder">
            <Button className="btn-note" size="small" onClick={handleClose}>
              NO
            </Button>
            <Button
              onClick={handleToggle}
              className="btn-note"
              size="small"
              disabled={!key.length || !checkStatus?.[key[0]]?.checked}
            >
              YES
            </Button>
          </div>
        </div>
      </div>
    </div>
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

  .modal-content {
    border-radius: 6px;
    overflow: hidden;
  }

  .list_items {
    max-height: calc(100vh - 170px);
    overflow: auto;
  }

  .list_item {
    padding: 0 30px 0 65px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    color: #a9a8a8;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    position: relative;

    &:last-child {
      .list_desc {
        border-bottom: none;
      }
    }

    .list_desc {
      padding: 15px 0;
      border-bottom: 1px solid #e6ecf1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }

    .checkbox [type='checkbox']:checked + .custom-input-holder .custom-input {
      background: var(--pallete-primary-main);
      border-color: var(--pallete-primary-main);

      &:before {
        color: #fff;
      }
    }

    .checkbox .custom-input {
      border-radius: 100%;
      width: 25px;
      height: 25px;
      background: #fff;
      border-color: #dad8d8;

      &:before {
        font-size: 11px;
      }

      &:after {
        display: none;
      }
    }

    .title {
      display: block;
      font-size: 17px;
      line-height: 22px;
      color: #000;
      margin: 0 0 10px;
      font-weight: 500;
    }

    label {
      padding: 0;
      position: absolute;
      left: 20px;
      top: 20px;
    }
  }

  .list-title {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 20px 0 0;

    @media (max-width: 479px) {
      padding: 0 10px 0 0;
    }
  }

  .price {
    display: block;
    font-size: 17px;
    line-height: 22px;
    color: #000;
    font-weight: 500;
  }

  .package-detail {
    text-align: right;
  }

  .duration {
    display: block;
    font-size: 12px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.46);
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    padding: 13px 16px;
    border-top: 1px solid #e6ecf1;
    align-items: center;
    font-weight: 400;

    &.package-detail-area {
      justify-content: space-between;
      background: #f4f6fb;
      font-size: 14px;
      line-height: 20px;
      color: #000;
    }

    .update-info {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 10px 0 0;
    }

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
`;
