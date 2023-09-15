import { sendPromo } from 'api/event';
import { socialLinksPrefix } from 'appconstants';
import { Instagram, Profile } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import { default as NButton } from 'components/NButton';
import ReactPhoneInput from 'components/PhoneInput';
import SelfiepopText from 'components/selfipopText';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Logo from 'theme/logo';
import { isValidUrl } from 'util/index';
import * as yup from 'yup';
const validationSchema = yup.object().shape({
  name: yup.string().required('Enter your name'),
  instagramHandle: yup.string().required('Enter your Instagram Handle'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter full name'),
  phone: yup
    .string()
    // .max(14)
    // .matches(
    //   /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
    //   'Invalid Phone Number',
    // )
    .required('Enter Phone Number'),
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
});
const Streetpromo = ({ className }: { className?: string }) => {
  const { inviteParam } = useQuery();
  const history = useHistory();
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldError,
    isValid,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      phone: '',
      name: '',
      instagramHandle: '',
      email: '',
    },
    // validateOnBlur:true,
    onSubmit: async (value: any) => {
      const requestObj = {
        ...value,
        eParam: inviteParam,
      };
      let url = (value.instagramHandle || '').trim();

      if (!url) {
        setFieldError(
          'instagramHandle',
          'Please provide valid instagram handle',
        );
        return;
      }
      url = url.replaceAll(' ', '');
      if (!isValidUrl(url)) {
        url = `${
          socialLinksPrefix.find((s) => s.type === 'instagram')?.platformUrl
        }${url.replaceAll('@', '')}`;
      }
      // url = url?.trim()?.length
      //   ? `${
      //       socialLinksPrefix.find((s) => s.type === 'instagram')?.platformUrl
      //     }${url.replaceAll('@', '')}`
      //   : '';

      await sendPromo({ ...requestObj, instagramHandle: url })
        .then((data: any) => {
          console.log({ data });
          sessionStorage.setItem(
            'message',
            `Thank you. Please check your email`,
          );
          history.replace('/invite-success');

          // toast.success('You will be texted your entry confirmation.'),
        })
        .catch((e) => {
          if (e && e.message) {
            toast.error(e.message);
          }
        });
    },
  });
  const onhandleBlur = () => {
    const phoneRegix = new RegExp(
      /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
    );

    if (!phoneRegix.test(values.phone)) {
      setFieldError('phone', 'Invalid Phone Number');
    }
  };
  return (
    <div className={`${className} landing-page-area`}>
      <div className="container justify-content-center">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          <strong className="info-text text-primary">
            Fill out this form to get started with <SelfiepopText />!
          </strong>
          <form action="post" className="form" onSubmit={handleSubmit}>
            <div className="field">
              <FocusInput
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.instagramHandle}
                materialDesign
                prefixElement={<Instagram />}
                touched={touched.instagramHandle}
                label="Instagram handle *"
                inputClasses="mb-25 field-instagram"
                name="instagramHandle"
                value={values.instagramHandle}
                validations={[{ noSpace: true }]}
              />
            </div>
            <div className="user-name field">
              <FocusInput
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                materialDesign
                prefixElement={<Profile />}
                touched={touched.name}
                label="Name *"
                inputClasses="mb-25"
                name="name"
                value={values.name}
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
              <ReactPhoneInput
                isValid={() => {
                  if (touched.phone && errors?.phone) {
                    return errors?.phone;
                  }
                  return true;
                }}
                onBlur={onhandleBlur}
                // inputProps={{
                //   name: 'phone',
                //   required: true,
                //   autoFocus: true,
                // }}
                country="us"
                value={values.phone}
                onChange={(value: string) => {
                  value !== undefined && setFieldError('phone', undefined);
                  setFieldValue('phone', `+${value}`);
                }}
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
                Get Access
              </NButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default styled(Streetpromo)`
  .react-tel-input .form-control {
    border-color: var(--pallete-background-pink);
    background: var(--pallete-background-default);
  }
  .react-tel-input {
    .flag-dropdown {
      background: var(--colors-grey-100);
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
  }
`;
