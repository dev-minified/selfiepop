import { BirthdayGift } from 'assets/svgs';
import Input from 'components/focus-input';
import FormItem from 'components/Form/FromItem';
import Radio from 'components/RadioGroup';
import { useFormik } from 'formik';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
interface IAppProps {
  className?: string;
  submitButton?: ReactNode;
  onSubmit?: (values: Record<string, any>) => void | Promise<any>;
  pop?: any;
  isPreview?: boolean;
}

const App: React.FC<IAppProps> = ({
  className,
  submitButton,
  onSubmit,
  pop,
  isPreview = false,
}) => {
  let publicUser = useAppSelector((state) => state?.global?.publicUser);
  const { user, loggedIn } = useAuth();
  if (isPreview) {
    publicUser = user;
  }
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    errors,
    touched,
    handleSubmit,
  } = useFormik<{ questions: Questions[]; user: { name: string } }>({
    validate: ({ questions = [], user }) => {
      const error: any = { user: {}, questions: [] };

      if (questions?.[0]?.responseValue === 'me') {
        if (!loggedIn) {
          if (!user.name.length) {
            error['user']['name'] = 'Required';
          } else if (!/^(\D+\s+\D+)(\s*\D*)*$/.test(user.name)) {
            error['user']['name'] = 'Please Enter full Name';
          }
        }
      } else {
        if (!questions[1]?.responseValue?.length) {
          error['questions'][1] = 'Required';
        }
      }

      if (!questions[2]?.responseValue?.length) {
        error['questions'][2] = 'Required';
      }

      if (!error?.user?.name) {
        delete error.user;
      }
      if (!error?.questions?.length) {
        delete error.questions;
      }
      return error;
    },
    initialValues: { questions: [], user: { name: '' } },
    onSubmit: async (values) => {
      await onSubmit?.(values);
    },
  });

  useEffect(() => {
    setValues({ questions: pop.questions, user: { name: '' } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { questions, user: vUser } = values;
  const [fristQuestion] = questions;
  const { name } = vUser;

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="form-wrap">
          <FormItem
            className="mb-20"
            label={<h3>Who is this Custom Video for?</h3>}
            sublable="Please complete the following information:"
          >
            <div className="radio-holder">
              <Radio
                name="questions[0].responseValue"
                items={[
                  {
                    label: 'Someone Else',
                    value: 'someone_else',
                    icon: <BirthdayGift />,
                  },
                  {
                    label: 'Myself',
                    value: 'me',
                    icon:
                      user?.profileImage ||
                      '/assets/images/default-profile-img.svg',
                    fallbackUrl: '/assets/images/default-profile-img.svg',
                  },
                ]}
                value={fristQuestion?.responseValue}
                onChange={handleChange}
                type="primary"
                inlineBlock
              />
            </div>
          </FormItem>
          {fristQuestion?.responseValue === 'me' ? (
            <>
              {!loggedIn && (
                <FormItem className="mb-20" label={<h6>Your name:</h6>}>
                  <Input
                    placeholder="Your Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors?.user?.name}
                    touched={touched?.user?.name}
                    name="user.name"
                    value={name}
                  />
                </FormItem>
              )}
            </>
          ) : (
            <FormItem className="mb-20" label={<h6>Their name:</h6>}>
              <Input
                placeholder="Recipients Name"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.questions?.[1]}
                touched={touched?.questions?.[1]}
                name="questions[1].responseValue"
                value={questions[1]?.responseValue}
              />
            </FormItem>
          )}
          <FormItem
            className="mb-30 mb-md-60"
            label={<h3>Instructions</h3>}
            sublable={
              <span>
                My instructions for{' '}
                <strong>{publicUser?.pageTitle ?? 'Incognito User'}</strong> are
              </span>
            }
          >
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.questions?.[2]}
              touched={touched?.questions?.[2]}
              name="questions[2].responseValue"
              value={questions[2]?.responseValue || ''}
              type="textarea"
              rows={4}
              placeholder={`What would you like to say?`}
            />
          </FormItem>
        </div>
        {submitButton}
      </form>
    </div>
  );
};

export default styled(App)``;
