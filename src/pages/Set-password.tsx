import { removeStreetPromoSession } from 'api/event';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { getUserSetupUri, parseQuery } from 'util/index';
import * as yup from 'yup';
import { update } from '../api/User';
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
export default function SetPassword() {
  const [loading, setloading] = useState(false);
  const [serverError, setserverError] = useState<string | null>(null);
  const [onSuccess, setOnSuccess] = useState(false);
  const history = useHistory();
  const query = useLocation().search;
  const { token } = parseQuery(query);

  const { loggedIn, setUser, user } = useAuth();

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
        await update({ ...values, isPasswordSet: true })
          .then(async (res) => {
            setUser(res?.data || {});

            const isOnBoarding = res.data.userSetupStatus > 5;
            let url = '/my-profile';
            if (!isOnBoarding) {
              url = getUserSetupUri(res.data.userSetupStatus);
            }
            if (token) {
              removeStreetPromoSession(token as string)
                .then(() => {
                  history.push(url);
                })
                .catch(() => {
                  history.push(url);
                });
            } else {
              history.push(url);
            }
            setOnSuccess(true);
          })
          .catch((e) => setserverError(e.message || e));
        setloading(false);
        setserverError(null);
      },
    });

  // useEffect(() => {
  //   if (token) {
  //     getStreetPromoSession(token as string, { ignoreStatusCodes: [500, 404] })
  //       .then((sessionData) => {
  //         if (!sessionData.success) {
  //           AppAlert({
  //             title: 'Token Invalid',

  //             text: 'Your tokon is Invalid or Expired',
  //             onConfirm: () => {
  //               history.push('/my-profile');
  //             },
  //             onClose: () => {
  //               history.push('/my-profile');
  //             },
  //           });
  //           return history.push('/my-profile');
  //         }
  //       })
  //       .catch(() => {
  //         AppAlert({
  //           title: 'Token Invalid',

  //           text: 'Your tokon is Invalid or Expired',
  //           onConfirm: () => {
  //             history.push('/my-profile');
  //           },
  //           onClose: () => {
  //             history.push('/my-profile');
  //           },
  //         });
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  useEffect(() => {
    if (loggedIn && user?.userSetupStatus > 5) {
      loggedIn && history.push('/my-profile');
    }
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
            <strong className="text-center title">Set Password</strong>
            {serverError && (
              <div className="alert alert-danger">{serverError}</div>
            )}
            <div style={{ position: 'relative' }}>
              <div
                className={`alert alert-success ${
                  onSuccess ? 'fadeIn' : 'c-hide'
                }`}
              >
                Password set successfully
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
                        Set Your Password
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            {onSuccess && !loggedIn && (
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
