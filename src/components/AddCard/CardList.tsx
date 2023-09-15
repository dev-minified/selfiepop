import CardBox from './CardBox';

const CardList = ({
  cards,
  title,
  makePrimary,
  deleteCard,
  disabledInput,
}: any) => {
  const listItems = cards.map((card: any, index: any) => (
    <CardBox
      disabledInput={disabledInput}
      card={card}
      key={card.id}
      index={index}
      title={title}
      makePrimary={makePrimary}
      deleteCard={deleteCard}
    />
  ));
  return <>{listItems}</>;
};

export default CardList;
