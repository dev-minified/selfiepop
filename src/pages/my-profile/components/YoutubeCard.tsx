import { LinkTypeName } from 'appconstants';
import { RecycleBin, Youtube } from 'assets/svgs';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import NewButton from 'components/NButton';
import Card from 'components/SPCards';
import Switchbox from 'components/switchbox';
import { useFormik } from 'formik';
import { ILinkEditorProps } from 'interfaces/ILinkEditorProps';
import React, { useEffect } from 'react';
import { validURL } from 'util/index';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  title: yup.string().required('Please enter a title'),
  url: yup
    .string()
    .required('Please enter a valid url')
    .test('val', 'Please enter a valid url', (e: any) => validURL(e)),
});

const YoutubeCard: React.FC<ILinkEditorProps> = ({
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
      title: '',
      url: '',
      autoPlay: false,
      mute: false,
      loop: false,
      linkType: 'youtubeLink',
      isActive: true,
    },
    onSubmit: async (values) => {
      const requestData = {
        id: values?._id,
        name: 'links',
        value: values,
      };

      if (onSubmit) {
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
  const { status: showStatus, close: showClose, delete: showDelete } = options;
  return (
    <form onSubmit={handleSubmit}>
      <Card
        title={
          'Add New ' +
          LinkTypeName[values.linkType as keyof typeof LinkTypeName]
        }
        subtitle={
          <span>
            Add/Edit your{' '}
            <span className="text-capitalize">youtube/vimeo video </span>
            information below. <br />
            Click save when finished.
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
        onClose={handleCancel}
        icon={<Youtube />}
        iconStyle={{ backgroundColor: 'white' }}
        classes={{ card: 'youtube-card-admin' }}
        onCancel={handleCancel}
        showClose={showClose}
        isloading={isSubmitting}
      >
        <div className="form">
          <div>
            <div>
              <FocusInput
                label="Video Link *"
                inputClasses="mb-30"
                name="url"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.url}
                touched={touched.url}
                value={values.url}
                materialDesign
              />
              <FocusInput
                label="Video Title *"
                inputClasses="mb-30"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                value={values.title}
                materialDesign
              />
              <div>
                <h4 className="mb-10">Choose Play Options</h4>
                <span style={{ display: 'inline-block' }}>
                  <Checkbox
                    label="Autoplay Video"
                    name="autoPlay"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.autoPlay}
                  />
                </span>
                <span style={{ display: 'inline-block' }}>
                  <Checkbox
                    label="Mute Video"
                    name="mute"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mute}
                  />
                </span>
                <span style={{ display: 'inline-block' }}>
                  <Checkbox
                    label="Loop Video"
                    name="loop"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.loop}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default YoutubeCard;
