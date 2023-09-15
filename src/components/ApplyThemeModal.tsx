import React from 'react';
import styled from 'styled-components';
import Button from './NButton';

interface Props {
  className?: string;
  modalRef?: React.RefObject<HTMLDivElement>;
  selectedTheme: ITheme;
  onRevertTheme(): void;
  isThemeApplying: boolean;
  onApplyTheme(): void;
  compact?: boolean;
  edit?: boolean;
}

const ApplyThemeModal: React.FC<Props> = (props) => {
  const {
    modalRef,
    selectedTheme,
    onRevertTheme,
    isThemeApplying,
    onApplyTheme,
    className,
    edit = false,
  } = props;
  return (
    <div
      ref={modalRef}
      className={`${className} apply-theme-modal theme-editor-actions`}
    >
      <div className="theme-editor-action-wrap">
        <p>
          You are {edit ? 'editing' : 'previewing'} theme:{' '}
          <strong>{selectedTheme?.name}</strong>
        </p>
        <div className="action">
          <Button
            type="primary"
            shape="circle"
            size="small"
            isLoading={isThemeApplying}
            onClick={onApplyTheme}
          >
            {edit ? 'Save' : 'Apply Theme'}
          </Button>
          <Button
            shape="circle"
            size="small"
            type="info"
            onClick={onRevertTheme}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(ApplyThemeModal)`
  background: var(--pallete-background-default);
  text-align: center;
  font-size: 18px;
  line-height: 1;
  color: #2f1c43;
  z-index: 1;
  position: relative;

  @media (max-width: 767px) {
    font-size: 14px;
    line-height: 18px;
    margin: -10px 0 10px;
  }

  .sp_dark & {
    color: #fff;
  }

  ${(props) => {
    if (props.compact) {
      return `
        .theme-editor-action-wrap {
          display: flex;
          align-items: center;
          justify-content: center;

          @media (max-width: 767px) {
            flex-direction: column;
          }
        }

        p {
          margin: 0;
          margin-right: 32px;
          font-weight: 600;

          @media (max-width: 767px) {
            margin: 0 0 4px;
          }
        }

        strong {
          color: #3B719E;

          .sp_dark & {
            color: var(--pallete-primary-main);
          }
        }

        .action {
          margin-top: 0;

          .button {
            min-width: 120px;
          }
        }
      `;
    } else {
      return `
        .theme-editor-action-wrap {
          padding: 18px 20px 15px;
        }

        p {
          margin: 0 0 16px;
        }

        .action {
          .button {
            min-width: 167px;
          }
        }
      `;
    }
  }}

  strong {
    font-weight: 700;
  }

  p {
    @media (max-width: 767px) {
    }
  }

  .action {
    justify-content: center;
    margin-top: 0 !important;

    .button {
      @media (max-width: 767px) {
        min-width: 127px;
      }

      &.button-lg {
        @media (max-width: 767px) {
          font-size: 16px;
        }
      }
    }
  }
`;
