import { requestChangeEmailAddress } from 'api/Otp';
import { placeSearch } from 'api/Utils';
import { timezones } from 'appconstants';
import AutoComplete from 'components/autoComplete';
import FocusInput from 'components/focus-input';
import NewButton from 'components/NButton';
import Select from 'components/Select';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useOpenClose from 'hooks/useOpenClose';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import 'styles/section-head.css';
import swal from 'sweetalert';
import * as yup from 'yup';
import UpdateEmailModal from './UpdateEmailModal';
const timeZOneOption = timezones.map((data: string) => ({
  value: data,
  label: data,
}));

const AddressCityContainer = styled.div`
  display: flex;

  .input-wrap {
    flex: 1;
    margin-right: 10px !important;
  }

  .input-wrap:last-child {
    margin-right: 0 !important;
  }

  .input-wrap:nth-child(1) {
    flex: 2;
  }

  input {
    height: 58px !important;
  }
`;

type Props = {
  authUser: any;
  onSubmit(values: any): Promise<any>;
  updateLocalUser(values: any): void;
};
const validationSchema = yup.object().shape({
  phone: yup.string().max(15, 'Max 15 digits allowed'),
});
const AddressForm: React.FC<Props> = (props) => {
  const { authUser, onSubmit: onSubmitHandler, updateLocalUser } = props;
  const [isOpen, onOpen, OnClose] = useOpenClose();
  const [mailOne, setMailOne] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [EmailUpdatin, setEmailUpdating] = useState(false);
  const [validateEmail, setValidateEmail] = useState('');

  // useEffect(() => {
  //   getCountries();
  // }, []);

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    setValues,
  } = useFormik({
    validateOnChange: true,
    validationSchema,
    initialValues: {
      phone: authUser?.phone || '',
      zip: authUser?.zip || '',
      timezone: authUser?.timeOffset || '',
      city: authUser?.city || '',
      state: authUser?.state || '',
      address2: authUser?.address2 || '',
      address1: authUser?.address1 || '',
    },

    onSubmit: async (values) => {
      return onSubmitHandler({ ...values, timeOffset: values.timezone });
    },
  });

  useEffect(() => {
    setValues({
      phone: authUser?.phone || '',
      zip: authUser?.zip || '',
      timezone: authUser?.timeOffset || '',
      city: authUser?.city || '',
      state: authUser?.state || '',
      address2: authUser?.address2 || '',
      address1: authUser?.address1 || '',
    });
    setEmail(authUser?.email || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // This method handles the search for area
  const mailHandler = useCallback(
    (value: any, type: any) => {
      if (value) {
        setMailOne([]);
        if (type === 'addressTwo') {
          setFieldValue('address2', value);
        } else {
          setFieldValue('address1', value);
        }
        placeSearch(value)
          .then((res) => {
            setMailOne(res.data.predictions);
          })
          .catch(console.log);
      } else {
        if (type === 'addressTwo') {
          setFieldValue('address2', '');
        } else {
          setFieldValue('address1', '');
        }
        setMailOne(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authUser],
  );
  // This method handles the values if selected from dropdown
  const valueHandler = useCallback((value: any, type: string) => {
    switch (type) {
      case 'addressOne':
        const parsed = value.split(',');
        const country = parsed[parsed.length - 1];
        const state = parsed[parsed.length - 2];
        const city = parsed[parsed.length - 3];
        const address = parsed.slice(0, -3).join(',');
        setFieldValue('country', country);
        setFieldValue('state', state);
        setFieldValue('city', city);
        setFieldValue('address1', address);

        setMailOne([]);
        break;
      case 'addressTwo':
        setFieldValue('address2', value);
        setMailOne([]);
        break;
    }
    setMailOne(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const areafilterHandler = (value: string, type: string) => {
    setFieldValue(type, value);
    // switch (type) {
    //   case 'country':
    //     if (value) {
    //       let _countries = [...countries];
    //       _countries = _countries.filter((sin) => {
    //         return (
    //           sin.description.toLowerCase().indexOf(value.toLowerCase()) !==
    //           -1
    //         );
    //       });
    //       setCopyCountries(_countries);
    //     } else {
    //       setCopyCountries([...countries]);
    //     }
    //     break;
    //   case 'state':
    //     let _state = [...states];
    //     if (value) {
    //       _state = _state.filter((sin) => {
    //         return (
    //           sin.description.toLowerCase().indexOf(value.toLowerCase()) !==
    //           -1
    //         );
    //       });
    //       setCopyStates(_state);
    //     } else {
    //       setCopyStates([...states]);
    //     }
    //     break;
    //   case 'city':
    //     let _city = [...cities];
    //     if (value) {
    //       _city = _city.filter((sin) => {
    //         return (
    //           sin.description.toLowerCase().indexOf(value.toLowerCase()) !==
    //           -1
    //         );
    //       });
    //       setCopyCities(_city);
    //     } else {
    //       setCopyCities([...cities]);
    //     }
    //     break;
    // }
  };

  const areaValuehandler = (value: string, type: string) => {
    setFieldValue(type, value);
  };
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    const errorsT = JSON.parse(JSON.stringify(errors, null, 2));
    const errors1: any = { ...errorsT };
    const totalErrors = Object.keys(errors1).length;

    if (totalErrors > 0) {
      swal(
        Object.keys(errors1).reduce((result, key: string) => {
          return `${key}: ${errors1[key]}\n${result}`;
        }, ''),
      );
      return;
    }
    handleSubmit(e);
  };
  const updateEmail = (email: string) => {
    setEmailUpdating(true);
    requestChangeEmailAddress({ email })
      .then(() => {
        setEmailUpdating(false);
        updateLocalUser({ email });
        toast.success('Email updated successfully');
      })
      .catch((err) => {
        toast.error(err?.message);
        setEmailUpdating(false);
      });
  };
  return (
    <>
      <UpdateEmailModal onClose={OnClose} isOpen={isOpen} email={email} />
      <form
        id="profileSettingsForm"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          submitHandler(e);
        }}
      >
        <h3 className="section-title mt-50">Contact Information</h3>
        <div className="input-wrap">
          <FocusInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            dataLpignore="true"
            autocomplete="off"
            error={!!validateEmail && validateEmail}
            touched={true}
            onChange={(e: any) => {
              const emailRegex = RegExp(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
              );
              setEmail(e.target.value);
              if (emailRegex.test(e.target.value)) {
                setValidateEmail('');
              } else {
                setValidateEmail('Please Enter Valid Email');
              }
            }}
            onBlur={(e: any) => {
              const emailRegex = RegExp(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g,
              );
              if (emailRegex.test(e.target.value)) {
                setValidateEmail('');
              } else {
                setValidateEmail('Please Enter Valid Email');
              }
            }}
            value={email}
          />
        </div>
        <div className="d-flex justify-content-center  mb-20">
          <NewButton
            type="primary"
            onClick={() => {
              authUser?.isEmailVerified ? onOpen() : updateEmail(email);
            }}
            disabled={!!validateEmail || EmailUpdatin}
            isLoading={EmailUpdatin}
          >
            Update Email Address
          </NewButton>
        </div>
        <div className="input-wrap">
          <FocusInput
            label="Phone Number (Optional)"
            id="phone"
            name="phone"
            value={values.phone}
            touched={touched.phone}
            error={errors.phone}
            onChange={handleChange}
            validations={[{ type: 'number' }]}
            limit={15}
            onBlur={handleBlur}
          />
        </div>
        <h3 className="section-title mt-50">Mailing Address (Optional)</h3>
        <div className="input-wrap position-relative customAutoComplete">
          <AutoComplete
            label="Address Line 1"
            id="address1"
            name="address1"
            value={values.address1}
            result={mailOne}
            onChange={mailHandler}
            onBlur={(e: any) => {
              mailHandler(e.target.value, 'addressOne');
            }}
            onSelect={valueHandler}
            fieldType="addressOne"
          />
        </div>

        <div className="input-wrap position-relative customAutoComplete">
          <AutoComplete
            label="Address Line 2"
            id="address2"
            name="address2"
            value={values.address2}
            onBlur={(e: any) => {
              mailHandler(e.target.value, 'addressTwo');
            }}
            result={mailOne}
            onChange={mailHandler}
            onSelect={valueHandler}
            fieldType="addressTwo"
          />
        </div>
        <AddressCityContainer>
          <div className="input-wrap position-relative customAutoComplete">
            <AutoComplete
              label="City"
              id="city"
              name="city"
              value={values.city}
              onBlur={(e: any) => {
                setFieldValue(e.target.value, 'city');
              }}
              onChange={areafilterHandler}
              onSelect={areaValuehandler}
              allowEmptyChange={true}
              fieldType="city"
            />
          </div>

          <div className="input-wrap position-relative customAutoComplete">
            <AutoComplete
              label="State"
              id="state"
              name="state"
              onBlur={(e: any) => {
                setFieldValue(e.target.value, 'state');
              }}
              value={values.state}
              onChange={areafilterHandler}
              onSelect={areaValuehandler}
              allowEmptyChange={true}
              fieldType="state"
            />
          </div>

          <div className="input-wrap">
            <FocusInput
              label="Zip"
              id="zip"
              name="zip"
              value={values.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.zip}
              error={errors.zip}
            />
          </div>
        </AddressCityContainer>
        <h3 className="section-title">My Timezone</h3>
        <div className="select-wrap mb-45">
          <Select
            name="timezone"
            placeholder="Select timezone"
            options={timeZOneOption}
            value={{
              label: values.timezone,
              value: values.timezone,
            }}
            size="large"
            onChange={(timezone: any) => {
              setFieldValue('timezone', timezone.value);
            }}
          />
        </div>
        <div className="d-flex justify-content-center mb-50">
          <NewButton
            type="primary"
            htmlType="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Details
          </NewButton>
        </div>
      </form>
    </>
  );
};

export default AddressForm;
