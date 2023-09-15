import Input from 'components/focus-input';
import FormItem from 'components/Form/FromItem';
import { useFormik } from 'formik';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import * as React from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
const validationSchema = yup.object().shape({
  paymaQuestion: yup.string().trim().required('This field is required'),
});
interface IAppProps {
  className?: string;
  submitButton?: ReactNode;
  onSubmit?: (values: Record<string, any>) => void | Promise<any>;
  isPreview?: boolean;
}
const App: React.FunctionComponent<IAppProps> = ({
  className,
  submitButton,
  onSubmit,
  isPreview = false,
}) => {
  let publicUser = useAppSelector((state) => state?.global?.publicUser);
  const user = useAuth();
  if (isPreview) {
    publicUser = user.user;
  }
  const order = useAppSelector((state) => state?.checkout?.order);
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    errors,
    touched,
    handleSubmit,
    setFieldError,
  } = useFormik({
    initialValues: { paymaQuestion: '' },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      return await onSubmit?.(values);
    },
  });
  React.useEffect(() => {
    !!order?._id && setValues({ paymaQuestion: order?.paymaQuestion || '' });
  }, [order, setValues]);
  const { paymaQuestion } = values;
  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="form-wrap">
          <FormItem
            className="mb-30 mb-md-60"
            label={<h3>Ask your question</h3>}
            sublable={
              <span>
                My question for <strong>{publicUser?.pageTitle || ''}</strong>{' '}
                is
              </span>
            }
          >
            <Input
              type="textarea"
              name="paymaQuestion"
              rows={4}
              error={errors.paymaQuestion}
              touched={touched.paymaQuestion}
              value={paymaQuestion}
              onChange={(e) => {
                setFieldError('paymaQuestion', '');
                handleChange(e);
              }}
              onBlur={handleBlur}
              placeholder={`Enter your question here.`}
            />
          </FormItem>
        </div>
        {submitButton}
      </form>
    </div>
  );
};
export default styled(App)``;
