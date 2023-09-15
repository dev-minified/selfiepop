import { ProfileAvatar, RecycleBin } from 'assets/svgs';
import NewButton from 'components/NButton';
import Switchbox from 'components/switchbox';
import { useFormik } from 'formik';
import { ILinkEditorProps } from 'interfaces/ILinkEditorProps';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import FocusInput from '../../../components/focus-input';
import Card from '../../../components/SPCards';
import InlineTagger from '../../../components/Tags/InlineTagger';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Enter your first name'),
  lastName: yup.string().required('Enter your last name'),
  description: yup.string().required('Enter your description'),
});

const BiographyCard: React.FC<Omit<ILinkEditorProps, 'title'>> = ({
  onCancel,
  value,
  onSubmit,
  options = { status: true, delete: true, close: false },
  onDeleteClick,
}) => {
  const form = useFormik({
    validationSchema,
    initialValues: {
      _id: undefined,
      firstName: '',
      lastName: '',
      description: '',
      tagLine: '',
      tags: '',
      isActive: true,
    },
    onSubmit: async (values) => {
      if (onSubmit) {
        await onSubmit(values);
        form.resetForm();
        onCancel && onCancel();
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting,
    setValues,
    setFieldValue,
  } = form;

  useEffect(() => {
    if (!value) return;
    const { _id, firstName, description, lastName, isActive, tags, tagLine } =
      value;

    setValues({
      _id,
      firstName,
      lastName,
      description,
      tags,
      isActive,
      tagLine,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCancel = () => {
    onCancel && onCancel();
  };
  const { status: showStatus, close: showClose, delete: showDelete } = options;

  return (
    <form onSubmit={handleSubmit}>
      <Card
        title={'Biography'}
        subtitle={
          <span>
            Edit your <span className="text-capitalize">biography </span>
            information below. Click save when finished.
          </span>
        }
        extra={
          <div>
            {showStatus && (
              <Switchbox
                value={values.isActive}
                onChange={handleChange}
                name="isActive"
                status={false}
                size="small"
              />
            )}
            {showDelete && (
              <span>
                <NewButton
                  icon={<RecycleBin />}
                  outline
                  onClick={onDeleteClick}
                />
              </span>
            )}
          </div>
        }
        onCancel={onCancel}
        onClose={handleCancel}
        icon={<ProfileAvatar />}
        isloading={isSubmitting}
        showClose={showClose}
      >
        <div className="form">
          <div>
            <FocusInput
              hasIcon={true}
              icon="person"
              label="Your first name *"
              inputClasses="mb-30"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
              error={errors.firstName}
              touched={touched.firstName}
              value={values.firstName}
              materialDesign
            />
            <FocusInput
              hasIcon={true}
              icon="person"
              label="Your last name *"
              inputClasses="mb-30"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
              onBlur={handleBlur}
              error={errors.lastName}
              touched={touched.lastName}
              value={values.lastName}
              materialDesign
            />
            <FocusInput
              label="Your tagline (Optional)"
              inputClasses="mb-30"
              id="tagLine"
              name="tagLine"
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.tagLine}
              touched={touched.tagLine}
              value={values.tagLine}
              materialDesign
            />
            <FocusInput
              label="Tell us about yourself"
              inputClasses="mb-30"
              id="description"
              name="description"
              type="textarea"
              onChange={handleChange}
              onBlur={handleBlur}
              limit={250}
              rows={3}
              error={errors.description}
              touched={touched.description}
              value={values.description}
              materialDesign
            />
            <InlineTagger
              id="tags"
              name="tags"
              onChange={handleChange}
              value={values.tags}
              setMainTags={(t: any) => setFieldValue('tags', t)}
            />
          </div>
        </div>
      </Card>
    </form>
  );
};

export default BiographyCard;
