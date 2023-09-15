import {
  activateAccountRequest,
  checkUserName,
  fetchUserByName,
} from 'api/User';
import { EypeClose, EypeOpen } from 'assets/svgs';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import ImageModifications from 'components/ImageModifications';
import NButton from 'components/NButton';
import SelfiepopText from 'components/selfipopText';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import { onboardingSequency, slugify } from 'util/index';

import * as yup from 'yup';
import Logo from '../theme/logo';
dayjs.extend(tz);
const PreAddedSocialLinks = [
  { type: 'instagram', url: '' },
  {
    type: 'tiktok',
    url: '',
  },
  {
    type: 'twitter',
    url: '',
  },
  {
    type: 'youtube',
    url: '',
  },
  {
    type: 'facebook',
    url: '',
  },
  {
    type: 'snapchat',
    url: '',
  },
];

const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Enter your name')
    .matches(/^[A-Za-z0-9 _-]*$/, 'Enter valid name'),
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  password: yup
    .string()

    .max(50)
    .min(6, 'Password should be at least 6 characters long')
    .required('Password is required'),
  sign: yup
    .bool()
    .oneOf([true], 'Accept Terms & Conditions is required')
    .required(),
});
type SignUpProps = {
  className?: string;
};
function Signup({ className }: SignUpProps) {
  const { SignUp, loggedIn, user } = useAuth();
  const history = useHistory();
  const [refUser, setRefUser] = useState<any>(undefined);
  const ref = useRef<any>();
  // const { refId, hash } = useParams<{ refId: string; hash: string }>();
  const { refId } = useParams<{ refId: string; hash: string }>();
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordCheck, setPasswordCheck] = useState('');
  // const [hint, setHint] = useState('');

  const {
    values,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    errors,
    touched,
    setValues,
    setFieldError,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      username: '',
      sign: true,
      refId: undefined,
      isInvitedUser: false,
      isAffiliate: false,
      isActiveProfile: true,
    },
    onSubmit: async (formData: any) => {
      if (loggedIn || user?._id) {
        swal({
          title: 'Already logged in',
          icon: 'success',
        }).then((data) => {
          data && history.push('/my-profile');
        });

        return;
      }

      const isExist = await validateUsername(formData?.fullName);
      if (!isExist) {
        return;
      }
      const name = formData.fullName.replace(/\s{2,}/g, ' ').trim();
      let firstName = name.split(' ').slice(0, -1).join(' ');
      let lastName = name.split(' ').slice(-1).join(' ');
      // const onBoardingType = hash ? 2 : refId ? 3 : 1;
      // console.log({ name, firstName, lastName });
      if (!firstName) {
        firstName = lastName;
        lastName = '';
      }
      const onBoardingType = refId ? 2 : 1;
      await SignUp({
        ...formData,
        firstName,
        lastName,
        username: slugify(formData?.fullName),
        isActiveProfile: false,
        socialMediaLinks: PreAddedSocialLinks,
        frontendURL: `${window.location.protocol}//${window.location.host}/verify-email`,
        timeOffset: dayjs.tz.guess(),
        onboardingTypeId: onBoardingType,
      })
        .then(() => {
          // const onboardingRoute = hash
          //   ? onboardingSequencyV2
          //   : onboardingSequency;
          const onboardingRoute = onboardingSequency;
          history.push(onboardingRoute[0]);
        })
        .catch((e: Error) => {
          const buttonss: Record<string, any> = {
            cancel: {
              visible: true,
              text: 'Cancel',
              closeModal: true,
            },
          };
          if (
            e?.message.toLowerCase() === 'your account is deactivated' ||
            e?.message.toLowerCase() === 'email already exists'
          ) {
            let title = 'You already have an account!';
            let text =
              'Please login below, use a different email address for registration';
            if (e?.message.toLowerCase() === 'your account is deactivated') {
              buttonss['activate'] = {
                visible: true,
                text: 'Activate',
                closeModal: true,
              };
              title = 'Your account is deactivated!';
              text = 'Activate your account if deactivated';
            } else {
              buttonss['login'] = {
                visible: true,
                text: 'Login',
                closeModal: true,
              };
            }
            swal({
              title,
              text,
              icon: 'error',
              // buttons: ['Cancel', 'Login'],
              buttons: buttonss,
            }).then(async (value) => {
              switch (value) {
                case 'login':
                  history.push('/login');
                  break;

                case 'activate':
                  await activateAccountRequest({
                    email: values.email,
                  })
                    .then(() => {
                      swal(
                        'Email Success!',
                        'Check your email to activate your account',
                        'success',
                      ).then(() => {
                        history.push('/login');
                      });
                    })
                    .catch((err) => {
                      swal('', err.message, 'info');
                    });

                  break;
              }
            });
          } else {
            swal(
              '',
              e?.message || 'Something went wrong please try again!',
              'error',
            );
          }
        });
    },
  });
  const validateUsername = async (value: string) => {
    const slug = slugify(value);
    if (slug?.length <= 2) {
      setFieldError('fullName', 'Name must be at least 3 characters long!');
      return false;
    }

    // setCLoader({ username: value });

    return checkUserName(slug)
      .then(() => {
        // setCLoader({});

        setFieldValue('fullName', value);
        setFieldValue('username', slug);
        return true;
      })
      .catch(() => {
        // setCLoader({});
        setFieldError('fullName', 'Name has already been taken');
        return false;
      });
  };
  const beforeSubmit = (e?: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.stopPropagation();
    e?.stopPropagation();
    if (Object.keys(errors).length === 1 && errors.sign) {
      toast.info(
        'Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy',
      );
    }

    handleSubmit(e);
  };
  useEffect(() => {
    if (loggedIn) {
      history.replace('/my-profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user?._id]);
  useEffect(() => {
    if (refId) {
      fetchUserByName(refId)
        .then((res) => {
          // if (res._id && res.isAffiliate === true) {
          if (res._id) {
            setRefUser(res);
            setValues((values) => ({
              ...values,
              refId: res?._id,
              isInvitedUser: true,
            }));
          }
        })
        .catch(() => {
          toast.error('Invalid reference link');
          ///TODO: Show notfication that invalid ref link
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refId]);

  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        ref?.current?.click();
      }, 0);
    }
  }, [ref]);
  // const handlePasswordChecker = (e: any) => {

  //   const strongPassword = new RegExp(
  //     '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})',
  //   );

  //   const mediumPassword = new RegExp(
  //     '^([a-zA-Z0-9]*(_|-|[ `!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?~])[a-zA-Z0-9]*)+$',
  //   );
  //   if (e.target.value?.length < 6) {
  //     setPasswordCheck('Weak');
  //     setHint('The password should be at least 6 characters long.');
  //     setFieldValue('password', e.target.value);
  //     return;
  //   }
  //   if (e.target.value?.length >= 6 && strongPassword.test(e.target.value)) {
  //     setPasswordCheck('Strong');
  //     setHint('');
  //   } else if (
  //     e.target.value?.length >= 6 &&
  //     mediumPassword.test(e.target.value)
  //   ) {
  //     setPasswordCheck('Medium');
  //     setHint(
  //       'Make it stronger, Use upper and lower case letters, numbers and symbels like ! $ % # ',
  //     );
  //   } else {
  //     setPasswordCheck('Weak');
  //     setHint(
  //       'Use upper and lower case letters, numbers and symbels like ! $ % # ',
  //     );
  //   }
  //   setFieldValue('password', e.target.value);
  // };

  return (
    <div className={`landing-page-area ${className}`} ref={ref}>
      <div className="container justify-content-center">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <div className="logo-image">
                <Logo />
              </div>
            </Link>
          </strong>
          {refUser ? (
            <>
              <div className="mb-30">
                <div className="empty-cover"> </div>
                <div className="text-center landing-profile">
                  <div
                    className="profile--image"
                    style={{
                      background: 'var(--pallete-primary-main)',
                    }}
                  >
                    <ImageModifications
                      imgeSizesProps={{
                        onlyDesktop: true,

                        imgix: { all: 'w=163&h=163' },
                      }}
                      src={refUser?.profileImage}
                      fallbackUrl={'/assets/images/default-profile-pic.png'}
                      alt="img description"
                    />
                  </div>
                </div>
                <div className="profile--info mb-30">
                  <h2 className="text-center">Congratulations!</h2>
                  <h1 className="text-center">
                    <span className="primary-text">
                      {refUser?.pageTitle ?? 'Incognito User'}
                    </span>
                  </h1>
                  <h2 className="text-center">
                    has invited you to join the <SelfiepopText />.
                  </h2>
                </div>
                <hr />
                <h6 className="text-center">
                  Fill out the form below to get started.
                </h6>
              </div>
            </>
          ) : (
            <strong className="text-center title">
              Start growing your{' '}
              <span className="text-primary">social revenue</span> today!
            </strong>
          )}
          <form onSubmit={beforeSubmit} className="form">
            <div className="field">
              <FocusInput
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.fullName}
                touched={touched.fullName}
                label="Your Name *"
                inputClasses="mb-25"
                name="fullName"
                class={values.fullName && !errors.fullName ? 'is-valid' : ''}
                value={values.fullName}
                validations={[{ noMultipeSpace: true }]}
                // validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
              />
            </div>
            <div className="field">
              <FocusInput
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                label="Email *"
                class={values.email && !errors.email ? 'is-valid' : ''}
                inputClasses={`mb-25`}
                name="email"
                value={values.email}
                validations={[{ noSpace: true }]}
              />
            </div>
            <div className="field">
              <FocusInput
                // onChange={handlePasswordChecker}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  (!values.password || values.password?.length < 6) &&
                  errors.password
                }
                touched={touched.password}
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                limit={50}
                inputClasses={`mb-25 icon-right `}
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
              {/* {passwordCheck && values.password && (
                <>
                  <span className={`displayBadge ${passwordCheck}`}>
                    {passwordCheck}
                  </span>
                  {hint && (
                    <span className="hint-text">
                      <strong>Hint:</strong> {hint}
                    </span>
                  )}
                </>
              )} */}
            </div>
            <div>
              <Checkbox
                name="sign"
                defaultChecked={values.sign}
                onChange={handleChange}
                onBlur={handleBlur}
                label={
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'normal',
                      position: 'relative',
                      zIndex: 10,
                    }}
                  >
                    I agree to the <Link to="/terms">Terms of Services</Link>{' '}
                    and <Link to="/policy">Privacy Policy</Link> *
                  </span>
                }
              />
            </div>
            <div className="links-area">
              <NButton
                htmlType="submit"
                disabled={!isValid && isSubmitting}
                isLoading={isSubmitting}
                size="x-large"
                block
                id="signup_submit"
                type="primary"
              >
                {refUser?._id ? 'Create Account' : "Let's go !"}
              </NButton>
              <strong className="info-text text-primary">
                Already have an Account?
              </strong>
              <Link to="/login">
                <span className="link">Sign-in Here </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default styled(Signup)`
  margin-bottom: 26px;

  .displayBadge {
    color: white;
    display: block;
    width: 100%;
    text-align: center;
    border: 1px solid transparent;
    font-weight: 500;
    padding: 3px;
  }
  .Weak {
    border-color: red;
    background: rgba(255, 0, 0, 0.6);
  }
  .Strong {
    border-color: green;
    background: rgba(0, 128, 0, 0.6);
  }
  .Medium {
    border-color: blue;
    background: rgba(0, 0, 255, 0.6);
  }

  .hint-text {
    display: block;
    padding: 10px 0 0;
    font-size: 14px;
    line-height: 18px;
  }
`;
