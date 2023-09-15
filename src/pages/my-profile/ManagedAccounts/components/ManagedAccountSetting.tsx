import { acceptManagedRequest } from 'api/managed-users';
import AvatarStatus from 'components/AvatarStatus';
import NewButton from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useManagedAccountsOffers from '../hooks/useManagedAccountsOffers';
import ManagedBits from './managedBits';

interface Props {
  className?: string;
  type?: string;
}

const ProfileManagerPermissions: React.FC<Props> = ({ className, type }) => {
  const history = useHistory();
  const { id: accountId } = useParams<{ id: string }>();
  const [isAccepting, setIsAccepting] = useState(false);
  const { managedUser: managedAccount, isLoading } = useManagedAccountsOffers();
  if (isLoading) {
    return <RequestLoader isLoading />;
  }
  return (
    <div className={className}>
      <div className={`chat-user-area`}>
        <AvatarStatus
          src={managedAccount?.image}
          imgSettings={{
            onlyMobile: true,
          }}
        />
        <strong className="user-name">{managedAccount?.title}</strong>
        <div className="user">{managedAccount?.description}</div>
        {managedAccount?.request}
      </div>
      <div className="caption">
        {!type && (
          <p>
            Has invited you to join their <strong> Management Team </strong>
          </p>
        )}
        <p>The following are the terms of their offer:</p>
      </div>
      <div className="permission-blocks">
        <strong className="heading">Your Roles:</strong>
        {managedAccount?.allowMessage && (
          <ManagedBits
            isActive={managedAccount?.allowMessage}
            title={'Chat Access'}
          />
        )}
        {managedAccount?.allowContent && (
          <ManagedBits
            isActive={managedAccount?.allowContent}
            title={'Membership Content Access'}
          />
        )}
      </div>
      <div className="permission-blocks">
        <strong className="heading">Commission Settings:</strong>
        <div>
          <p>
            In exchange for the services you will be providing,{' '}
            <strong>{managedAccount?.title}</strong> would like to offer you{' '}
            {managedAccount?.commissionValue}% <strong>COMMISSION </strong> on
            any revenue they generate from the platform.
          </p>
          <p>
            Comission will be applied to any orders placed while you are an
            active member of this team.
          </p>
        </div>
      </div>
      {managedAccount?.status === 'pending' && (
        <div className="buttons-wrap">
          <NewButton
            type={'primary'}
            size="middle"
            block
            id="add-new-member"
            isLoading={isAccepting}
            disabled={isAccepting}
            onClick={() => {
              setIsAccepting(true);
              acceptManagedRequest(managedAccount?.id || '')
                .then(() => history.replace('/my-profile/managed-accounts'))
                .catch(console.error)
                .finally(() => {
                  setIsAccepting(false);
                });
            }}
          >
            ACCEPT OFFER
          </NewButton>
          <Link to={`/my-profile/managed-accounts-decline/${accountId}`}>
            <NewButton
              type={'default'}
              outline
              size="middle"
              block
              id="add-new-member"
              isLoading={isAccepting}
              disabled={isAccepting}
            >
              DECLINE
            </NewButton>
          </Link>
        </div>
      )}
    </div>
  );
};
export default styled(ProfileManagerPermissions)`
  padding: 23px 30px;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    border: 2px solid #e6ecf1;
    border-radius: 5px;
    padding: 15px 15px 12px;
    text-align: center;
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    position: relative;

    .sp_dark & {
      border-color: var(--pallete-colors-border);
    }

    .user-image {
      width: 76px;
      height: 76px;
      overflow: hidden;
      margin: 0 auto 10px;
      border-radius: 100%;

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }

    .user-name {
      display: block;
      font-size: 18px;
      line-height: 21px;
      color: var(--pallete-text-light-100);
      margin: 0 0 2px;
      font-weight: 500;

      .sp_dark & {
        color: #fff;

        svg {
          path {
            fill: #fff;
          }
        }
      }
    }

    .user {
      display: block;
      color: #7b809b;
    }

    .user-status {
      position: absolute;
      right: 15px;
      top: 15px;
      font-size: 11px;
      line-height: 13px;

      @media (max-width: 370px) {
        right: 10px;
      }

      &.active {
        color: #3dd13a;

        circle {
          fill: currentColor;
          stroke: currentColor;
        }
      }

      &.pending {
        color: #fe0404;
      }

      &.declined {
        color: #6b6b6b;
      }

      &.canceled {
        color: #aeb1d4;
      }

      svg {
        width: 10px;
        height: auto;
        margin: 0 0 0 6px;
      }

      .circle {
        display: inline-block;
        vertical-align: middle;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: currentColor;
        margin: 0 0 0 6px;

        @media (max-width: 374px) {
          margin: 0 0 0 4px;
        }
      }
    }
  }

  .caption {
    text-align: center;
    font-size: 15px;
    line-height: 24px;
    color: var(--pallete-text-lighter-50);
    font-weight: 400;
    margin: 0 0 26px;

    @media (max-width: 767px) {
      font-size: 13px;
      line-height: 20px;
      margin: 0 0 16px;
    }

    p {
      margin: 0;
    }
  }

  .permission-blocks {
    margin: 0 0 20px;
    overflow: hidden;
    font-size: 14px;
    line-height: 22px;
    color: var(--pallete-text-lighter-50);
    font-weight: 400;

    @media (max-width: 767px) {
      font-size: 13px;
      line-height: 20px;
      margin: 0 0 12px;
    }

    strong {
      font-weight: 500;
      color: var(--pallete-text-main);
    }

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

  .buttons-wrap {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;

    @media (max-width: 767px) {
      display: block;
      max-width: 264px;
      margin: 0 auto;
    }

    > a,
    > button {
      width: calc(50% - 8px);
      display: block;

      @media (max-width: 767px) {
        width: 100%;
        margin: 0 0 10px;
      }
    }
  }

  .button-default {
    &:not(:hover) {
      background: var(--pallete-background-default);
      color: var(--pallete-primary-main);
    }
  }
`;
