import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
/* eslint-disable jsx-a11y/anchor-is-valid */
import { activateAccountRequest } from 'api/User';
import { Spinner } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useHistory } from 'react-router';
import swal from 'sweetalert';
import { onboardingSequency } from 'util/index';
import * as yup from 'yup';
dayjs.extend(tz);
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
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
    .required('Enter your full name')
    .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter your full name'),
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  password: yup
    .string()

    .max(50)
    .min(6, 'Password should be at least 6 characters long')
    .required('Password is required'),
  // sign: yup
  //   .bool()
  //   .oneOf([true], 'Accept Terms & Conditions is required')
  //   .required(),
});

function EmailForm({ className, id }: { className?: string; id?: string }) {
  const controls = useAnimation();
  const { loggedIn, SignUp } = useAuth();
  const ref = useRef<any>(null);
  const inView = useInView(ref);
  const history = useHistory();
  const {
    values,
    isValid,
    isSubmitting,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    validationSchema,
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      sign: true,
      refId: undefined,
      isInvitedUser: false,
      isAffiliate: false,
      isActiveProfile: true,
    },
    onSubmit: async (formData: any) => {
      if (loggedIn) {
        swal({
          title: 'Already logged in',
          icon: 'success',
        }).then((data) => {
          data && history.push('/my-profile');
        });

        return;
      }
      const name = formData.fullName.replace(/\s{2,}/g, ' ').trim();
      const firstName = name.split(' ').slice(0, -1).join(' ');
      const lastName = name.split(' ').slice(-1).join(' ');

      await SignUp({
        ...formData,
        firstName,
        lastName,
        isActiveProfile: false,
        socialMediaLinks: PreAddedSocialLinks,
        frontendURL: `${window.location.protocol}//${window.location.host}/verify-email`,
        timeOffset: dayjs.tz.guess(),
        onboardingTypeId: 1,
      })
        .then(() => {
          history.push(onboardingSequency[0]);
        })
        .catch((e: Error) => {
          if (e?.message.toLocaleLowerCase() === 'email already exists')
            swal({
              title: 'You already have an account!',
              text: 'Please login below, use a different email address for registration or activate your account if deactivated',
              icon: 'error',
              // buttons: ['Cancel', 'Login'],
              buttons: {
                cancel: {
                  visible: true,
                  text: 'Cancel',
                  closeModal: true,
                },
                login: {
                  visible: true,
                  text: 'Login',
                  closeModal: true,
                },
                activate: {
                  visible: true,
                  text: 'Activate',
                  closeModal: true,
                },
              },
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
        });
    },
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className={className} id={id}>
      <section ref={ref} className="block-form">
        <motion.div
          animate={controls}
          initial="hidden"
          transition={{ duration: 0.8, delay: 0.2 }}
          variants={variants}
          className="sp-container"
        >
          <div className="sp-form-area">
            <h2>Start growing your social revenue today!</h2>
            <p>Enter your email address in the field below to get started.</p>
            <div
              id="w-node-_5e747d09-f72a-02e8-e5ae-78d2476c889c-476c889a"
              className="wrapper-call-to-action"
            >
              <div className="form-block form">
                <div className="field-holder">
                  <FocusInput
                    type="text"
                    className="text-field w-input"
                    name="fullName"
                    placeholder="Enter your name"
                    id="Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName}
                    error={errors.fullName}
                    touched={touched.fullName}
                  />
                </div>

                <div className="field-holder">
                  <FocusInput
                    type="email"
                    className="text-field w-input"
                    name="email"
                    placeholder="Enter your email"
                    autocomplete={'false'}
                    id="Email-4"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
                </div>

                <div className="field-holder">
                  <FocusInput
                    type="password"
                    className="text-field w-input"
                    name="password"
                    placeholder="Enter your password"
                    id="password"
                    onChange={handleChange}
                    autocomplete={'false'}
                    onBlur={handleBlur}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                  />
                </div>
                <div className="submit-holder">
                  <Button
                    className="button color-red s-button"
                    disabled={!isValid && isSubmitting}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Get Started
                  </Button>
                  {isSubmitting && <Spinner />}
                </div>
                {/* <div className="success rounded w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="error w-form-fail">
                  <div>
                    Oops! Something went wrong while submitting the form.
                  </div>
                </div> */}
              </div>
            </div>
            {/* <form action="#" className="sp-form-subscribe">
              <Input type="email" placeholder="Your Email" />
              <div className="field-holder">
                <input
                  type="email"
                  className="text-field w-input"
                  name="email"
                  placeholder="Enter your email"
                  id="Email-4"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <span className="error-state">{errors.email}</span>
                )}
              </div>
              <button type="submit">
                <img
                  src="/assets/images/landing-page/arrow-long.svg"
                  alt="arrow"
                />
              </button>
            </form> */}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
export default styled(EmailForm)`
  .form {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    padding-right: 130px;
    position: relative;

    @media (max-width: 767px) {
      padding-right: 0;
      margin: 0;
    }

    .field-holder {
      padding: 0 5px;
      width: 33.333%;

      @media (max-width: 767px) {
        width: 100%;
        padding: 0;
      }
    }

    .error-state {
      margin: -14px 0 15px;
      font-size: 12px;
      line-height: 15px;
      color: #f00;
      display: block;
    }

    .error-msg {
      text-align: left !important;
      margin: 4px 0 0;
    }

    .submit-holder {
      position: absolute;
      right: 0;
      top: 0;

      @media (max-width: 767px) {
        position: static;
        width: 100%;
      }
    }

    .s-button {
      border: none;
      outline: none;
      box-shadow: none;
      display: block;
      height: 54px;
      padding: 0 10px;
      border-radius: 5px;
      background: linear-gradient(90deg, #fa5853, #f46692 50%, #ffc444);
      cursor: pointer;
      color: #fff;
      font-size: 18px;
      min-width: 125px;

      @media (max-width: 767px) {
        width: 100%;
      }
    }

    .form-control {
      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }

      &:focus {
        border-color: #fa5853;
      }
    }
  }
`;
