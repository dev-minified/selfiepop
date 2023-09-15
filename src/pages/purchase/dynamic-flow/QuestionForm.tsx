import { LinkTypeName } from 'appconstants';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import FormItem from 'components/Form/FromItem';
import UploadWedigt from 'components/UploadWidget';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import React, { Ref, useEffect } from 'react';
import styled from 'styled-components';

type questiontype = Omit<Questions, 'title'> & {
  fieldName?: string;
  index?: number;
  title?: string | React.ReactElement;
  validationSchema?: any;
  validate?: any;
};

function Items({
  name,
  type,
  label,
  onChange,
  setFieldValue,
  options,
  attachements,
  responseValue,
  ...rest
}: {
  name?: string | number;
  values?: questiontype;
  type?: string | any;
  label?: string | React.ReactNode;
  text?: string | React.ReactNode;
  touched?: any;
  error?: any;
  onChange?: any;
  setFieldValue?: any;
  onBlur: any;
  options?: ResponseOptions[];
} & Partial<Omit<Questions, 'type'>>) {
  switch (type) {
    case 'file':
      return (
        <div>
          <UploadWedigt
            value={attachements}
            onChange={(array: any) => {
              setFieldValue(
                `[${name}].attachements`,
                array.map((item: any) => ({ ...item, url: item.imageURL })),
              );
            }}
            url={'/image/upload'}
            limit={5}
          />
        </div>
      );
    case 'selectList':
      return (
        <div>
          {options?.map((option: ResponseOptions, index: number) => {
            return (
              <Checkbox
                key={index}
                label={option.text}
                name={`[${name}].responseOptions[${index}].value`}
                checked={option?.value}
                onChange={onChange}
                type="primary"
                className="mb-10"
                {...rest}
              />
            );
          })}
        </div>
      );
    default:
      return (
        <FocusInput
          name={`[${name}].responseValue`}
          type={type === 'long-text' ? 'textarea' : 'text'}
          label={label}
          rows={4}
          onChange={onChange}
          value={responseValue}
          materialDesign
          placeholder="Your Answer"
          {...rest}
        />
      );
  }
}

function DynamicQuestions({
  className,
  questions = [],
  popType = 'shoutout',
  onChange,
  questionsRef,
  order,
}: {
  className?: string;
  questions: questiontype[];
  onChange: (qs: questiontype[]) => void;
  popType?: keyof typeof LinkTypeName;
  questionsRef?: Ref<HTMLDivElement>;
  order?: Record<string, any>;
}) {
  const {
    values,
    handleChange,
    setValues,
    handleBlur,
    setFieldValue,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik<questiontype[]>({
    initialValues: [...(questions || [])],
    validateOnChange: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    setValues(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange && onChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  if (popType === ServiceType.SHOUTOUT || popType === ServiceType.PAYMA)
    return null;
  let title = LinkTypeName[popType];
  if (popType === 'additional-services' && order?.title) {
    title = order?.title;
  }
  return (
    <div ref={questionsRef} className={className}>
      {values.length > 0 && (
        <div>
          <div className="title mb-30">
            <h4>
              <span className="service_name">{title}</span> Questionaire
            </h4>
            <h6>Please answer the following questions</h6>
          </div>
          {values?.map((q: questiontype, index: number) => {
            const {
              responseType,
              responseOptions,
              attachements,
              title,
              ...rest
            } = q;
            return (
              <FormItem
                label={
                  <QuestionTitle>
                    {title} {q.isRequired ? <span>*</span> : ''}
                  </QuestionTitle>
                }
                key={index}
                className="mb-30 mb-md-60"
              >
                <Items
                  name={index}
                  type={responseType}
                  touched={touched}
                  error={errors[index]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  options={responseOptions}
                  attachements={attachements}
                  {...rest}
                />
              </FormItem>
            );
          })}
        </div>
      )}
    </div>
  );
}
const QuestionTitle = styled.span`
  span {
    color: red;
  }
`;
export default styled(DynamicQuestions)`
  position: relative;
  .service_name {
    text-transform: capitalize;
  }
  .meeting-timer {
    position: absolute;
    left: 0;
    right: 0;
    top: -50px;
    text-align: center;
    font-size: 16px;
    line-height: 19px;
    font-weight: 700;
    color: var(--pallete-text-main);
    svg {
      color: var(--pallete-text-light-150);
    }
  }

  .react-select__control {
    border: none !important;
    font-size: 13px;
    line-height: 16px;
    color: var(--pallete-text-main);

    .react-select__indicators {
      display: none;
    }

    .react-select__value-container {
      justify-content: center;
    }

    .react-select__single-value {
      padding-right: 18px;
      padding-left: 25px;

      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        content: '';
        width: 14px;
        height: 14px;
        background-size: 100% 100%;
        background: url(/assets/images/svg/globe.svg) no-repeat;
      }

      &:after {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        border-style: solid;
        border-width: 5px 4px 0 4px;
        border-color: var(--pallete-text-main) transparent transparent
          transparent;
        content: '';
      }
    }
  }

  .checkbox {
    max-width: 315px;
    margin: 0 auto;
  }

  h3 {
    font-weight: 500;
  }

  h6 {
    color: var(--pallete-text-main-300);
    font-size: 15px;
    line-height: 21px;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .rc-date__picker {
    height: 40px;
    padding: 10px 17px;
    border: 1px solid var(--pallete-background-pink);
    font-size: 15px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.5);
    display: block;
    width: 100%;
    outline: none;
    border-radius: 5px;

    &:focus {
      border-color: var(--colors-indigo-200);
    }
  }

  .react-time-picker {
    width: 100%;

    .react-time-picker__wrapper {
      height: 40px;
      border: 1px solid var(--pallete-background-pink);
      font-size: 15px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.5);
      display: block;
      width: 100%;
      outline: none;
      border-radius: 5px;
    }

    .react-time-picker__inputGroup {
      padding: 10px 60px 10px 17px;
    }

    .react-time-picker__inputGroup__input {
      outline: none;
    }

    .react-time-picker__clear-button {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  .available-dates-marker {
    width: 24px;
    height: 24px;
    background-color: #87d7f5;
    border-radius: 50%;
    margin-bottom: -6px;
    display: inline-block;
  }
`;
