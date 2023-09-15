// import { Announcement } from 'assets/svgs';
import Model from 'components/modal';
import Card from 'components/SPCards';
import { ReactElement } from 'react';
import styled from 'styled-components';

type Props = {
  isOpen?: boolean;
  className?: string;
  onSave?: (...args: any) => void;
  onClose?: () => void;
  description?: string;
  okbuttonText?: string;
};

function ConformationModal({
  isOpen,
  className,
  onSave,
  onClose,
  description,
  okbuttonText = 'Save',
}: Props): ReactElement {
  const onCloseHanldler = () => {
    onClose?.();
  };

  const onSaveName = async () => {
    onSave?.();
  };
  return (
    <Model
      className={className}
      isOpen={!!isOpen}
      showHeader={false}
      showFooter={false}
      onClose={onCloseHanldler}
    >
      <Card
        okButtonText={okbuttonText}
        onCancel={onCloseHanldler}
        showClose={false}
        onSave={onSaveName}
      >
        <div className="galleyName">
          <p>{description}</p>
        </div>
      </Card>
    </Model>
  );
}
export default styled(ConformationModal)`
  max-width: 415px;
  padding: 0 15px;
  .modal-content {
    border: none;
  }
  .modal-body {
    padding: 0;
  }

  .galleyName {
    p {
      margin: 0;
    }
  }
  .sp__card {
    overflow: visible;
    padding: 17px;
    background: none;
    .header {
      display: none;
    }
    .dashed {
      display: none;
    }
    .body {
      padding: 0;
      border: none;
    }
    .footer-card {
      padding: 20px 10px 0;
    }
    .text-input {
      margin-bottom: 0 !important;
    }
    .footer-links {
      .button {
        min-width: 166px;
        @media (max-width: 767px) {
          min-width: 120px;
          padding: 10px;
        }
      }
    }
  }
`;
