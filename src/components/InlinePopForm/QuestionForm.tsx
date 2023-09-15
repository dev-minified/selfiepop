import { QuestionMark } from 'assets/svgs';
import Checkbox from 'components/checkbox';
import Model from 'components/modal';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import Select from '../Select';
import FocusInput from '../focus-input';

const validationSchema = yup.object().shape({
  title: yup.string().max(255).required('Enter question title'),
});
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  onDeleteClick?(): void;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  title?: string;
  isOpen?: boolean;
}
const QList = [
  { label: 'Text', value: 'text', isRequired: false },
  { label: 'Long Text', value: 'long-text', isRequired: false },
  { label: 'File Upload', value: 'file', isRequired: false },
  { label: 'Multiple Choice', value: 'selectList', isRequired: false },
];

function SelectListInputField({
  value,
  onChange,

  ...rest
}: any) {
  const [input, setInput] = useState();

  const hanldeChange = (e: any) => {
    const values = e.target.value
      .split(',')
      .filter((i: string) => i.trim().length);

    const trimed = e.target.value
      .split(',')
      .filter((i: string) => i.trim().length)
      .join(',');

    const options = values?.map((i: string, index: number) => ({
      key: `${index}`,
      text: i,
      value: false,
    }));
    onChange(options, e);

    setInput(trimed);
  };
  useEffect(() => {
    setInput(value?.map((item: any) => item.text).join(','));
  }, [value]);

  return <FocusInput onChange={hanldeChange} value={input} {...rest} />;
}

const QuestionForm = ({
  value,
  cbonCancel,
  cbonSubmit,
  className,
  // options = { status: true, delete: true, close: false },
  title: cardtitle,
  isOpen = false,
}: Props) => {
  const [modelClass, setModelClass] = useState<string>();
  const {
    isSubmitting,
    values,
    setValues,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    errors,
    resetForm,
    touched,
    setFieldTouched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik<Questions>({
    validationSchema,
    initialValues: {
      title: '',
      text: '',
      isActive: true,
      type: undefined,
      isRequired: false,
    },
    validateOnChange: true,
    validate: (value) => {
      const errors: { [key: string]: string } = {};
      if (!value.type?.value) {
        errors['type'] = 'Please Choose a Question Type';
      }
      return errors;
    },
    onSubmit: async (values) => {
      const v = { ...values, responseType: values.type?.value };
      if (cbonSubmit) {
        await cbonSubmit(v);
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        ...values,
        ...value,
        type: QList.find((item: any) => item.value === value.responseType),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValues, value, isOpen]);

  const cancelHanlder = () => {
    cbonCancel && cbonCancel();
  };

  const { type } = values;
  // const { status: showStatus, close: showClose, delete: showDelete } = options;
  return (
    <form onSubmit={handleSubmit} className={className}>
      <Model
        isOpen={isOpen}
        title={
          <span className="title-holder">
            <span className="title-icon">
              <QuestionMark />
            </span>
            <span className="title-text">{cardtitle || value?.title}</span>
          </span>
        }
        onClose={cancelHanlder}
        onOk={handleSubmit}
        className={`Question-from ${modelClass} ${className}`}
        confirmLoading={isSubmitting}
      >
        <div className="form">
          <div className="form-field">
            <div className="select-wrap mb-30">
              <Select
                onMenuClose={() => setModelClass('')}
                onMenuOpen={() => setModelClass('question_form_open')}
                value={(values?.type as any) || ''}
                error={errors?.type}
                touched={touched.type}
                placeholder="Choose a Question Type"
                className="questoin_form_select"
                options={QList}
                onChange={(value) => {
                  setModelClass('');
                  setFieldValue('type', value);
                }}
              />
            </div>
            {type && (
              <div>
                <div className="checkbox-field">
                  <FocusInput
                    hasIcon={false}
                    label="Question Title"
                    inputClasses="mb-25"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title}
                    touched={touched.title}
                    value={values.title}
                    materialDesign
                  />
                </div>
                {type?.value === 'selectList' && (
                  <div className="mb-30">
                    <SelectListInputField
                      label="Answers: Example 1, Example 2"
                      inputClasses="mb-10"
                      name="responseOptions"
                      type="textarea"
                      rows={6}
                      onChange={(value: any, e: any) => {
                        handleChange(e);
                        setFieldValue('responseOptions', value);
                      }}
                      onBlur={() => setFieldTouched('responseOptions', true)}
                      error={errors.responseOptions}
                      touched={touched.responseOptions}
                      value={values.responseOptions}
                      materialDesign
                    />
                    <span className="tip-bar">
                      <span className="icon icon-info"></span>Please separate
                      mutiple choice responses with a comma.
                    </span>
                  </div>
                )}
                <Checkbox
                  className="make_it_required question_form_checkbox"
                  name="isRequired"
                  defaultChecked={values.isRequired}
                  onChange={(e: any) =>
                    setFieldValue(e.target.name, e.target.checked)
                  }
                  label="Required"
                  value={values.isRequired}
                />
              </div>
            )}
          </div>
        </div>
      </Model>
    </form>
  );
};

export default styled(QuestionForm)`
  .checkbox-field {
    position: relative;
  }
  .make_it_required {
    label {
      padding: 0 0 30px;
    }
  }

  .modal-header {
    border: none;
    padding-bottom: 10px;
  }

  .modal-body {
    .checkbox {
      label {
        padding-left: 5px;
        padding-top: 5px;
      }
    }
  }
  .questoin_form_select {
    .react-select__option {
      color: inherit !important;
    }
  }
  .question_form_checkbox {
    .custom-input {
      background-color: transparent;
    }
  }
`;
