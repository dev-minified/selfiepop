// import 'cropperjs/dist/cropper.css';
import { InfoIcon } from 'assets/svgs';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/invitation.css';
import 'styles/live-link-bar.css';
import 'styles/share-popup.css';
import { useAnalytics } from 'use-analytics';
import * as yup from 'yup';
import Button from '../NButton';
import Input from '../input';
Modal.setAppElement('#root');

const PopupArea = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.81);
  overflow: auto;

  .popup-area__wrap {
    display: table;
    width: 100%;
    height: 100%;
  }

  .popup-area__frame {
    display: table-cell;
    vertical-align: middle;
    padding: 0 20px;
  }

  .share-popup {
    background: #fff;
    color: #000;
    padding: 15px 20px;
    margin: 20px auto;
    max-width: 375px;

    .title {
      margin: 0;
    }

    .btn-close {
      background: none;
      color: #000;
      padding: 0;
      cursor: pointer;
      font-size: 24px;
      font-weight: 400;
      position: static;
    }

    h3 {
      color: #000;
      font-size: 16px;
      line-height: 22px;
      color: #495057;
      text-align: left;
      padding: 0;
      margin: 0 0 14px;

      a {
        color: #000;
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  .popup-box__detail-area {
    padding: 0;
    color: #000;
  }

  .popup-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 13px;
  }

  .title {
    color: #000;
    text-transform: uppercase;

    svg {
      width: 20px;
      height: auto;
      margin: -4px 16px 0px 0px;
      display: inline-block;
      vertical-align: middle;

      path {
        fill: currentColor;
      }
    }
  }

  .form-block {
    padding: 0;

    .input {
      background: #f8fafd;
      border-radius: 5px;
      padding: 15px;
      margin: 0 0 16px;
    }

    .text-input {
      margin: 0 !important;
    }

    .form-control {
      height: 40px;
      padding: 7px 15px 5px;
      font-size: 14px;
      line-height: 24px;
      border: 1px solid #d8d8d8;
      background: #fff;
      border-radius: 3px;
      margin: 0;
    }

    .error-msg {
      padding: 10px 0 0 !important;
    }

    .btn {
      margin: 0 0 14px;

      &:not(:hover) {
        background: #000;
        color: #fff;
      }
    }
  }

  .psw-reset {
    a {
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  a {
    color: #000;
  }
`;

const validationSchema = yup.object().shape({
  password: yup.string().required('Enter your password'),
});
const SignUpPopUP: React.FC<any> = ({
  isOpen,
  onClose,
  onSuccessCallback,
  email,
}: any) => {
  const { identify } = useAnalytics();
  const { Login } = useAuth();
  const [serverError, setserverError] = useState<string | null>(null);

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    resetForm,
    handleSubmit,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      password: '',
    },
    // validateOnBlur:true,
    onSubmit: async (formData: any) => {
      try {
        const user = await Login({ email, password: formData.password });
        identify(user?._id);
        await onSuccessCallback?.(user);
      } catch (e: any) {
        setserverError(e.message);
      }
    },
  });
  const handleClose = () => {
    onClose && onClose();
    resetForm();
  };
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleClose}
      className="modal"
      overlayClassName="Overlay"
    >
      <div className="modal-dialog">
        <div className="modal-content" style={{ border: 'hidden' }}>
          <PopupArea className="popup-area signup">
            <div className="popup-area__wrap">
              <div className="popup-area__frame">
                <div className="share-popup popup-box">
                  <div className="popup-head">
                    <strong className="title">
                      <InfoIcon />
                      WE’RE SORRY
                    </strong>
                    <span className="btn-close" onClick={handleClose}>
                      &times;
                    </span>
                  </div>
                  <div className="popup-box__detail-area">
                    <h3 className="popup-box__subtitle">
                      This email address already exists. Please enter your
                      password and continue or{' '}
                      <Link
                        target="_blank"
                        to={`/recover-password`}
                        className="link"
                      >
                        Click Here
                      </Link>{' '}
                      to reset your password.
                    </h3>
                  </div>
                  {serverError && (
                    <div className="alert alert-message">{serverError}</div>
                  )}
                  <form className="form-block" onSubmit={handleSubmit}>
                    <div className="input">
                      <Input
                        id="passowrd"
                        name="password"
                        className="form-control"
                        type="password"
                        hasLabel={false}
                        placeholder="Password"
                        error={errors.password}
                        touched={touched.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                    </div>

                    <div className="text-center">
                      <Button
                        htmlType="submit"
                        className="btn btn-black"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Sign In
                      </Button>
                      <div className="psw-reset">
                        <Link
                          target="_blank"
                          to={`/recover-password`}
                          className="link"
                        >
                          Reset password
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </PopupArea>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpPopUP;
