import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  seller?: string;
}

const PendingApprovalWidget: React.FC<Props> = ({ className, seller }) => {
  return (
    <div className={className}>
      <div className="approval-pending">
        <h5>Your Request is Pending Approval.</h5>
        <p>
          {seller} is currently reviewing your request. They have up to five
          days to accept. You will receive an email notification on any change
          in your orders status.
        </p>
      </div>
    </div>
  );
};

export default styled(PendingApprovalWidget)`
  .approval-pending {
    position: relative;
    overflow: hidden;
    margin: 0 0 12px;

    h5 {
      font-weight: 500;
      margin: 0 0 7px;
    }

    p {
      color: var(--pallete-text-main-300);
      margin: 0 0 8px;
    }
  }
`;
