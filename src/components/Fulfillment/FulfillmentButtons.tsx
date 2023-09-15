import { Check, RefuseDollar } from 'assets/svgs';
import dayjs from 'dayjs';
import { OrderStatus } from 'enums';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Button from '../NButton';

interface Props {
  className?: string;
  submitButton?: boolean;
  refuseButton?: boolean;
  icon?: ReactNode | React.ReactElement;
  submitButtonText?: string;
  refuseButtonText?: string;
  orderStatus?: string;
  popType?: string;
  isLoading?: boolean;
  onSubmitClick?: () => void;
  onRefuseClick?: () => void;
  disabled?: boolean;
  deliveryDate?: string;
}

const FulfillmentButtons: React.FC<Props> = (props) => {
  const {
    submitButtonText = 'Mark as Complete',
    refuseButtonText = 'Refuse Shoutout',
    orderStatus,
    className,
    onSubmitClick,
    onRefuseClick,
    icon,
    isLoading = false,
    disabled = false,
    submitButton = true,
    refuseButton = true,
    deliveryDate,
    popType,
  } = props;

  return (
    <div className={`${className} text-center `}>
      <div className="btn-holder">
        {submitButton && (
          <Button
            shape="circle"
            size="large"
            type={orderStatus !== OrderStatus.IN_PROGRESS ? 'info' : 'primary'}
            onClick={onSubmitClick}
            isLoading={isLoading}
            disabled={orderStatus !== OrderStatus.IN_PROGRESS || disabled}
          >
            {submitButtonText}
            <span className="ml-5 mr-n5 btn-icon">
              {icon ? icon : <Check />}
            </span>
          </Button>
        )}
      </div>
      {((popType === 'advertise' &&
        [OrderStatus.PENDING].includes(orderStatus as OrderStatus)) ||
        popType !== 'advertise') &&
      dayjs(deliveryDate).isAfter(dayjs(), 'date') ? (
        <div className="btn-holder">
          {refuseButton && (
            <Button onClick={onRefuseClick} type="text">
              <RefuseDollar /> <span>{refuseButtonText}</span>
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default styled(FulfillmentButtons)`
  .btn-holder {
    margin: 0 0 25px;
  }
  .button {
    &.button-lg {
      min-width: 262px;
      padding: 15px 10px;
    }
  }
`;
