import { GetPopIcon, ImagesScreenSizes } from 'appconstants';
import { HappyFace } from 'assets/svgs';
import FormItem from 'components/Form/FromItem';
import Select from 'components/Select';
import UploadThumbnail from 'components/UploadThumbnail';
import { BaseEmoji, EmojiData, Picker } from 'emoji-mart';
import { ServiceType } from 'enums';
import useAppTheme from 'hooks/useAppTheme';
import useDropDown from 'hooks/useDropDown';
import React, { useRef } from 'react';
import styled from 'styled-components';
import FocusInput from '../focus-input';

interface Props {
  cbonCancel?: Function;
  form: any;
  setCompare?: Function;
  ChangeHandler?: any;
  placeholder?: string;
  className?: string;
}

const eventDuration = Array.from(Array(12).keys()).map((_, index) => {
  return {
    value: `${(index + 1) * 5}`,
    label: `${(index + 1) * 5} mins`,
  };
});

const SimplePopFrom: React.FC<Props> = ({
  form,
  placeholder,
  className,
  ChangeHandler,
  setCompare,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>();
  const { ref, isVisible, setIsVisible } = useDropDown(false, false);
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    setValues,
    touched,
    setFieldValue,
  } = form;
  const { mode } = useAppTheme();
  const { popType, popThumbnail } = values;

  const onImageSave = (url: string | undefined) => {
    setValues((v: any) => ({ ...v, popThumbnail: url }));
    setCompare?.((prev: any) => {
      return {
        ...prev,
        popThumbnail: url,
      };
    });
  };
  const insertEmoji = (emoji: EmojiData) => {
    const pos = inputRef.current?.selectionEnd;
    if (pos != null) {
      setFieldValue(
        'description',
        values.description
          ? values.description + (emoji as BaseEmoji).native
          : (emoji as BaseEmoji).native,
      );
      setIsVisible((prev: boolean) => !prev);
    }
  };
  return (
    <form className={className} onSubmit={handleSubmit}>
      <div>
        <div className="row-holder">
          <div className="col-75">
            <FocusInput
              hasIcon={true}
              icon="person"
              label={
                <span>
                  <span className="text-capitalize">{placeholder}</span> Title *
                </span>
              }
              inputClasses="mb-25"
              id="title"
              name="title"
              onChange={(e) => ChangeHandler?.(e)}
              onBlur={handleBlur}
              error={errors.title}
              touched={touched.title}
              value={values.title}
              materialDesign
            />
            {popType === ServiceType.CHAT_SUBSCRIPTION && (
              <FocusInput
                hasIcon={false}
                label={
                  <span>
                    <span className="text-capitalize">Button Title</span>
                  </span>
                }
                inputClasses="mb-25"
                id="actionText"
                name="actionText"
                onChange={(e) => ChangeHandler?.(e)}
                onBlur={handleBlur}
                // error={errors.buttonTitle}
                touched={touched.actionText}
                value={values.actionText}
                materialDesign
              />
            )}
          </div>
          {popType !== ServiceType.ADVERTISE &&
            popType !== ServiceType.CHAT_SUBSCRIPTION && (
              <div className="col-25">
                <FocusInput
                  inputClasses="mb-25"
                  label={<span> Price *</span>}
                  hasIcon={true}
                  id="price"
                  name="price"
                  icon="dollar"
                  validations={[{ type: 'number' }]}
                  onChange={(e) => ChangeHandler?.(e)}
                  onBlur={handleBlur}
                  error={errors.price}
                  touched={touched.price}
                  value={`${values.price}`}
                  materialDesign
                />
              </div>
            )}
        </div>
        {popType === ServiceType.POPLIVE && (
          <>
            <div className="row-holder">
              <div className="col-75">
                <FocusInput
                  hasIcon={false}
                  label={
                    <span>
                      <span className="text-capitalize">
                        Price for additional 5 minutes blocks
                      </span>
                    </span>
                  }
                  inputClasses="mb-25"
                  id="pricePerAdditionalFiveMinutes"
                  name="pricePerAdditionalFiveMinutes"
                  validations={[{ type: 'number' }]}
                  onChange={(e) => ChangeHandler?.(e)}
                  onBlur={handleBlur}
                  error={errors.pricePerAdditionalFiveMinutes}
                  touched={touched.pricePerAdditionalFiveMinutes}
                  value={values.pricePerAdditionalFiveMinutes}
                  materialDesign
                />
              </div>
              <div className="col-25 event-duration">
                <FormItem label="Event Duration"></FormItem>
                <Select
                  options={eventDuration}
                  value={{
                    value: `${values.duration}`,
                    label: `${values.duration} mins`,
                  }}
                  onChange={(value) => {
                    setValues((v: any) => ({
                      ...v,
                      duration: Number(value?.value),
                    }));
                  }}
                />
              </div>
            </div>
          </>
        )}
        <FocusInput
          ref={inputRef}
          label={
            <span>
              <span className="text-capitalize">{placeholder}</span> Description
            </span>
          }
          inputClasses="mb-20"
          id="description"
          name="description"
          type="textarea"
          limit={600}
          rows={6}
          isPicker={true}
          prefixElement={
            <div className="emoji">
              <div ref={ref}>
                {isVisible && (
                  <Picker
                    theme={mode}
                    showPreview={false}
                    showSkinTones={false}
                    onSelect={insertEmoji}
                  />
                )}
              </div>
              <div
                className="emoji-opener"
                onClick={() => setIsVisible((prev: boolean) => !prev)}
              >
                <HappyFace />
              </div>
            </div>
          }
          onChange={(e) => ChangeHandler?.(e)}
          onBlur={handleBlur}
          error={errors.description}
          touched={touched.title}
          value={values.description}
          materialDesign
        />

        <div className="lower-from">
          <UploadThumbnail
            icon={
              values.isThumbnailActive &&
              (popThumbnail || <GetPopIcon type={popType} />)
            }
            imgSettings={{
              onlyMobile: true,

              imgix: {
                all: 'w=64&h=64',
              },
            }}
            onDelete={() => onImageSave('')}
            imageSizes={ImagesScreenSizes.popThumb}
            onToggel={handleChange}
            isActive={values.isThumbnailActive}
            uploadProps={{
              onSuccess: (data: any) => {
                onImageSave(data.imageURL);
              },
            }}
            classes={{ main: 'mb-10 services-thumb' }}
          />
        </div>
      </div>
    </form>
  );
};

export default styled(SimplePopFrom)`
  .event-duration {
    position: relative;

    .default {
      margin: 0 0 25px;
    }

    .label {
      position: absolute;
      left: 15px;
      top: -5px;
      z-index: 1;
      background: var(--pallete-background-default);
      padding: 0 5px;

      .label-area {
        margin: 0 !important;
      }

      .label-title {
        font-size: 10px;
        line-height: 14px;
        color: var(--pallete-text-main-500);
        margin: 0;
        opacity: 0.7;
      }
    }

    .react-select__control {
      border-color: var(--pallete-background-pink);

      .react-select__indicator-separator {
        background-color: var(--pallete-background-pink);
      }
    }
  }
  .services-thumb .social--icon {
    img {
      width: 100%;
      height: 100%;
    }
  }
`;
