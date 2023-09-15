import {
  getUpdatedVerifyEmailAddress,
  requestChangeEmailAddress,
  VerifyEmailAddressupdate,
} from 'api/Otp';
import { verifyPassword } from 'api/User';
import { EmailVerifictionIcon, LockIcon, Spinner } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import NewButton from 'components/NButton';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;
  className?: string;
  email?: string;
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
});
function UpdateEmailModal({
  onClose,
  isOpen,
  className,
  email,
}: Props): ReactElement {
  const { setUser, user } = useAuth();
  const handleClose = () => {
    onClose && onClose();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'right' | 'left'>('left');
  const [changedEmail, setChangedEmail] = useState('');
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getUpdatedVerifyEmailAddress()
        .then((res) => {
          if (res?.status && res?.email === email) {
            setChangedEmail(res?.email);
            setIsLoading(false);
          } else {
            setChangedEmail(email || '');
            requestChangeEmailAddress({ email })
              .then(() => {
                setIsLoading(false);
              })
              .catch((err) => {
                toast.error(err?.message);
                handleClose();
              });
          }
        })
        .catch((err) => {
          toast.error(err?.message);
          handleClose();
        });
    }
    return () => {
      setActiveView('left');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,

    resetForm,
  } = useFormik({
    // validationSchema,
    initialValues: {
      code: '',
    },

    onSubmit: async (values) => {
      try {
        const res = await VerifyEmailAddressupdate(
          {
            code: values.code,
          },
          { ignoreStatusCodes: [404] },
        );

        toast.success(res?.message);
        const allowSelling = user?.idIsVerified ? true : false;
        setUser({
          ...user,
          email: changedEmail,
          isEmailVerified: true,
          allowSelling,
        });
        resetForm();
        handleClose();
      } catch (error: any) {
        toast.error(error?.message);
      }
    },
  });
  const {
    values: Values,
    isSubmitting: IsSubmitting,
    handleChange: HandleChange,
    handleBlur: HandleBlur,
    handleSubmit: HandleSubmit,
    errors: Errors,
    touched: Touched,

    resetForm: ResetForm,
  } = useFormik({
    validationSchema,
    validate: (values: any) => {
      const errors: any = {};
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Your password does not match';
      }
      return errors;
    },
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    onSubmit: async (values) => {
      await verifyPassword({ password: values.password })
        .then((result) => {
          if (result?.status) {
            toast.success(result?.status);
            ResetForm();
            setActiveView('right');
          } else {
            toast.error('Your password is incorrect');
          }
        })
        .catch((err) => {
          toast.error(err?.message);
        });
    },
  });

  const resetOTP = () => {
    setIsLoading(true);
    requestChangeEmailAddress({ email: changedEmail })
      .then(() => {
        toast.success('');
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err?.message);
        setIsLoading(false);
      });
  };
  return (
    <>
      <Model
        className={className}
        isOpen={isOpen}
        title={
          <div className="title-holder user_list">
            <span className="title-area">
              <span className={`title-icon`}>
                {activeView === 'left' ? (
                  <LockIcon />
                ) : (
                  <EmailVerifictionIcon />
                )}
              </span>
              <span className="title-text">
                {activeView === 'left'
                  ? 'CONFIRM YOUR PASSWORD'
                  : 'VERIFY EMAIL UPDATE'}
              </span>
            </span>
          </div>
        }
        showFooter={false}
        onClose={handleClose}
      >
        {isLoading ? (
          <div className="loader-holder">
            <Spinner color="var(--pallete-text-secondary-50)" />
          </div>
        ) : (
          <>
            {activeView === 'left' && (
              <>
                <div className="field">
                  <FocusInput
                    onChange={HandleChange}
                    onBlur={HandleBlur}
                    error={Errors.password}
                    touched={Touched.password}
                    label="Password"
                    type="password"
                    inputClasses="mb-25"
                    name="password"
                    value={Values.password}
                  />
                </div>
                <div className="field">
                  <FocusInput
                    onChange={HandleChange}
                    onBlur={HandleBlur}
                    error={Errors.confirmPassword}
                    touched={Touched.confirmPassword}
                    label="Confirm Password"
                    type="password"
                    inputClasses="mb-25"
                    name="confirmPassword"
                    value={Values.confirmPassword}
                  />
                </div>
                <NewButton
                  type="primary"
                  htmlType="submit"
                  isLoading={IsSubmitting}
                  onClick={() => HandleSubmit()}
                >
                  Verify Password
                </NewButton>
              </>
            )}
            {activeView === 'right' && (
              <>
                <p>
                  A <span className="color">One Time Pass</span> code has been
                  sent to:
                </p>
                <strong className="email">{changedEmail}</strong>
                <p>
                  Please enter the OTP below to verify your Email Address
                  change. If you cannot see the email from Selfie Pop Admin in
                  your inbox, make sure to check your SPAM folder.
                </p>

                <FocusInput
                  id="passcode"
                  name="code"
                  type="text"
                  dataLpignore="true"
                  autocomplete="off"
                  placeholder="Enter Passcode"
                  error={errors.code}
                  touched={true}
                  materialDesign
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.code}
                />
                <div className="d-flex justify-content-between align-items-center otp-modal-footer">
                  <NewButton
                    isLoading={isSubmitting}
                    type="primary"
                    onClick={() => handleSubmit()}
                  >
                    CONFIRM UPDATE
                  </NewButton>
                  <NewButton type="link" htmlType="submit" onClick={resetOTP}>
                    Resend OTP
                  </NewButton>
                </div>
              </>
            )}
          </>
        )}
      </Model>
    </>
  );
}

export default styled(UpdateEmailModal)`
  max-width: 482px;
  font-size: 14px;
  line-height: 20px;
  color: #8c8c8c;
  font-weight: 400;

  .loader-holder {
    padding: 20px;
    text-align: center;
  }
  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: #000;

    .title-text {
      padding: 0 0 0 10px;
    }
  }

  .modal-header {
    padding: 20px 30px;
    border: none;
  }

  .modal-body {
    padding: 0 30px 20px;
  }

  .email {
    font-size: 16px;
    line-height: 20px;
    display: block;
    margin: 0 0 15px;
    font-weight: 400;
    color: #000;
  }

  p {
    margin: 0 0 8px;
  }

  .color {
    color: #525051;
  }

  .text-input {
    padding: 4px 0 13px;
  }

  .otp-modal-footer {
    .button-link {
      padding-left: 0;
      padding-right: 0;
      min-width: inherit;
    }
  }
`;
