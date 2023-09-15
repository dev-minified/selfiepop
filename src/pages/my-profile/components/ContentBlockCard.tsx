import { ContentIcon, RecycleBin } from 'assets/svgs';
import FormItem from 'components/Form/FromItem';
import NewButton from 'components/NButton';
import SwitchBox from 'components/switchbox';
import { useFormik } from 'formik';
import { ILinkEditorProps } from 'interfaces/ILinkEditorProps';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import FocusInput from '../../../components/focus-input';
import Card from '../../../components/SPCards';

const validationSchema = yup.object().shape({
  content: yup.string().max(255).required('Enter content'),
  title: yup.string().max(255).required('Enter title'),
});

const ContentBlockCard: React.FC<ILinkEditorProps> = ({
  onCancel,
  value,
  onSubmit,
  title: cardTitle,
  options = { status: true, delete: true, close: false },
  onDeleteClick,
}) => {
  const form = useFormik({
    validationSchema,
    initialValues: {
      _id: undefined,
      content: '',
      title: '',
      isActive: true,
    },
    onSubmit: async (values) => {
      if (onSubmit) {
        const requestData = {
          id: values?._id,
          name: 'links',
          value: { linkType: 'contentBlock', ...values },
        };
        await onSubmit(requestData);

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
  } = form;

  useEffect(() => {
    if (!value) return;
    setValues(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card
        title={cardTitle || values.title}
        subtitle={'Content Block'}
        extra={
          <div>
            <SwitchBox
              value={values.isActive}
              onChange={handleChange}
              name="isActive"
              status={false}
              size="small"
            />
            {!!options?.delete && (
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
        isloading={isSubmitting}
        showClose={false}
        icon={<ContentIcon />}
        onCancel={handleCancel}
      >
        <div className="form">
          <div>
            <FormItem>
              <FocusInput
                label={
                  <span>
                    <span className="text-capitalize">Content</span> Title *
                  </span>
                }
                className="mt-30"
                inputClasses="mb-25"
                id="title"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                value={values.title}
                materialDesign
              />
            </FormItem>
          </div>
          <div>
            <FormItem>
              <FocusInput
                label={
                  <span>
                    <span className="text-capitalize">Content</span> Description
                    *
                  </span>
                }
                className="mt-30"
                inputClasses="mb-25"
                id="content"
                name="content"
                type="textarea"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.content}
                touched={touched.content}
                value={values.content}
                materialDesign
              />
            </FormItem>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default ContentBlockCard;
