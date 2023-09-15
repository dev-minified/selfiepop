import GiftRos from './GiftRos';

type RoseType = { type?: 'yellow' | 'white'; price?: string | number };
const GiftRose = (props: React.SVGAttributes<SVGElement> & RoseType) => {
  const { type = 'white', price, className } = props;
  return (
    <div className={`rose-block ${type} ${className}`}>
      {price !== undefined && <div className="amount-box">{price}</div>}

      <GiftRos />
    </div>
  );
};
export default GiftRose;
