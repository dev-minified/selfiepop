import {
  Correct,
  CrossRed,
  Dollar,
  SalespurchasesChat,
  StarSquare,
} from 'assets/svgs';
import FocusInput from 'components/focus-input';
import DragableItem from 'components/InlinePopForm/DragableItem';
import NewButton from 'components/NButton';
import { toast } from 'components/toaster';
import ListItem from 'components/UserList/ListItem';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { inviteTeamManaged } from 'store/reducer/teamManager';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';

import useItemWrapper from '../useItemWrapper';

interface Props {
  className?: string;
  edit?: boolean;
}
const ManagerPermissions: React.FC<Props> = ({ className, edit = false }) => {
  const analytics = useAnalytics();
  const { user, setUser: setLocalUser } = useAuth();
  const [totalcommission, setTotalcommission] = useState<number>(0);

  const [permissions, setPermissions] = useState({
    commissionValue: 0,
    allowMessage: true,
    allowContent: true,
    allowOrders: true,
    allowCommissions: true,
  });
  useEffect(() => {
    setTotalcommission(
      user?.managerList
        ?.filter(
          (item: any) =>
            item?.status === 'active' || item?.status === 'pending',
        )
        ?.reduce((accumulator: any, currentValue: any) => {
          return (
            parseFloat(accumulator) + parseFloat(currentValue?.commissionValue)
          );
        }, 0) || 0,
    );
  }, []);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [activeButton, setIsActiveButton] = useState<boolean>(false);
  const { activeItem, item, setUser } = useItemWrapper({ isEdit: !!edit });
  useEffect(() => {
    if (edit) {
      setPermissions({
        commissionValue: parseFloat(item?.commissionValue),
        allowMessage: item?.allowMessage,
        allowContent: item?.allowContent,
        allowOrders: item?.allowOrders,
        allowCommissions: item?.allowCommissions,
      });
    }
  }, [item?._id]);
  useEffect(() => {
    !item && setUser();
  }, []);
  const handlePermission = () => {
    const isCommissionValue = permissions.allowCommissions
      ? parseFloat(`${permissions.commissionValue}`)
      : 0;
    if (totalcommission + isCommissionValue > 100) {
      toast.info(
        'Total commission of all active managers can not be more than 100%',
      );
      return;
    }
    setIsActiveButton(true);
    dispatch(
      inviteTeamManaged({
        ...permissions,
        commissionValue: isCommissionValue,
        userId: activeItem?.uId,
      }),
    )
      .unwrap()
      .then((res) => {
        const managerlist = [...(user.managerList || []), res?.invite];
        setLocalUser({
          ...user,
          managerList: managerlist,
        });
        history.replace('/my-members/team-members');
        analytics.track('add_new_manager', {
          managerAdded: activeItem?.uId,
        });
        setIsActiveButton(false);
      })
      .catch((e) => {
        setIsActiveButton(false);
        if (e?.message) {
          toast.error(e.message);
        }
      });
  };
  const handleChange = (key?: any, value?: any) => {
    setPermissions((opt) => {
      return {
        ...opt,
        [key]: value,
      };
    });
  };
  return (
    <div className={className}>
      <div className="block-head">
        <p>
          Please set the <strong> PERMISSIONS </strong> and{' '}
          <strong> COMMISSIONS </strong> for this member:
        </p>
      </div>
      <ListItem className="user_list" {...activeItem} />
      <div className="permission-blocks">
        <strong className="heading">Permissions Settings:</strong>
        <DragableItem
          dragHandle={false}
          key={`1`}
          icon={
            <span className="permission-status-image">
              <StarSquare />
            </span>
          }
          extraLeft={
            permissions.allowContent ? (
              <span className="image-status tick">
                <Correct />
              </span>
            ) : (
              <span className="image-status cross">
                <CrossRed />
              </span>
            )
          }
          isActive={permissions.allowContent}
          title={'Membership Content Access'}
          onToggel={(e: any) => handleChange('allowContent', e.target.checked)}
          options={{ edit: false, toggel: !edit }}
        />
        <DragableItem
          dragHandle={false}
          key={`2`}
          icon={
            <span className="permission-status-image">
              <SalespurchasesChat />
            </span>
          }
          isActive={permissions.allowMessage}
          title={'Chat Access'}
          extraLeft={
            permissions.allowMessage ? (
              <span className="image-status tick">
                <Correct />
              </span>
            ) : (
              <span className="image-status cross">
                <CrossRed />
              </span>
            )
          }
          onToggel={(e: any) => handleChange('allowMessage', e.target.checked)}
          options={{ edit: false, toggel: !edit }}
        />
      </div>
      <div className="permission-blocks">
        <strong className="heading">Commission Settings:</strong>
        <DragableItem
          dragHandle={false}
          key={`3`}
          icon={
            <span className="permission-status-image">
              <Dollar />
            </span>
          }
          extraLeft={
            permissions.allowCommissions ? (
              <span className="image-status tick">
                <Correct />
              </span>
            ) : (
              <span className="image-status cross">
                <CrossRed />
              </span>
            )
          }
          isActive={permissions.allowCommissions}
          title={'Enable Commissions'}
          onToggel={(e: any) =>
            handleChange('allowCommissions', e.target.checked)
          }
          options={{ edit: false, toggel: !edit }}
        />
        {permissions.allowCommissions && (
          <div className="percentofcommition">
            <span className="field-title">
              Percent of commissions to share with this user:
            </span>
            <FocusInput
              type={'number'}
              materialDesign
              name="commissionValue"
              disabled={Boolean(edit)}
              hasLabel={false}
              prefixElement={<>%</>}
              value={`${permissions.commissionValue}`}
              validations={[{ type: 'number' }]}
              onChange={(e) => {
                handleChange('commissionValue', Number(e.target.value));
              }}
            />
          </div>
        )}
      </div>
      {!edit && (
        <NewButton
          type={'primary'}
          className="mt-10"
          size="middle"
          isLoading={activeButton}
          disabled={activeButton}
          block
          id="COMPLETE"
          onClick={() => {
            if (!activeButton) {
              handlePermission();
            }
          }}
        >
          COMPLETE ADDING TEAM MEMBER
        </NewButton>
      )}
    </div>
  );
};
export default styled(ManagerPermissions)`
  padding: 23px 30px;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    margin: 0 0 17px;

    &:hover {
      background: var(--pallete-background-secondary);
    }
  }

  .block-head {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 14px;

    p {
      margin: 0 0 16px;

      @media (max-width: 767px) {
        margin: 0 0 10px;
      }

      strong {
        color: var(--pallete-text-main);
      }
    }
  }

  .permission-blocks {
    margin: 0 0 20px;
    overflow: hidden;

    .heading {
      display: block;
      margin: 0 0 15px;
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
      color: var(--pallete-text-main);

      @media (max-width: 767px) {
        font-size: 13px;
      }
    }

    .card-dragable {
      padding: 12px 16px;
      font-size: 14px;
      line-height: 16px;
      font-weight: 500;
      color: var(--pallete-text-main);
      background: var(--pallete-background-default);

      .sp_dark & {
        background: var(--pallete-background-primary-100);
      }

      &.inactive {
        background: #e1e1e1;
        color: #606060;

        .sp_dark & {
          background: var(--pallete-background-primary-100);
        }
      }

      &:after {
        display: none;
      }

      .icon {
        width: 20px;
        height: 20px;
        min-width: 20px;
        border: none;
        color: currentColor;
        border-radius: 0;
        background: none;
        display: block;

        svg {
          width: 100%;
          height: auto;
          display: block;
        }
      }

      .permission-status-image {
        display: block;
      }

      .toggle-switch {
        margin: 0 0 0 10px;

        input:checked + .switcher {
          background: #000;

          .sp_dark & {
            background: #fff;
          }
        }
      }

      .extra {
        display: flex;
        align-items: center;
      }

      .image-status {
        path {
          fill: currentColor;
        }
      }
    }
  }

  .percentofcommition {
    background: var(--pallete-background-default);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 9px 7px 20px;
    font-size: 16px;
    line-height: 19px;
    color: #1b1b1b;
    font-weight: 500;
    margin: 0 0 10px;

    .sp_dark & {
      color: #999;
    }

    @media (max-width: 767px) {
      padding: 7px 9px 7px 15px;
      font-size: 12px;
      line-height: 14px;
    }

    .field-title {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }

    .text-input {
      margin-bottom: 0 !important;
      max-width: 154px;
      min-width: 154px;
    }

    .pre-fix {
      width: 30px;
      height: 30px;
      color: #fff;
      left: 5px;
      background: #6c6c6c;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
