import { ArrowRightAlt } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  onRefuseClick?: (reason: string) => Promise<void>;
}

const RefuseAdvertisement: React.FC<Props> = ({ className, onRefuseClick }) => {
  const [reason, setReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className={className}>
      <h3>Refuse Request</h3>
      <p>Message Skottie Young</p>

      <FocusInput
        label={'Send the buyer your reason for refusal (optional)'}
        inputClasses="mb-5"
        id="description"
        name="description"
        type="textarea"
        rows={6}
        materialDesign
        value={reason}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setReason(e.target.value)
        }
      />
      <div className="text-center">
        <Button shape="circle" size="middle" type={'info'} className="mb-15">
          Cancel
        </Button>
        <Button
          shape="circle"
          size="middle"
          type={'primary'}
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onRefuseClick?.(reason);
            setIsLoading(false);
          }}
          className="mb-15 button-danger"
        >
          Send and Refuse{' '}
          <span className="btn-icon ml-15">
            <ArrowRightAlt />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default styled(RefuseAdvertisement)`
  .button-primary {
    min-width: 220px;
  }

  .button-info {
    min-width: 150px;
  }
`;
