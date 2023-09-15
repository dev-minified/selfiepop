import { checkUserProfile } from 'api/User';
import { spRefreshToken } from 'api/app';
import { getStreetPromoSession } from 'api/event';
import { EypeClose, EypeOpen } from 'assets/svgs';
import { AppAlert } from 'components/Model';
import SelfiepopText from 'components/selfipopText';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useQuery from 'hooks/useQuery';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import { Link, matchPath, useHistory } from 'react-router-dom';
import { getUserCount } from 'store/reducer/counter';
import { getUserSetupUri, parseQuery } from 'util/index';
import * as yup from 'yup';
import { default as NButton } from '../components/NButton';
import FocusInput from '../components/focus-input';
import useAuth from '../hooks/useAuth';
import Logo from '../theme/logo';
const validationSchema = yup.object().shape({
  email: yup.string().required('Email or username is required!'),
  password: yup.string().required('Enter your password'),
});
export default function Login() {
  const { loggedIn, Login, Logout, setLoggedData, user } = useAuth();
  const history = useHistory();
  const { redirect } = useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = parseQuery(location.search);
  const dispatch = useAppDispatch();
  const { setLoading } = useRequestLoader();
  const isTokenedUrl = matchPath(history.location.pathname, {
    path: '/login',
    exact: true,
    strict: false,
  });
  const [serverError, setserverError] = useState<string | null>(null);
  const {
    values,
    handleChange,
    handleBlur,
    isValid,
    isSubmitting,
    handleSubmit,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
    // validateOnBlur:true,
    onSubmit: async (formData: any) => {
      await Login(formData)
        .then((user: any) => {
          // updateUserFeatures(user, setUser);
          let url = '/my-profile';
          if (user.userSetupStatus < 10) {
            url = getUserSetupUri(user.userSetupStatus);
            history.push(url);
          } else {
            if (redirect) {
              const uri = new URL(redirect as string);
              url = uri.pathname + uri.search;
              history.push(url);
            } else {
              checkifSubsExist(url);
            }
          }
        })
        .catch((e: Error) => {
          if (e.message === 'Your account is deactivated') {
            setserverError('The account does not exists');
          } else setserverError(e.message);
        });
    },
  });
  const checkifSubsExist = (url: string) => {
    setIsLoading(true);
    setLoading(true);
    dispatch(getUserCount())
      .unwrap()
      .then((d: any) => {
        setIsLoading(false);
        setLoading(false);
        if (!d.cancelled) {
          if (!!d?.subscription) {
            history.replace('/messages/subscriptions');
            return;
          }
        }
        history.push(url);
      })
      .catch(() => {
        setIsLoading(false);
        setLoading(false);
        history.push(url);
      });
  };
  useEffect(() => {
    if (loggedIn) {
      if (isTokenedUrl && token) {
        AppAlert({
          title: 'Already Logged In!',

          text: (
            <>
              You are already logged in as a <SelfiepopText /> user
            </>
          ),
          onConfirm: () => {
            history.push('/my-profile');
          },
          onClose: () => {
            history.push('/my-profile');
          },
        });
      } else {
        history.push('/my-profile');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const VerifyUserToken = async (sessionData: Record<string, string>) => {
    return checkUserProfile(sessionData.token as string, {
      ignoreStatusCodes: [401],
    }).then(async (data) => {
      await Logout(false);
      setLoggedData({
        data,
        token: sessionData.token,
        refreshToken: sessionData.refreshToken,
      });
      setLoading(false);
      setIsLoading(false);
      if (!data?.isPasswordSet && data?.signupSource === 'street-promo') {
        return history.replace(`/set-password?token=${token}`);
      }
      return history.push('/my-profile');
    });
  };
  useEffect(() => {
    if (!!isTokenedUrl && !!token && !loggedIn && !user?._id) {
      setIsLoading(true);
      setLoading(true);
      getStreetPromoSession(token as string, { ignoreStatusCodes: [500, 404] })
        .then(async (sessionData) => {
          if (sessionData?.success) {
            await VerifyUserToken(sessionData).catch(async (e) => {
              if (e && e.message === 'jwt expired') {
                await spRefreshToken({
                  token: sessionData.token as string,
                  refreshToken: sessionData?.refreshToken,
                  onErrorCallback: () => {
                    setLoading(false);
                    setIsLoading(false);

                    return history.push('/login');
                  },
                  onSuccessCallbak: async (response) => {
                    if (response?.data?.status) {
                      await VerifyUserToken({
                        token: response.data.token,
                      }).catch(async () => {
                        setLoading(false);
                        setIsLoading(false);

                        return history.push('/login');
                      });
                    }
                  },
                });
              } else {
                setLoading(false);
                setIsLoading(false);

                return history.push('/login');
              }
            });
          } else {
            AppAlert({
              title: 'Token Invalid',

              text: 'Your tokon is Invalid or Expired',
              onConfirm: () => {
                history.push('/login');
              },
              onClose: () => {
                history.push('/login');
              },
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
          setLoading(false);
          AppAlert({
            title: 'Token Invalid',

            text: 'Your tokon is Invalid or Expired',
            onConfirm: () => {
              history.push('/login');
            },
            onClose: () => {
              history.push('/login');
            },
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user?._id]);

  if (isLoading) {
    return null;
  }
  const handleInputChange = (e: any) => {
    if (!!serverError) {
      setserverError('');
    }
    handleChange(e);
  };
  return (
    <div className="landing-page-area">
      <div className="container justify-content-center">
        {/* <MobileSlider /> */}
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          {serverError && (
            <div className="alert alert-danger">{serverError}</div>
          )}
          <form action="post" className="form" onSubmit={handleSubmit}>
            <div className="field">
              <FocusInput
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                label="Email or Username *"
                inputClasses="mb-25"
                name="email"
                value={values.email}
                validations={[{ noSpace: true }]}
              />
            </div>
            <div className="field">
              <FocusInput
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                label="Password *"
                limit={50}
                type={showPassword ? 'text' : 'password'}
                inputClasses="mb-25 icon-right"
                name="password"
                value={values.password}
                hasIcon={true}
                icon={
                  <span
                    onClick={() => {
                      values.password
                        ? setShowPassword(!showPassword)
                        : setShowPassword(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <EypeClose /> : <EypeOpen />}
                  </span>
                }
              />
            </div>

            <div className="links-area">
              <NButton
                htmlType="submit"
                className="mb-20"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                type="primary"
                size="x-large"
              >
                Sign In
              </NButton>
              <strong className="info-text text-primary">
                Forget your password?
              </strong>
              <Link to="/recover-password" className="link">
                Reset Password
              </Link>

              <div className="mt-20">
                <strong className="caption">
                  <Link to="/signup" className="text-primary">
                    Click here
                  </Link>{' '}
                  to Sign Up
                </strong>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
