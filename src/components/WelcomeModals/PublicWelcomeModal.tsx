import { sendEmailVerificationLink } from 'api/User';
import { IDVerificationStatuses } from 'appconstants';
import StripeVerifyButton from 'components/StripeIdVerification';
import Modal from 'components/modal';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { setPublicUser } from 'store/reducer/global';
import Button from '../NButton';

interface Props {
  isOpen: boolean;
  user?: any;
  publicProfile?: boolean;
  onClose: () => void;
}

const PublicWelcomeModal: React.FC<Props> = ({ isOpen, user, onClose }) => {
  const [emailSent, setEmailSent] = useState(false);
  const { setUser } = useAuth();
  const dispatch = useAppDispatch();

  const sendEmail = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      sendEmailVerificationLink(user?.email).then(() => {
        setEmailSent(true);
      });
    },
    [user],
  );

  let publicMessage: any = emailSent ? (
    <span>Email has been sent.</span>
  ) : !user?.isEmailVerified ? (
    <span>
      Please confirm your email address in order to allow the public to access
      your ecommerece features. If you need another copy of the email please{' '}
      <Link
        style={{ color: 'white', textDecoration: 'underline' }}
        to="#"
        onClick={sendEmail}
      >
        {'click here to resend it.'}
      </Link>
    </span>
  ) : !user?.idIsVerified ? (
    <span>
      Please complete your ID verification in order to allow the public to
      access your ecommerece features.
      <br />
      <br />
      {user?.idVerificationStatus !== IDVerificationStatuses.processing ? (
        <StripeVerifyButton
          buttonTitle={'Verify your account with stripe'}
          onSuccess={() => {
            setUser({
              ...user,
              idVerificationStatus: IDVerificationStatuses.processing,
            });
            dispatch(
              setPublicUser({
                ...user,
                idVerificationStatus: IDVerificationStatuses.processing,
              }),
            );
          }}
          btnProps={{
            size: 'large',
            // type: 'primary',
          }}
        />
      ) : (
        'ID verification is in progress...'
      )}
    </span>
  ) : (
    ''
  );

  if (!user?.isActiveProfile) {
    publicMessage = (
      <span>
        You are viewing your Pop Page, using the theme "
        {user?.userThemeId?.name}". Your profile is unavailable to the
        public.&nbsp;
        <Link
          to="/account"
          style={{ color: 'white', textDecoration: 'underline' }}
        >
          Click here
        </Link>
        &nbsp;to activate it
      </span>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      showHeader
      showFooter={false}
      onClose={onClose}
      className={`alert-modal`}
    >
      <div className="text-center">
        <div className="modal-head-area">
          <h2 className="text-capitalize">
            {user?.pageTitle ?? 'Incognito User'}!
          </h2>
        </div>
        <div className="modal-body-area">
          <p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={emailSent ? 'emailSent' : 'notSent'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {publicMessage}
              </motion.div>
            </AnimatePresence>
          </p>
        </div>
        <div className="modal-footer-area">
          <Button
            onClick={onClose}
            type="primary"
            shape="round"
            size="large"
            id="sp_test_publicmodal_ok"
          >
            OK!
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default PublicWelcomeModal;
