import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  title: yup.string().max(255).required('Enter title'),
});
interface Props {
  value?: any;
  lessonObj?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  icon?: string | React.ReactElement | React.ReactNode;
  onDeleteClick?(): void;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  title?: string;
  preview?: boolean;
  isOpen?: boolean;
  correctAnswerInput?: boolean;
}

const QuestionForm = ({
  value,
  cbonCancel,
  cbonSubmit,
  icon,
  className,
  title: cardtitle,
  isOpen = false,
}: Props) => {
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
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      title: '',
      isPreview: false,
    },
    onSubmit: async (values) => {
      if (cbonSubmit) {
        await cbonSubmit(values);
        cbonCancel?.();
        resetForm();
      }
    },
  });
  useEffect(() => {
    value && setValues({ ...value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isOpen]);
  const cancelHanlder = () => {
    cbonCancel && cbonCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Model
        isOpen={isOpen}
        title={
          <span className="title-holder">
            <span className="title-icon">{icon}</span>
            <span className="title-text">{cardtitle || value?.title}</span>
          </span>
        }
        onClose={cancelHanlder}
        onOk={handleSubmit}
        className={`Question-from`}
        confirmLoading={isSubmitting}
      >
        <div className="form">
          <div className="form-field">
            <div>
              <div className="checkbox-field">
                <FocusInput
                  hasIcon={false}
                  label="File Title"
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
              <Checkbox
                className="make_it_required"
                name="isPreview"
                defaultChecked={values?.isPreview}
                onChange={(e: any) =>
                  setFieldValue(e.target.name, e.target.checked)
                }
                label="Preview"
                value={values?.isPreview}
              />
            </div>
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
`;
