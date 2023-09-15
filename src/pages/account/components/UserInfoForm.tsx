import NewButton from 'components/NButton';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import 'styles/section-head.css';
import swal from 'sweetalert';
import * as yup from 'yup';
import { checkUserName } from '../../../api/User';
import FocusInput from '../../../components/focus-input';
import { slugify } from '../../../util/index';

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .max(255, 'Too Long!')
    .required('Enter your first name'),
  lastName: yup.string().max(255, 'Too Long!').required('Enter your last name'),
});
const PopLinkField = (props: any) => {
  return (
    <div className="url-holder">
      <p>www.selfiepop.com/</p>
      <FocusInput {...props} />
    </div>
  );
};

type Props = {
  authUser: any;
  onSubmit(values: any): void;
};

const UserInfoForm: React.FC<Props> = (props) => {
  const { authUser, onSubmit } = props;
  const [cLoader, setCLoader] = useState<any>({});

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldError,
    setValues,
  } = useFormik({
    validationSchema,
    validate: (values: any) => {
      const err: any = { ...errors };
      if (values.firstName !== '') {
        delete err['firstName'];
      }
      if (values.lastName !== '') {
        delete err['lastName'];
      }
      return err;
    },
    initialValues: {
      firstName: authUser?.firstName,
      lastName: authUser?.lastName,
      username: authUser?.username || '',
    },

    onSubmit,
  });

  useEffect(() => {
    setValues({
      firstName: authUser?.firstName,
      lastName: authUser?.lastName,
      username: authUser?.username || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const validateUsername = (value: string) => {
    const reg = /[^A-Za-z0-9-_]/g;
    if (value && reg.test(value)) {
      setFieldError(
        'username',
        'Username Can only contain - and _ along with alpha-numeric characters',
      );
      return;
    }
    if (!value) {
      setFieldError('username', 'Enter valid username');
      return;
    }

    const slug = slugify(value);
    if (slug?.length <= 2) {
      setFieldError('username', 'Username must be at least 3 characters long!');
      return;
    }
    setFieldError('username', '');
    setCLoader({ username: value });
    checkUserName(slug)
      .then(() => {
        setCLoader({});
        setFieldError('username', undefined);
      })
      .catch(() => {
        setCLoader({});
        setFieldError('username', 'Username has already been taken');
      });
  };

  return (
    <form
      id="profileSettingsForm"
      onSubmit={(e) => {
        e.preventDefault();
        const errorsT = JSON.parse(JSON.stringify(errors, null, 2));
        const errors1: any = { ...errorsT };
        const totalErrors = Object.keys(errors1).length;

        if (totalErrors > 0) {
          swal(
            Object.keys(errors1).reduce((result, key: string) => {
              return `${errors1[key]}\n${result}`;
            }, ''),
          );
          return;
        }
        handleSubmit(e);
      }}
    >
      <h3 className="section-title">My Information</h3>
      <div className="input-wrap ">
        <FocusInput
          error={errors.firstName}
          touched={touched.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.firstName}
          label="First Name"
          validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
          id="firstName"
          name="firstName"
        />
      </div>
      <div className="input-wrap">
        <FocusInput
          label="Last Name"
          id="lastName"
          name="lastName"
          error={errors.lastName}
          touched={touched.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
          value={values.lastName}
        />
      </div>
      <h5 className="section-title">My Pop Page URL</h5>
      <div className="input-wrap">
        <PopLinkField
          id="username"
          name="username"
          dataLpignore="true"
          autocomplete="off"
          hasLabel={false}
          error={errors.username}
          touched={true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            setTimeout(() => {
              validateUsername(e.target.value);
            }, 0);
          }}
          onBlur={handleBlur}
          value={values.username}
          isLoading={cLoader.username}
        />
      </div>
      <div className="d-flex justify-content-center">
        <NewButton
          type="primary"
          htmlType="submit"
          isLoading={isSubmitting || cLoader.username}
          disabled={isSubmitting}
        >
          Save Details
        </NewButton>
      </div>
    </form>
  );
};

export default UserInfoForm;
