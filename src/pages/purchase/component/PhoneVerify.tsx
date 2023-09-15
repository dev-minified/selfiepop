import AvatarStatus from 'components/AvatarStatus';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
dayjs.extend(utc);
dayjs.extend(timezone);

const validationSchema = yup.object().shape({
  otp: yup
    .number()
    .min(8, 'Please enter 8 digit number you were sent over text')
    .required('OTP is required'),
});
type IphonenumberProps = {
  otp?: string;
  seller?: Record<string, any>;
  onSubmit?: (values: any) => void | Promise<any>;
  showAvatar?: boolean;
  bottomLinkSettings?: {
    showbottomLink?: boolean;
    text?: string;
    onClick?: () => void;
  };
  isSubmitting?: boolean;
  className?: string;
};
function PhoneNumberVerification(props: IphonenumberProps) {
  const {
    otp,
    seller,
    onSubmit: onSubmitCallback,
    showAvatar = true,
    bottomLinkSettings,
    isSubmitting: isFormSubmitting,
    className,
  } = props;

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    validationSchema,
    initialValues: {
      otp: undefined,
    },
    onSubmit: async (values) => {
      await onSubmitCallback?.(values);
    },
  });
  useEffect(() => {
    if (otp) {
      setFieldValue('otp', otp || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);
  return (
    <>
      <div className={className}>
        <div className="profile--info mb-30">
          {showAvatar ? (
            <AvatarStatus
              imgSettings={{
                onlyDesktop: true,

                imgix: { all: 'w=200&h=200' },
              }}
              src={
                seller?.profileImage || '/assets/images/default-profile-img.svg'
              }
              fallbackUrl={'/assets/images/default-profile-img.svg'}
            />
          ) : null}
          <h5 className="text-center">
            Please enter 8 digit OTP sent over to you on your mobile number.
          </h5>
        </div>
        <div className="mb-30">
          {/* FIXME: Radio buttons not working */}
          <FocusInput
            placeholder="Enter 8 digit code sent to you."
            id="guestPhone"
            name="otp"
            // type="number"
            value={values.otp}
            touched={touched.otp}
            error={errors.otp}
            validations={[{ type: 'number', noSpace: true }]}
            limit={8}
            onChange={(e) => {
              handleChange(e);
            }}
            onBlur={handleBlur}
          />
          <div className="d-flex justify-content-center align-items-center flex-wrap btns-holder">
            <Button
              htmlType="submit"
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
              size="large"
              isLoading={isFormSubmitting}
            >
              Confirm
            </Button>
            {bottomLinkSettings?.showbottomLink ? (
              <Link
                to={``}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  bottomLinkSettings?.onClick?.();
                }}
              >
                {bottomLinkSettings.text || 'Go Back'}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default styled(PhoneNumberVerification)`
  .user-image {
    margin: 0 auto 15px;
  }

  .text-input {
    .pre-fix {
      width: 18px;
      height: 18px;
      top: 11px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .form-control {
      &::placeholder {
        color: var(--pallete-text-main-500);
      }
    }
  }

  .btns-holder {
    a {
      margin: 0 0 0 15px;
    }
  }
`;
