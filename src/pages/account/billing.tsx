import { fetchCards } from 'api/billing';
import Pendingsubs from 'components/Pendingsubs';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import { setPrimaryCard, setUserCards } from 'store/reducer/global';
import AddCard from '../../components/AddCard';

export default function Billing() {
  const [cards, setCards] = useState<any[]>([]);
  const { withLoader } = useRequestLoader();
  const dispatch = useAppDispatch();
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserCards = () => {
    setIsLoading(true);
    fetchCards()
      .then((userCards) => {
        setCards(userCards.sources);
        dispatch(setUserCards(userCards?.sources || []));
        dispatch(
          setPrimaryCard(
            userCards?.sources.find((item: any) => item.isPrimary),
          ),
        );
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  if (loading) {
    return <RequestLoader isLoading={loading} />;
  }
  return (
    <>
      <AddCard
        showEmailField={false}
        cards={cards}
        functions={{ onSave: fetchUserCards }}
      />
      <Pendingsubs />
    </>
  );
}
