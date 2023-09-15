import { ForwardArrow } from 'assets/svgs';
import AddCard from 'components/AddCard';
import CardBox from 'components/AddCard/CardBox';
import Button from 'components/NButton';
import useAuth from 'hooks/useAuth';
import useKeyPressListener from 'hooks/useKeyPressListener';
import React, { useState } from 'react';
import 'styles/qa-widget.css';

const UserCards: React.FC<{
  userCards: any[];
  primaryCard: any;
  fetchBillingCards(): void;
  requestPaymentButton: any;
  onSubmit: any;
  isQuestionRequired?: boolean;
  isPlaceholderDisabled?: boolean;
}> = (props) => {
  const {
    userCards,
    primaryCard,
    fetchBillingCards,
    requestPaymentButton: PaymentButton,
    isPlaceholderDisabled = false,
    onSubmit,
  } = props;
  const { user } = useAuth();
  const [replaceCard, setReplaceCard] = useState(false);

  const useAnotherCard = () => {
    setReplaceCard(true);
  };

  useKeyPressListener(onSubmit);

  const save: any = ({ isLoading }: any) => {
    return (
      <div className="d-flex justify-content-center pr-50 pl-50 mb-30">
        <Button
          isLoading={isLoading}
          style={{ marginLeft: '0px' }}
          htmlType="submit"
          size="large"
          type="primary"
        >
          Save
        </Button>
      </div>
    );
  };

  return (
    <div className="my-30">
      {replaceCard ? (
        <AddCard
          disabledInput={isPlaceholderDisabled}
          user={user}
          cards={userCards}
          functions={{
            onSave: () => {
              fetchBillingCards();
              setReplaceCard(false);
            },
          }}
          elementsProps={{
            Save: save,
          }}
        />
      ) : (
        <>
          <div className="mb-10 qa-wedget">
            <div className="title-box">
              <h6 className="mb-0">Saved Card 1</h6>
            </div>
            <span
              className=""
              style={{
                color: '#A199AA',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={useAnotherCard}
            >
              <span className="mr-5">REPLACE CARD</span> <ForwardArrow />
            </span>
          </div>
          {primaryCard && (
            <CardBox
              disabledInput={isPlaceholderDisabled}
              title=""
              card={primaryCard}
              showDelete={false}
              showSelector={false}
            />
          )}
        </>
      )}
      <PaymentButton onClick={() => onSubmit(user)} />
    </div>
  );
};

export default UserCards;
