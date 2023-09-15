import FocusInput from 'components/focus-input';
import NewButton from 'components/NButton';
import ListItem from 'components/UserList/ListItem';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { declineManagedRequest } from 'api/managed-users';
import { RequestLoader } from 'components/SiteLoader';
import useRequestLoader from 'hooks/useRequestLoader';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import useManagedAccountsOffers from '../hooks/useManagedAccountsOffers';
interface Props {
  className?: string;
}

interface IFORMIK {
  reason: string;
}

const validationSchema = yup.object().shape({
  reason: yup.string().trim().max(500).required('Reason is required'),
});

const DeclineOffer: React.FC<Props> = ({ className }) => {
  const { withLoader } = useRequestLoader();
  const history = useHistory();
  const [isDeclining, setIsDeclining] = useState(false);
  const { managedUser: managedAccount, isLoading } = useManagedAccountsOffers();
  const { values, handleSubmit, handleBlur, handleChange, errors, touched } =
    useFormik<IFORMIK>({
      validationSchema,
      initialValues: {
        reason: '',
      },

      onSubmit: async (values) => {
        if (managedAccount?.id) {
          setIsDeclining(true);
          declineManagedRequest(managedAccount?.id, values)
            .then(() => {
              history.push('/my-profile/managed-accounts');
            })
            .catch(console.error)
            .finally(() => {
              setIsDeclining(false);
            });
        }
      },
    });
  if (isLoading) {
    return <RequestLoader isLoading />;
  }
  return (
    <div className={className}>
      <ListItem
        className="user_list"
        {...managedAccount}
        // onItemClick={(item: typeof managedAccount) => {}}
      />
      <span className="field-label">
        Please tell <strong>{managedAccount?.title}</strong> why you decline
        their offer
      </span>
      <FocusInput
        label={'Offer Details'}
        inputClasses="mb-5"
        id="reason"
        name="reason"
        type="textarea"
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.reason}
        touched={touched.reason}
        value={values.reason}
        rows={6}
        limit={500}
        materialDesign
      />
      <div className="buttons-wrap">
        <NewButton
          type={'primary'}
          className="mt-10"
          size="middle"
          block
          id="decline"
          isLoading={isDeclining}
          disabled={isDeclining}
          onClick={() => handleSubmit()}
        >
          SUBMIT AND DECLINE OFFER
        </NewButton>
      </div>
    </div>
  );
};
export default styled(DeclineOffer)`
  padding: 23px 30px;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    margin: 0 0 20px;
    border: 2px solid #92adc3;

    &:hover {
      background: var(--pallete-background-secondary);
    }
  }

  .field-label {
    display: block;
    color: var(--pallete-text-lighter-50);
    font-weight: 400;
    margin: 0 0 13px;
    font-size: 15px;
    line-height: 18px;

    @media (max-width: 767px) {
      font-size: 13px;
    }

    strong {
      font-weight: 700;
      color: var(--pallete-text-main);
    }
  }

  .buttons-wrap {
    @media (max-width: 767px) {
      max-width: 264px;
      margin: 0 auto;
    }

    > a,
    > button {
      @media (max-width: 767px) {
        width: 100%;
        margin: 0 0 10px;
        display: block;
      }
    }
  }
`;
