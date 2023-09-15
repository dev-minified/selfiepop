import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { parseQuery } from 'util/index';
import * as yup from 'yup';
import { resetPassword, verifyToken } from '../api/User';
import FocusInput from '../components/focus-input';
import Button from '../components/NButton';
import GuestLayout from '../layout/guest';
import Logo from '../theme/logo';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
  // .matches(
  //   /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
  //   'Password must contain one uppercase, one number and one special case character',
  // ),
});
export default function Signup() {
  const [loading, setloading] = useState(false);
  const [serverError, setserverError] = useState<string | null>(null);
  const [onSuccess, setOnSuccess] = useState(false);
  const history = useHistory();
  const query = useLocation().search;
  const { loggedIn } = useAuth();

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    useFormik({
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
        setloading(true);
        const token = parseQuery(query);
        await resetPassword({ ...values, token: token?.token })
          .then(() => setOnSuccess(true))
          .catch((e) => setserverError(e.message || e));
        setloading(false);
        setserverError(null);
      },
    });

  useEffect(() => {
    const token = parseQuery(query);
    if (token) {
      verifyToken({ token: token?.token }).catch(() => {
        history.push('/reset-password-recovery-link');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    loggedIn && history.push('/my-profile');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GuestLayout>
      <div className="landing-page-area">
        <div className="container justify-content-center">
          <div className="form-signup-area">
            <strong className="logo">
              <Link to="/">
                <Logo />
              </Link>
            </strong>
            <strong className="text-center title">Reset Password</strong>
            {serverError && (
              <div className="alert alert-danger">{serverError}</div>
            )}
            <div style={{ position: 'relative' }}>
              <div
                className={`alert alert-success ${
                  onSuccess ? 'fadeIn' : 'c-hide'
                }`}
              >
                Password reset successfully
              </div>
              <div className={` t-field ${onSuccess && 'hide-from'}`}>
                <form action="post" onSubmit={handleSubmit} className="form">
                  <div className="field">
                    <FocusInput
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      label="Password"
                      type="password"
                      inputClasses="mb-25"
                      name="password"
                      value={values.password}
                    />
                  </div>
                  <div className="field">
                    <FocusInput
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      label="Confirm Password"
                      type="password"
                      inputClasses="mb-25"
                      name="confirmPassword"
                      value={values.confirmPassword}
                    />
                  </div>
                  {!onSuccess && (
                    <div className="links-area">
                      <Button
                        htmlType="submit"
                        block
                        disabled={Object.keys(errors).length > 0 && loading}
                        type="primary"
                        isLoading={loading}
                        size="x-large"
                      >
                        Reset Password
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            {onSuccess && (
              <div className="links-area">
                <Link to="/login">
                  <Button style={{ width: '100%' }} className="btn btn-primary">
                    Sign In Again
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
