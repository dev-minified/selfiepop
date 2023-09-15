import FocusInput from 'components/focus-input';
import FormItem from 'components/Form/FromItem';
import { DashedLine } from 'components/Typography';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { slugify } from 'util/index';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  pageTitle: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long!'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter valid username'),
  // name: yup
  //   .string()
  //   .required('Name is required')
  //   .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter your full name'),
  phone: yup
    .string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      'Invalid Phone Number',
    ),
});
// let tieout: ReturnType<typeof setTimeout>;
const GuestContactForm: React.FC<any> = ({
  onGuestInputChange,
  className,
  order,
  type,
  onGuestInputDataChange,
}) => {
  const guestUser = useAppSelector((state) => state.checkout?.guestUser?.data);
  // const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setValues,
    setFieldValue,
    // setFieldError,
  } = useFormik({
    validationSchema,
    initialValues: {
      phone: guestUser?.phone || '',
      email: guestUser?.email || '',
      name: `${guestUser?.firstName || ''} ${guestUser?.lastName || ''}`.trim(),
      pageTitle: `${guestUser?.pageTitle || ''}`.trim(),
      password: ' ',
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: `${order?.buyer?.pageTitle ?? 'Incognito User'}`.trim(),
      phone: order?.buyer?.phone || '',
      email:
        type === ServiceType.CHAT_SUBSCRIPTION || order?.coupon
          ? order?.buyer?.email
          : '',
      pageTitle: order?.buyer?.pageTitle,
      password: ' ',
    }));

    setTimeout(() => {
      setFieldValue('password', '');
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const getGuestUserFields = () => {
    return (
      <>
        {/* <div className="input-wrap">
          <FormItem label="Name">
            <FocusInput
              placeholder="Name"
              id="guestName"
              name="name"
              type="text"
              error={errors.name}
              touched={touched.name}
              onChange={(e) => {
                onGuestInputChange('name', e.target.value, errors);
                handleChange(e);
              }}
              onBlur={handleBlur}
              value={values.name}
            />
          </FormItem>
        </div> */}
        <div className="input-wrap">
          <FormItem label="Your Name">
            <FocusInput
              placeholder="Name"
              id="guestUsername"
              name="pageTitle"
              type="text"
              error={errors.pageTitle}
              touched={touched.pageTitle}
              validations={[{ noMultipeSpace: true }]}
              // validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
              onChange={(e) => {
                handleChange(e);
                onGuestInputDataChange?.({
                  username: slugify(e.target.value),
                  pageTitle: e.target.value,
                });
                // setTimeout(() => {
                //   validateUsername(e.target.value);
                // }, 0);
              }}
              onBlur={(e) => {
                console.log({ pat: errors.pageTitle });
                // if (!errors.pageTitle) {
                handleBlur(e);
                // }
              }}
              value={values.pageTitle}
            />
            {/* {isCheckingUserName ? (
              <span>Checking username availability...</span>
            ) : null} */}
          </FormItem>
        </div>
        <div className="input-wrap">
          <FormItem label="Contact Email">
            <FocusInput
              placeholder="Email Address"
              id="guestEmail"
              name="email"
              type="email"
              error={errors.email}
              touched={touched.email}
              onChange={(e) => {
                onGuestInputChange('email', e.target.value, errors);
                handleChange(e);
              }}
              onBlur={handleBlur}
              value={values.email}
            />
          </FormItem>
        </div>
        <div className="input-wrap">
          <FormItem label=" Password">
            <FocusInput
              placeholder="Password"
              id="guestPassword"
              name="password"
              type="password"
              error={errors.password}
              touched={touched.password}
              onChange={(e) => {
                onGuestInputChange('password', e.target.value, errors);
                handleChange(e);
              }}
              onBlur={handleBlur}
              value={values.password}
            />
          </FormItem>
        </div>
      </>
    );
  };

  return (
    <div>
      <form className={className}>
        <div className="mb-30 guest-fields-area">{getGuestUserFields()}</div>
        <hr className="mb-30 d-none" />
      </form>
      <DashedLine className="my-20 my-md-50" />
    </div>
  );
};

export default styled(GuestContactForm)`
  .no-arrow {
    -moz-appearance: textfield;
  }
  .no-arrow::-webkit-inner-spin-button {
    display: none;
  }
  .no-arrow::-webkit-outer-spin-button,
  .no-arrow::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .guest-fields-area {
    .form-control {
      .sp_dark & {
        background: #fff;
        color: rgba(0, 0, 0, 0.8);

        &::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
`;
