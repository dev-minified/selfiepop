import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import { SocialPlatformschecks } from 'enums';
import { useFormik } from 'formik';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { validURL } from 'util/index';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  url: yup
    .string()
    .required('Please enter a valid url')
    .test('val', 'Please enter a valid url', (e: any) => validURL(e)),
  name: yup.string().required('Please enter your account title'),
});
interface Props {
  isOpen: boolean;
  onClose: any;
  onSubmit: any;
}
const Inputlabel = styled.p`
  margin: 0;
`;
function CreateShoutOutSocialIconModel({
  isOpen,
  onClose,
  onSubmit,
}: Props): ReactElement {
  const {
    values,
    errors,
    touched,
    setFieldError,

    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik<Partial<SocialLink>>({
    validationSchema,
    initialValues: {
      _id: '',
      name: '',
      url: '',
    },
    onSubmit: async (values) => {
      const keys = Object.values(SocialPlatformschecks);
      const isFound = keys.find(
        (k) => values.url && values?.url?.toLowerCase()?.includes(k),
      );
      if (!isFound) {
        setFieldError('url', 'Please provide a valid url');
      }
      isFound &&
        onSubmit &&
        (await onSubmit({ ...values, type: isFound.split('.')[0] })
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Social Account`}
      showFooter={true}
      confirmLoading={isSubmitting}
      onOk={handleSubmit}
      className="add-social-account-modal"
    >
      <form>
        <div>
          <Inputlabel>
            Please add a URL to any Instagram, Twitter, Facebook, Youtube,
            TikTok or OnlyFans account you want to offer paid shoutouts on here
          </Inputlabel>
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
        </div>
        <div>
          <Inputlabel>
            Please name this account for your own reference.
          </Inputlabel>
          <FocusInput
            className="mb-15"
            label="Account Nickname"
            materialDesign
            name="name"
            value={values.name || ''}
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
          />
        </div>
      </form>
    </Modal>
  );
}

export default styled(CreateShoutOutSocialIconModel)`
  .modal-footer {
    align-items: center;
    justify-content: center;
  }
`;
