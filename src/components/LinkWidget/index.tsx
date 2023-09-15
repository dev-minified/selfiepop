import { getIcon } from 'api/Utils';
import { ImagesScreenSizes, SocialIcons } from 'appconstants';
import { RecycleBin } from 'assets/svgs';
import NewButton from 'components/NButton';
import Card, { SPCardProps } from 'components/SPCards';
import UploadThumbnail from 'components/UploadThumbnail';
import SwitchBox from 'components/switchbox';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import styled, { withTheme } from 'styled-components';
import { getLocation, isValidUrl, validURL } from 'util/index';
import * as yup from 'yup';
import FocusInput from '../focus-input';
const validationSchema = yup.object().shape({
  url: yup
    .string()
    .required('Please enter a valid url')
    .test('val', 'Please enter a valid url', (e: any) => validURL(e)),
  title: yup.string().required('Please enter your link title'),
});

const Index: React.FC<
  {
    onCancel?: Function;
    onSave?: Function;
    Link?: any;
    options?: { status?: boolean; delete?: boolean; close?: boolean };
    onDeleteClick?(): void;
  } & Partial<SPCardProps>
> = ({
  onCancel,
  onSave,
  Link,
  options = { status: true, delete: true, close: false },
  onDeleteClick,
  // theme,
  ...rest
}) => {
  const [imageURL, setImageURL] = useState<string | null>(Link?.imageURL);
  const [customUpload, setCustomUpload] = useState<boolean>(false);

  const {
    values,
    handleChange,
    setFieldTouched,
    handleBlur,
    resetForm,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      url: Link?.url || '',
      title: Link?.title || '',
      isActive: Link?.isActive ?? true,
      isThumbnailActive: Link?.isThumbnailActive ?? true,
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      const onlyFansTest = new RegExp(/^((?!onlyfans.com).)*$/, 'gmi');
      const requestData = {
        id: Link?._id,
        name: 'links',
        value: {
          ...Link,
          ...values,
          imageURL,
          isSensitve: !onlyFansTest.test(values.url),
          isActive: values?.isActive ?? true,
        },
      };
      if (
        requestData.value &&
        !isValidUrl(requestData?.value?.imageURL || '')
      ) {
        const platform = requestData?.value?.platfrom;

        if (platform && SocialIcons[platform]) {
          const platfromUrl = SocialIcons[platform];
          if (platfromUrl) {
            requestData.value.imageURL = platfromUrl;
          }
        }
      }

      if (onSave) await onSave(requestData);

      resetForm();
      setImageURL(null);
      setCustomUpload(false);
      if (onCancel) onCancel();
    },
  });

  useEffect(() => {
    if (
      !customUpload &&
      !errors.url &&
      touched.url &&
      values.url.length > 3 &&
      !isSubmitting
    ) {
      const myUrl = getLocation(values.url);
      getIcon(myUrl.hostname)
        .then((res) => {
          if (res.success) setImageURL(res.imageURL);
        })
        .catch(console.log);
    } else {
      if (!customUpload && errors.url) {
        setImageURL(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, errors, touched, customUpload, isSubmitting]);

  const handleCancel = () => {
    resetForm();
    setImageURL(null);
    setCustomUpload(false);
    onCancel && onCancel();
  };

  const { status: showStatus, close: showClose, delete: showDelete } = options;
  // const { additional } = theme || {};
  return (
    <form onSubmit={handleSubmit}>
      <Card
        icon={
          <span
            className="icon-url"
            style={{ color: 'var(--pallete-primary-main)' }}
          ></span>
        }
        title={values.title}
        subtitle="Link"
        extra={
          <div>
            {showStatus && (
              <SwitchBox
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
        showClose={showClose}
        onCancel={handleCancel}
        isloading={isSubmitting}
        {...rest}
      >
        <div>
          <div>
            <FocusInput
              hasIcon={false}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.title}
              touched={touched.title}
              icon=""
              label="*Link Title *"
              inputClasses="mb-25"
              id="title"
              name="title"
              value={values.title}
              materialDesign
            />
            <FocusInput
              hasIcon={true}
              icon="url"
              error={errors.url}
              touched={touched.url}
              onChange={(e: any) => {
                setFieldTouched('url');
                handleChange(e);
              }}
              limit={200}
              onBlur={handleBlur}
              label="*Link URL *"
              inputClasses="mb-20"
              id="url"
              name="url"
              value={values.url}
              materialDesign
            />
          </div>
          <UploadThumbnail
            uploadProps={{
              url: '/image/upload',
              onSuccess: (data: any) => {
                setCustomUpload(true);
                setImageURL(data.imageURL);
              },
            }}
            imgSettings={{
              onlyMobile: true,

              imgix: {
                all: 'w=64&h=64',
              },
            }}
            imageSizes={ImagesScreenSizes.popThumb}
            onToggel={handleChange}
            isActive={values.isThumbnailActive}
            onDelete={() => {
              setImageURL(null);
              setCustomUpload(false);
            }}
            icon={
              imageURL ? (
                imageURL
              ) : (
                <span
                  className="icon-url"
                  style={{ color: 'var(--pallete-primary-main)' }}
                ></span>
              )
            }
          />
        </div>
      </Card>
    </form>
  );
};

export default withTheme(styled(Index)``);
