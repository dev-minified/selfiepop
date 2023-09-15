// import { StarFill } from 'assets/svgs';
import {
  addUserInSubsList,
  createSubsList,
  deleteUserInSubsList,
} from 'api/ChatSubscriptions';
import { Plus, Spinner, StarFill } from 'assets/svgs';
import Button from 'components/NButton';
import Checkbox from 'components/checkbox';
import Model from 'components/modal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useEffect, useState } from 'react';
import {
  addSubscriptionSubsList,
  getAllSubsCriptionSubList,
  updateAssociatedSubInSubList,
} from 'store/reducer/chat';
import styled from 'styled-components';
import NewListItem from './NewListItem';

type Props = {
  onClose?: (...args: any) => void;
  isOpen?: boolean;
  className?: string;
  sub: ChatSubsType;
  managedAccountId?: string;
};

function FavoritesModel({
  onClose,
  isOpen,
  className,
  sub,
  managedAccountId,
}: Props): ReactElement {
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();
  const dispatch = useAppDispatch();
  const subsSubList = useAppSelector(
    (state) => state.chat.subscriptionsSubList,
  );
  const isSubsLoading = useAppSelector(
    (state) => state.chat.isSubscriptionSubListLoading,
  );

  const [checkStatus, setCheckStatus] = useState<Record<string, any>>({});
  const handleClose = () => {
    onCloseModel();
    onClose && onClose();
  };
  useEffect(() => {
    if (isOpen) {
      onOpenModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !subsSubList?.items.length) {
      dispatch(
        getAllSubsCriptionSubList({ query: { sellerId: managedAccountId } }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleNewList = () => {
    onCloseModel();
    onNewListOpenModel();
  };
  const hanldeNewList = async (listName: string) => {
    onNewListCloseModel();
    onOpenModel();
    await createSubsList(sub._id, {
      title: listName,
      sellerId: managedAccountId,
    })
      .then((res) => {
        if (res.success) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { success, ...rest } = res;
          dispatch(addSubscriptionSubsList(rest));
        }
      })
      .catch((err) => console.log(err));
  };
  const hanldeAddDeleteSubs = async (isAdd: boolean, listId: string) => {
    setCheckStatus({
      ...checkStatus,
      [listId]: isAdd,
    });
    if (isAdd) {
      await addUserInSubsList(sub._id, listId, { sellerId: managedAccountId })
        .then((res) => {
          if (res.success) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { success, ...rest } = res;
            dispatch(updateAssociatedSubInSubList(rest));
          }
        })
        .catch((err) => {
          console.log(err);
          setCheckStatus({
            ...checkStatus,
            [listId]: !isAdd,
          });
        });
    } else {
      await deleteUserInSubsList(sub._id, listId, {
        sellerId: managedAccountId,
      })
        .then((res) => {
          if (res.success) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { success, ...rest } = res;
            dispatch(updateAssociatedSubInSubList(rest));
          }
        })
        .catch((err) => {
          console.log(err);
          setCheckStatus({
            ...checkStatus,
            [listId]: !isAdd,
          });
        });
    }
  };

  return (
    <>
      <Model
        className={className}
        isOpen={isOpenModel}
        title={
          <div className="title-holder user_list">
            <span className="title-area">
              <span className={`title-icon`}>{<StarFill />}</span>
              <span className="title-text">{'SAVE TO LIST'}</span>
            </span>
            {/* <div className="sort_icon">{<Sort />}</div> */}
          </div>
        }
        showFooter={false}
        onClose={handleClose}
      >
        <div className="list">
          <div className="list_items">
            {isSubsLoading ? (
              <div className="loader-holder">
                <Spinner color="var(--pallete-text-secondary-50)" />
              </div>
            ) : (
              subsSubList?.items.map((item) => {
                const memberlength = item.associatedSubscriptions?.length || 0;
                return (
                  <div className="list_item" key={item?._id}>
                    <Checkbox
                      className="chat_checkbox"
                      checked={checkStatus[item?._id as string]}
                      onChange={(val: any) => {
                        hanldeAddDeleteSubs(
                          val.target.checked,
                          item?._id || '',
                        );
                      }}
                    />
                    <div className="list_desc">
                      <div className="list-title">
                        <span>{item.listTitle}</span>
                      </div>
                      <span className="users-num">
                        {memberlength} Member
                        {memberlength > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="action_buttons">
            <Button
              shape="round"
              className="btn-note"
              size="small"
              onClick={handleNewList}
              icon={<Plus />}
            >
              NEW LIST
            </Button>

            <Button
              shape="round"
              className="btn-note"
              size="small"
              onClick={handleClose}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </Model>
      <NewListItem
        isOpen={isNewListModelOpen}
        onSave={hanldeNewList}
        onCancel={() => {
          onNewListCloseModel();
          onOpenModel();
        }}
      />
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
      width: 24px;

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
  }

  .list_items {
    max-height: calc(100vh - 170px);
    overflow: auto;
  }

  .list_item {
    font-size: 17px;
    line-height: 21px;
    color: #495057;
    font-weight: 500;
    padding: 0 0 0 65px;
    position: relative;

    &:last-child {
      .list_desc {
        border-bottom: none;
      }
    }

    .list_desc {
      padding: 22px 25px 23px 0;
      border-bottom: 1px solid #e6ebf5;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
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

    label {
      padding: 0;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translate(0, -50%);
    }

    .users-num {
      font-size: 14px;
      line-height: 18px;
      color: #a9a8a8;
      font-weight: 400;
    }
  }

  .action_buttons {
    display: flex;
    justify-content: space-between;
    padding: 13px 16px;
    border-top: 1px solid #e6ebf5;

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
