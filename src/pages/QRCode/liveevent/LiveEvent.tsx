import { sendInvite } from 'api/event';
import { socialLinksPrefix } from 'appconstants';
import { Instagram, Profile } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import ReactPhoneInput from 'components/PhoneInput';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import { Link, useHistory } from 'react-router-dom';
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
});
export default function LiveEvent() {
  const { inviteParam } = useQuery();
  const history = useHistory();
  // const [format, setFormat] = useState('');
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
    },
    // validateOnBlur:true,
    onSubmit: async (value: any) => {
      const requestObj = {
        ...value,
        eParam: inviteParam,
      };
      let url = (value.instagramHandle || '').trim();
      if (inviteParam) {
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

        await sendInvite({ ...requestObj, instagramHandle: url })
          .then((data: any) => {
            console.log({ data });
            sessionStorage.setItem(
              'message',
              `You will be texted your entry confirmation.`,
            );
            // history.replace('/invite-success');
            if (data.success && data?.data) {
              history.replace(`/viewinvite?invite=${data?.data?._id}`);
            }
            // toast.success('You will be texted your entry confirmation.'),
          })
          .catch((e) => {
            if (e && e.message) {
              toast.error(e.message);
            }
          });
      } else {
        toast.error('Invalid Url');
      }
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
  // /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
  return (
    <div className="landing-page-area">
      <div className="container justify-content-center">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          <strong className="info-text text-primary">
            Please fill out the form below.
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
              <ReactPhoneInput
                isValid={() => {
                  if (touched.phone && errors?.phone) {
                    return errors?.phone;
                  }
                  return true;
                }}
                // onMount={(value: any, data: any, format: any) => {
                //   console.log({ value, data, format }, 'mount');
                //   setFormat(
                //     data.format
                //       ?.replaceAll(' ', '')
                //       ?.replaceAll('  ', '')
                //       // .replaceAll('+', '')
                //       ?.replaceAll('-', '')
                //       ?.replaceAll('(', '')
                //       ?.replaceAll(')', ''),
                //   );
                // }}
                // inputProps={{
                //   name: 'phone',
                //   required: true,
                //   autoFocus: true,
                // }}
                country="us"
                onBlur={onhandleBlur}
                value={values.phone}
                onChange={(
                  value: string,
                  // countrydata: Record<string, any>,
                  // ev: any,
                  // formatvalue,
                ) => {
                  // const formatphone = countrydata.format
                  //   ?.replaceAll(' ', '')
                  //   ?.replaceAll('  ', '')
                  //   // .replaceAll('+', '')
                  //   ?.replaceAll('-', '')
                  //   ?.replaceAll('(', '')
                  //   ?.replaceAll(')', '');
                  // console.log({ value, countrydata, formatvalue });
                  // if (formatphone !== format) {
                  //   setFormat(formatphone);
                  // }

                  value !== undefined && setFieldError('phone', undefined);
                  setFieldValue('phone', `+${value}`);
                }}
              />
            </div>
            <div className="links-area">
              <Button
                htmlType="submit"
                className="mb-20"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                type="primary"
                size="x-large"
              >
                Get Access
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
