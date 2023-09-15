import { update } from 'api/User';
import NewButton from 'components/NButton';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { Cookies } from 'react-cookie';
import styled from 'styled-components';
import swal from 'sweetalert';
import * as yup from 'yup';
import FocusInput from '../focus-input';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password should be atleast 6 characters long.'),
  changepassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], "Passwords don't match")
    .required('Confirm Password is required'),
});

const InputWrap = styled.div`
  width: 100%;
  margin: 0 0 14px;

  .error-msg {
    display: block;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
    color: #f00;
    display: none;
    /* margin-top: -15px; */
  }

  &.sm {
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
  }

  &.md {
    max-width: 526px;
    margin-left: auto;
    margin-right: auto;
  }

  &.error .form-control {
    color: #f00;
    border-width: 1px;
    border-color: #e5d804 !important;
  }

  &.error .error-msg {
    display: block;
  }
`;
const cookies = new Cookies();
export default function MyProfile({
  onSuccessCallback,
  title,
  requestProps = {},
  fullWidth = false,
  type = 'set',
  submitButtonText,
  sendEvent,
  onBeforeSubmit,
}: any) {
  const { setLoggedData } = useAuth();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    validationSchema,
    initialValues: {
      oldPassword: '',
      password: '',
      changepassword: '',
    },
    validate: (values: any) => {
      const errors: any = {};
      if (type === 'reset' && !values.oldPassword) {
        errors.oldPassword = 'Field cannot be empty';
      }
      if (values.password !== values.changepassword) {
        errors.changepassword = 'Your password does not match';
      }
      return errors;
    },
    onSubmit: async (values: any) => {
      if (onBeforeSubmit) {
        await onBeforeSubmit?.();
      }
      await update({ ...values, isPasswordSet: true, ...requestProps }).then(
        (res) => {
          setLoggedData({
            data: { ...res.data, showPurchaseMenu: true },
            token: cookies.get('token'),
            refreshToken: cookies.get('refreshToken'),
          });
          onSuccessCallback &&
            onSuccessCallback({ ...res.data, showPurchaseMenu: true });
          setValues({ oldPassword: '', password: '', changepassword: '' });
          resetForm();
          sendEvent?.();
          swal({
            title: `${
              type === 'reset' ? 'Changed Password' : 'Password Created'
            }`,
            text: `${
              type === 'reset'
                ? 'Password changed successfully'
                : 'Password set successfully'
            }`,
            icon: 'success',
          });
        },
      );
    },
  });
  return (
    <>
      <div>
        <div className="profile--info mb-30 mb-md-50">
          <h1 className="text-center"> </h1>
          <h3 className={type !== 'reset' ? 'text-center' : ''}>{title}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-30">
            {type === 'reset' && (
              <InputWrap
                className={`input-wrap ${
                  !fullWidth ? 'sm' : ''
                } mb-30 mb-md-50`}
              >
                <FocusInput
                  label="Current Password"
                  name="oldPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  dataLpignore="true"
                  autocomplete="off"
                  value={values.oldPassword}
                  touched={touched.oldPassword}
                  error={errors.oldPassword}
                />
              </InputWrap>
            )}
            <InputWrap
              className={`input-wrap ${!fullWidth ? 'sm' : ''} mb-30 mb-md-50`}
            >
              <FocusInput
                label="New Password"
                name="password"
                type="password"
                dataLpignore="true"
                autocomplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                touched={touched.password}
                error={errors.password}
              />
            </InputWrap>
            <div style={{ clear: 'both' }} />
            <InputWrap className={`input-wrap ${!fullWidth ? 'sm' : ''}`}>
              <FocusInput
                label="Confirm New Password"
                name="changepassword"
                type="password"
                dataLpignore="true"
                autocomplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.changepassword}
                touched={touched.changepassword}
                error={errors.changepassword}
              />
            </InputWrap>
            <div className="d-flex justify-content-center mt-50 mb-15">
              <NewButton
                type="primary"
                htmlType="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {submitButtonText || 'NEXT'}
              </NewButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
