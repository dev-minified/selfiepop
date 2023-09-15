import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import ReactPhoneInput from 'components/PhoneInput';
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
  phone: yup
    .string()
    .max(15)
    // .matches(
    //   /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
    //   'Invalid Phone Number',
    // )
    .required('Enter Phone Number'),
});
type IphonenumberProps = {
  phone?: string;
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
function SetPhoneNumber(props: IphonenumberProps) {
  const {
    phone,
    seller,
    onSubmit: onSubmitCallback,
    showAvatar = true,
    bottomLinkSettings,
    isSubmitting: isFormSubmitting,
    className,
  } = props;
  const { values, errors, setFieldValue, handleSubmit } = useFormik({
    validationSchema,
    initialValues: {
      phone: phone || '',
    },
    onSubmit: async (values) => {
      return await onSubmitCallback?.(values);
    },
  });
  useEffect(() => {
    if (phone) {
      setFieldValue('phone', phone || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);
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
            Please enter your phone number below to be notified when
            <span className="text-primary">
              &nbsp;{seller?.pageTitle ?? 'Incognito User'}
              &nbsp;
            </span>
            directly contacts you.
          </h5>
        </div>
        <div className="mb-30 ">
          {/* FIXME: Radio buttons not working */}
          {/* <FocusInput
            hasIcon={true}
            prefixElement={<Phone />}
            value={values.phone || ''}
            type="text"
            label={'Mobile Phone Number'}
            name="phone"
            placeholder="+12025550138"
            onBlur={handleBlur}
            limit={15}
            validations={[{ type: 'phone', noSpace: true }]}
            error={errors.phone}
            touched={touched.phone}
            onChange={handleChange}
            materialDesign
          /> */}
          <ReactPhoneInput
            isValid={() => {
              if (values.phone && errors?.phone) {
                return errors?.phone;
              }
              return true;
            }}
            // inputProps={{
            //   name: 'phone',
            //   required: true,
            //   autoFocus: true,
            // }}
            country="us"
            value={values.phone}
            onChange={(value: string) => {
              setFieldValue('phone', `+${value}`);
            }}
          />
          <div className="d-flex justify-content-center align-items-center flex-wrap btns-holder">
            <Button
              htmlType="button"
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
              size="large"
              disabled={isFormSubmitting}
              isLoading={isFormSubmitting}
            >
              NEXT
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
                {bottomLinkSettings.text || 'Skip this step'}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
export default styled(SetPhoneNumber)`
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
  }

  .btns-holder {
    a {
      margin: 0 0 0 15px;
    }
  }
  .react-tel-input {
    margin-bottom: 20px;
    z-index: 4;
  }
  .react-tel-input .country-list {
    margin: 0;
  }
  .react-tel-input .form-control {
    width: 100%;
    height: 40px;
    padding: 10px 17px 10px 48px;
    border-color: var(--pallete-background-pink);
    font-size: 15px;
    line-height: 18px;
    background: var(--pallete-background-default);

    .sp_dark & {
      background: #fff;
      color: #333;
    }

    .modal-content & {
      border-color: #cacaca;
    }
  }
  .flag-dropdown {
    background: var(--colors-grey-100);
    .sp_dark & {
      background: #e6e6e6;
    }
    .selected-flag {
      &.open {
        background: var(--pallete-background-default);
      }
      &:focus,
      &:hover {
        background: var(--pallete-background-default);
      }
    }
    .country-list {
      background: var(--pallete-background-default);
      .country {
        &.highlight {
          background: var(--pallete-background-light);
        }
        &:hover {
          background: var(--pallete-background-light);
        }
      }
    }
  }
`;
