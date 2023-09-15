import { IDVerificationStatuses } from 'appconstants';
import StripeVerifyButton from 'components/StripeIdVerification';
import SwitchboxWidget from 'components/switchboxWidget';
import Styled from 'styled-components';
type Props = {
  className?: string;
  user?: IUser;
  showSwitchBox?: boolean;
  isOpen?: boolean;
  onSuccess?: () => void;
};

const AccountVerification = ({
  user: authUser,
  className,
  showSwitchBox = true,
  isOpen,
  onSuccess,
}: Props) => {
  const isCompleteOrProcessing =
    authUser?.idVerificationStatus === 'processing' ||
    authUser?.idVerificationStatus === 'completed';
  let IdVerificatinTitle = 'Account Unverified';
  let buttonTitle = 'Click here to verify your account with stripe';
  if (authUser?.idIsVerified) {
    IdVerificatinTitle = 'Account Verified';
    buttonTitle = 'Verification Completed';
  } else if (
    authUser?.idVerificationStatus === IDVerificationStatuses.processing
  ) {
    IdVerificatinTitle = 'Verification in Progress ';
    buttonTitle = 'Verification in progress. Click here to Edit';
  } else if (authUser?.idVerificationStatus === IDVerificationStatuses.failed) {
    IdVerificatinTitle = 'Verification Failed';
    buttonTitle = 'Verification failed. Click here to try again.';
  }
  return (
    <div>
      <h3 className={`mb-30 mb-md-50 ${className}`}>Account Verification</h3>
      {showSwitchBox ? (
        <SwitchboxWidget
          // classes="mb-30 mb-md-50"
          showSwitchBox={false}
          title={IdVerificatinTitle}
          name="isActiveProfile"
          disabled={!authUser?.idIsVerified}
          onChange={() => {}}
          enabled={authUser?.idIsVerified}
          processing={
            authUser?.idVerificationStatus === IDVerificationStatuses.processing
          }
          rightTitle="Stripe"
        />
      ) : null}
      {!authUser?.idIsVerified && !isCompleteOrProcessing ? (
        <div className="d-flex justify-content-center  mb-20">
          <StripeVerifyButton
            isOpen={isOpen}
            onSuccess={onSuccess}
            buttonTitle={buttonTitle}
            btnProps={{
              size: 'large',
              type: 'primary',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
export default Styled(AccountVerification)``;
