import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NewButton from 'components/NButton';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { removeCard, updatePrimarySource } from '../../api/billing';
import { STRIPE_PUBLIC_KEY } from '../../config';
import useAuth from '../../hooks/useAuth';
import CardForm from './CardForm';
import CardList from './CardList';

const apikey = STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(apikey === undefined ? '' : apikey);

export default function AddCard(props: any) {
  const [newForm, setNewForm] = useState(false);
  const [cards, setCards] = useState<any>(
    Array.isArray(props.cards) ? props.cards : [],
  );
  const { withLoader } = useRequestLoader();
  const { user } = useAuth();

  useEffect(() => {
    setNewForm(cards.length < 1 ? true : false);
  }, [cards]);

  useEffect(() => {
    if (Array.isArray(props.cards)) setCards(props.cards);
  }, [props.cards]);

  const makePrimary = async (cardId: string) => {
    try {
      await withLoader(updatePrimarySource(cardId).catch(console.log));
    } catch (e) {}
    props.functions?.onSave?.();
  };
  const deleteCard = async (cardId: string) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this payment method!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    } as any).then(async (willDelete) => {
      if (willDelete) {
        await withLoader(removeCard(cardId));
        props.functions?.onSave?.();
      } else {
        swal('Your payment method is safe!');
      }
    });
  };

  const CardButton = () => {
    if (!newForm && props.elementsProps?.AddMoreButton) {
      return <props.elementsProps.AddMoreButton onClick={props.onNext} />;
    }

    if (cards.length > 0) {
      return (
        <div className="text-center mb-35">
          <NewButton
            type="primary"
            style={{ minWidth: 224 }}
            id="new-payment-method-btn"
            onClick={() => setNewForm(!newForm)}
          >
            Add New Payment Method
          </NewButton>
        </div>
      );
    }
  };
  return (
    <div>
      <div id="billingData">
        {cards.length > 0 && (
          <>
            <h3 className="mb-15">My Payment Method</h3>
            <CardList
              disabledInput={props.disabledInput}
              title={props.title}
              cards={cards}
              makePrimary={makePrimary}
              deleteCard={deleteCard}
            />
          </>
        )}
      </div>
      {CardButton()}

      <Elements stripe={stripePromise}>
        <CardForm
          totalCards={cards.length}
          user={user}
          showEmailField={!!props.showEmailField}
          functions={props.functions}
          elementsProps={props.elementsProps}
          reload={(showForm: boolean) => {
            setNewForm(showForm);
            props.functions?.onSave?.();
          }}
          visibility={newForm}
        />
      </Elements>
    </div>
  );
}
