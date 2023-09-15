import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { sentRestPasswordLink } from '../api/User';
import FocusInput from '../components/focus-input';
import NButton from '../components/NButton';
import MobileSlider from '../components/slider/MobileSlider';
import GuestLayout from '../layout/guest';
import Logo from '../theme/logo';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Email is required'),
});
export default function Login() {
  const [serverError, setserverError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [loading, setloading] = useState(false);
  const { loggedIn } = useAuth();
  const history = useHistory();

  const {
    values,
    handleChange,
    isValid,
    handleBlur,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    validationSchema,

    initialValues: {
      email: '',
    },

    onSubmit: async (values) => {
      setloading(true);
      await sentRestPasswordLink(values.email, { ignoreStatusCodes: [404] })
        .then(() => {
          setLinkSent(true);
        })
        .catch((e) => {
          if (e?.message && e?.message === "This user doesn't exist") {
            toast.error("This email is changed or doesn't exist!");
          }
          setserverError(e.message || e);
        });

      setloading(false);
      setserverError(null);
    },
  });

  useEffect(() => {
    loggedIn && history.push('/my-profile');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GuestLayout>
        <div className="landing-page-area">
          <div className="container ">
            <MobileSlider />
            <div className="form-signup-area">
              <strong className="logo">
                <Link to="#">
                  <Logo />
                </Link>
              </strong>
              <strong className="text-center title">
                Let's reset your password
              </strong>
              <div className={`t-field pb-20 ${linkSent ? 'hide-from ' : ''}`}>
                <strong className="text-center">
                  Enter your email address and we'll send a special reset
                  password link to your inbox
                </strong>
              </div>
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <div style={{ position: 'relative' }}>
                <div
                  className={`alert alert-success ${
                    linkSent ? 'fadeIn' : 'c-hide'
                  }`}
                >
                  Recovery email has been sent to your email address with
                  instructions to reset your password
                </div>
                <div className={` t-field ${linkSent && 'hide-from'}`}>
                  <form action="post" className="form" onSubmit={handleSubmit}>
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

                    <div className="mt-20 links-area">
                      {!linkSent && (
                        <NButton
                          htmlType="submit"
                          disabled={!isValid || loading}
                          isLoading={loading}
                          type="primary"
                          block
                          size="x-large"
                        >
                          Send Recovery Email
                        </NButton>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="links-area">
                {linkSent && (
                  <Link to="/login">
                    <NButton block type="primary" size="x-large">
                      Sign In Again
                    </NButton>
                  </Link>
                )}
                <Link to="/login">
                  <strong>Go back</strong>
                </Link>
                <strong className="mt-10 info-text text-primary">
                  Don't have a Account?
                </strong>
                <Link to="/signup">
                  <span className="link">Sign-up Here</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
}
