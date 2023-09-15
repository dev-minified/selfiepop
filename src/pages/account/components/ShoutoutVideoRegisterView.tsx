import FocusInput from 'components/focus-input';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import { onboardingSequency } from 'util/index';
import * as yup from 'yup';

interface Props {
  className?: string;
  order?: any;
}

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
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must be the combination of upercase, lowercase, number, and special character',
    )
    .max(50)
    .min(8)
    .required('Password is required'),
});

const ShoutoutVideoRegisterView: React.FC<Props> = ({ className, order }) => {
  const { SignUp } = useAuth();
  const history = useHistory();

  const {
    values,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
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
    onSubmit: async (formData) => {
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
        onboardingTypeId: 3,
      })
        .then(() => {
          history.push(onboardingSequency[0]);
        })
        .catch((e: Error) => {
          if (e?.message.toLocaleLowerCase() === 'email already exists')
            swal({
              title: 'You already have an account!',
              text: 'Please login below, use a different email address for registration',
              icon: 'error',
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
              },
            }).then(async (value) => {
              switch (value) {
                case 'login':
                  history.push('/login');
                  break;
              }
            });
        });
    },
  });
  const {
    buyerFirstName,
    buyerLastName,
    sellerFirstName,
    sellerLastName,
    sellerProfileImage,
  } = order || ({} as any);
  return (
    <div className={className}>
      <div className="text-center user-detail">
        <div className="profile-image">
          <ImageModifications
            fallbackUrl={'/assets/images/default-profile-img.svg'}
            src={sellerProfileImage}
            imgeSizesProps={{
              onlyDesktop: true,

              imgix: { all: 'w=163&h=163' },
            }}
            alt="seller"
          />
        </div>
        {order && (
          <>
            <p>
              <strong className="name">{`${buyerFirstName} ${buyerLastName} `}</strong>{' '}
              has sent you a custom video greeting made by{' '}
              <strong className="seller-name">{` ${sellerFirstName} ${sellerLastName} `}</strong>
            </p>
            <span className="title-info">
              Please register to view your video.{' '}
            </span>
          </>
        )}
      </div>
      <form action="post" onSubmit={handleSubmit} className="form">
        <div className="fields-wrap">
          <div className="field">
            <FocusInput
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              touched={touched.fullName}
              label="Full Name"
              inputClasses="mb-20"
              name="fullName"
              value={values.fullName}
              validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
            />
          </div>
          <div className="field">
            <FocusInput
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              label="Email Address"
              inputClasses="mb-20"
              name="email"
              value={values.email}
            />
          </div>
          <div className="field">
            <FocusInput
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              label="Password"
              type="password"
              limit={50}
              inputClasses="mb-20"
              name="password"
              value={values.password}
            />
          </div>
        </div>
        <div className="links-area">
          <Button
            htmlType="submit"
            disabled={!isValid && isSubmitting}
            isLoading={isSubmitting}
            size="x-large"
            block
            type="primary"
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default styled(ShoutoutVideoRegisterView)`
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 0;

  .user-detail {
    font-size: 22px;
    line-height: 34px;
    color: #666;

    strong {
      font-weight: 500;
      color: #000;
    }

    .title-info {
      display: block;
      font-size: 17px;
      line-height: 25px;
      margin: 0 0 23px;
    }
  }

  .profile-image {
    width: 164px;
    height: 164px;
    border: 2px solid #fff;
    border-radius: 100%;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.14);
    margin: 0 auto 39px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .fields-wrap {
    background-color: #f4f6f9;
    padding: 30px 30px 10px;
    margin: 0 0 30px;
    border-radius: 8px;
  }

  .button-primary {
    background: #000;
  }
`;
