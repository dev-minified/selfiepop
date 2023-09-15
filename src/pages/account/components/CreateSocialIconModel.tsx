import { SOCIAL_PLATFORM_OPTIONS } from 'appconstants';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import Select from 'components/Select';
import { SocialPlatformschecks } from 'enums';
import { useFormik } from 'formik';
import { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { validURL } from 'util/index';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  url: yup
    .string()
    .required('Please enter a valid url')
    .test('val', 'Please enter a valid url', (e: any) => validURL(e)),
  name: yup.string().required('Please enter your link title'),
});
interface Props {
  isOpen: boolean;
  onClose: any;
  onSubmit: any;
  isEdit?: boolean;
  values?: Partial<SocialLink>;
  className?: string;
}

function CreateSocialIconModel({
  isOpen,
  onClose,
  onSubmit,
  isEdit,
  values: initialValue,
  className,
}: Props): ReactElement {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setValues,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik<Omit<Partial<SocialLink>, 'type'> & { type: any }>({
    validationSchema,
    initialValues: {
      _id: '',
      name: '',
      url: '',
      type: SOCIAL_PLATFORM_OPTIONS[0],
    },
    onSubmit: async (values) => {
      if (
        !values.url?.includes(
          SocialPlatformschecks[
            values.type.value as keyof typeof SocialPlatformschecks
          ],
        )
      ) {
        setFieldError('url', `Please provide valid ${values.type.label} url`);
        return;
      }

      onSubmit &&
        (await onSubmit({ ...values, type: values.type.value })
          .then(() => {
            onClose && onClose();
            resetForm();
          })
          .catch(() => {}));
    },
  });

  const handleClose = () => {
    onClose && onClose();
    resetForm();
  };

  useEffect(() => {
    if (initialValue && isOpen) {
      const { type } = initialValue;

      setValues({
        ...initialValue,
        type:
          SOCIAL_PLATFORM_OPTIONS.find((o) => o.value === type) ||
          SOCIAL_PLATFORM_OPTIONS[0],
      });
    }
  }, [initialValue, setValues, isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${isEdit ? 'Edit' : 'Add'} Social Account`}
      showFooter={true}
      confirmLoading={isSubmitting}
      onOk={handleSubmit}
      className={className}
    >
      <form>
        <FocusInput
          className="mb-15"
          label="Name"
          materialDesign
          name="name"
          value={values.name || ''}
          onChange={handleChange}
          error={errors.name}
          touched={touched.name}
        />
        <FocusInput
          className="mb-15"
          label="URL"
          materialDesign
          name="url"
          value={values.url || ''}
          onChange={handleChange}
          error={errors.url}
          touched={touched.url}
        />
        <Select
          options={SOCIAL_PLATFORM_OPTIONS}
          defaultValue={values.type}
          onChange={(value) => {
            setFieldValue('type', value);
          }}
          size="small"
        />
      </form>
    </Modal>
  );
}

export default styled(CreateSocialIconModel)`
  .modal-content {
    padding: 25px 20px;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 8px 0 0;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: #495057;
  }

  .modal-footer {
    padding: 15px 0 0;
  }
`;
