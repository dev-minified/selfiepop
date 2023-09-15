import { deactivateAccount, update } from 'api/User';
import NewButton from 'components/NButton';
import PasswordFrom from 'components/PasswordFrom';
import SwitchboxWidget from 'components/switchboxWidget';
import { toast } from 'components/toaster';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useAnalytics } from 'use-analytics';
import { parseQuery } from 'util/index';
import AccountVerification from './components/AccountVerification';
import AddressForm from './components/AddressForm';
import UserInfoForm from './components/UserInfoForm';

const AccountInfo: React.FC = ({ className }: any) => {
  const analytics = useAnalytics();
  const history = useHistory();
  const { user: authUser, setUser: setUserContext, Logout }: any = useAuth();
  const [isActiveProfile, setIsActiveProfile] = useState(
    !!authUser?.isActiveProfile,
  );
  const location = useLocation();
  const query = parseQuery(location.search);
  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    setIsActiveProfile(authUser?.isActiveProfile);
  }, [authUser]);
  const sendEvent = () => {
    analytics.track('account_updated', {
      email: authUser.email,
    });
  };

  const onSubmit = async (values: any) => {
    // if (v.password === '') {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //   delete v.password, v.changepassword;
    // }

    const response = await update(values).catch(() => {
      toast.error('Email already exists');
    });
    sendEvent();
    setUserContext({ ...authUser, ...response.data });
    swal(response.message);
    return response;
  };
  const updateLocalUser = (values: Record<string, any>) => {
    sendEvent();

    setUserContext({ ...authUser, ...values });
  };
  const onDeactiveAccount = () => {
    swal({
      title: 'Account Deletion!',
      text: "You're about to Delete your account. You won't be able to access your account any more. You can activate it again any time.",
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Delete'],
    }).then(async (willDeactivate) => {
      if (willDeactivate) {
        setIsDeactivated(true);
        await deactivateAccount()
          .then((res: any) => {
            if (res.success) {
              setUserContext({ ...authUser, isDeactivate: true });
              swal(
                'Deactivation Success',
                'Your account has been deactivated',
                'success',
              ).then(() => {
                sendEvent();
                Logout();
              });
            }
          })
          .catch((err) => {
            swal('Deactivation Failed', err.message, 'error');
          });
        setIsDeactivated(false);
      }
    });
  };
  const queryKeys = Object.keys(query || {});
  return (
    <div className={className}>
      <UserInfoForm authUser={authUser} onSubmit={onSubmit} />
      <AddressForm
        authUser={authUser}
        onSubmit={onSubmit}
        updateLocalUser={updateLocalUser}
      />
      <PasswordFrom
        title="Password"
        fullWidth
        type="reset"
        submitButtonText="Save Password"
        sendEvent={sendEvent}
      />
      {authUser?.isEmailVerified ? (
        <AccountVerification
          onSuccess={() => {
            if (!!queryKeys.find((qs) => qs === 'idverification')) {
              history.replace('/account');
            }
          }}
          user={authUser}
          isOpen={!!queryKeys.find((qs) => qs === 'idverification')}
        />
      ) : null}
      <SwitchboxWidget
        // classes="mb-30 mb-md-50"
        title="Enable My page"
        name="isActiveProfile"
        disabled={authUser.profileStatus !== 'active'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIsActiveProfile(e.target.checked);
          onSubmit({ isActiveProfile: e.target.checked });
        }}
        enabled={authUser.profileStatus === 'active' && isActiveProfile}
      />
      <div className="d-flex justify-content-center mb-50">
        <NewButton
          type="primary"
          htmlType="submit"
          isLoading={isDeactivated}
          onClick={onDeactiveAccount}
          style={{ backgroundColor: 'red' }}
        >
          Delete Account
        </NewButton>
      </div>
    </div>
  );
};

export default styled(AccountInfo)`
  .url-holder {
    display: flex;
    align-items: center;
    p {
      margin: 0 0 20px;
      color: var(--pallete-text-main-500);
      font-size: 14px;
      line-height: 18px;
    }
    .text-input {
      flex-grow: 1;
      flex-basis: 0;
      padding: 0 0 0 10px;
    }
    .no-label {
      .form-control {
        padding: 10px 17px;
      }
    }
  }
`;
