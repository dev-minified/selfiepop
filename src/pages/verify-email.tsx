import Button from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import StripeVerifyButton from 'components/StripeIdVerification';
import FocusInput from 'components/focus-input';
import { useFormik } from 'formik';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import GuestLayout from 'layout/guest';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { sendEmailVerificationLink, verifyAccount } from '../api/User';
import Logo from '../theme/logo';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Email is required'),
});
export default function Login() {
  const { user, loggedIn, setUser } = useAuth();
  const [accountverified, setAccountverified] = useState(false);
  const [serverError, setserverError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [isTokenVerifying, setIsTokenVerifying] = useState<boolean>(false);
  const { token } = useQuery();

  const loading = useAppSelector((state) => state.global?.loading);
  const history = useHistory();

  const {
    values,
    handleChange,
    isValid,
    handleBlur,
    handleSubmit,
    errors,
    setValues,
    touched,
    isSubmitting,
  } = useFormik({
    validationSchema,

    initialValues: {
      email: user?.email || '',
    },

    onSubmit: async (values) => {
      await sendEmailVerificationLink(values.email)
        .then(() => {
          setLinkSent(true);
        })
        .catch((e) => setserverError(e.message || e));

      setserverError(null);
    },
  });

  useEffect(() => {
    if (token) {
      setIsTokenVerifying(true);
      verifyAccount({ token })
        .then(() => {
          setAccountverified(true);
          setIsTokenVerifying(false);

          if (loggedIn) {
            setValues({ email: user.email });
            const allowSelling = user?.idIsVerified ? true : false;
            setUser({
              ...user,
              isEmailVerified: true,
              allowSelling,
              email: user.email,
            });
          }
        })
        .catch(() => {
          setIsTokenVerifying(false);

          setAccountverified(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pushToDashboard = () => {
    if (loggedIn) {
      const allowSelling = user?.idIsVerified ? true : false;
      setUser({ ...user, isEmailVerified: true, allowSelling });
    }
  };
  const pushToDashboardForIdVerification = () => {
    if (loggedIn) {
      const allowSelling = user?.idIsVerified ? true : false;
      setUser({
        ...user,
        isEmailVerified: true,
        allowSelling,
        idVerificationStatus: 'processing',
      });
    }
  };
  if (isTokenVerifying) {
    return <RequestLoader isLoading />;
  }
  return (
    <>
      {!loading && (
        <GuestLayout>
          <div className="landing-page-area">
            <div className="container justify-content-center">
              <div className="form-signup-area ">
                <strong className="logo">
                  <Link to="/">
                    <Logo />
                  </Link>
                </strong>
                <strong className="text-center title">
                  {accountverified
                    ? 'Your email address was successfully verified. Thank you'
                    : ' Sorry! Your Link Has Been Expired!'}
                </strong>
                {accountverified && !user?.idIsVerified ? (
                  <strong className="text-center title">
                    You must complete ID verification before you can start
                    selling.
                  </strong>
                ) : null}

                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}
                <div style={{ position: 'relative' }}>
                  <div
                    className={`alert alert-success ${
                      linkSent ? 'fadeIn' : 'c-hide'
                    }`}
                  >
                    Verification link successful sent to your email address
                  </div>
                  {!accountverified && (
                    <div className={` t-field ${linkSent && 'hide-from'}`}>
                      <form
                        action="post"
                        className="form"
                        onSubmit={handleSubmit}
                      >
                        {!user && (
                          <div className="field">
                            <FocusInput
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.email}
                              touched={touched.email}
                              label="Email"
                              // inputClasses="mb-25"
                              name="email"
                              value={values.email}
                            />
                          </div>
                        )}

                        <div className="mt-20 links-area">
                          {!linkSent && (
                            <Button
                              htmlType="submit"
                              block
                              size="x-large"
                              type="primary"
                              disabled={!isValid || isSubmitting}
                              isLoading={isSubmitting}
                            >
                              Send Verification Email
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>
                <div className="links-area">
                  {(linkSent || (accountverified && user?.idIsVerified)) && (
                    <Link to="/login" onClick={pushToDashboard}>
                      <Button block type="primary" size="x-large">
                        {user ? 'Go to Dashboard' : 'Sign In Again'}
                      </Button>
                    </Link>
                  )}
                  {accountverified && !user?.idIsVerified && user?._id ? (
                    <StripeVerifyButton
                      buttonTitle={
                        'Click here to verify your account with stripe'
                      }
                      onSuccess={() => {
                        console.log('called success');
                        pushToDashboardForIdVerification();
                        setTimeout(() => {
                          history.push('/my-profile');
                        }, 1000);
                      }}
                      btnProps={{
                        size: 'large',
                        type: 'primary',
                      }}
                    />
                  ) : null}
                  {accountverified && !user?._id ? (
                    <Link to="/login" onClick={pushToDashboard}>
                      <Button block type="primary" size="x-large">
                        {accountverified
                          ? 'Sign in again to complete ID verification!'
                          : 'Sign In Again'}
                      </Button>
                    </Link>
                  ) : null}
                  {!user?._id && (
                    <>
                      <strong className="mt-10 info-text text-primary">
                        Don't have a Account?
                      </strong>
                      <Link to="/signup">
                        <span className="link">Sign-up Here</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </GuestLayout>
      )}{' '}
    </>
  );
}
