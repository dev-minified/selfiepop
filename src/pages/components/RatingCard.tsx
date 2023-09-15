import CRate from 'components/rate';
import React, { ReactElement } from 'react';

interface Props {
  name: string | React.ReactElement;
  rating: number;
  saleReview?: boolean;
}

export default function RatingCard({
  name,
  saleReview,
  rating,
}: Props): ReactElement {
  return (
    <div className="profile--info mb-30">
      <h2 className="text-center">
        <span className="secondary-text">{name}</span>
      </h2>
      <h3 className="text-center">
        {saleReview
          ? 'has received your order and rated it.'
          : 'has completed your order. You gave the order.'}
      </h3>
      <div className="text-center">
        <CRate disabled value={rating} />
      </div>
    </div>
  );
}
