import Button from 'components/NButton';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import { useState } from 'react';
import styled from 'styled-components';
import ConfirmationMediaExist from './model/ConfirmationModal';

type Props = {
  className?: string;
  addtoButtontext?: string;

  onSubmit?: (
    selectedMedia?: Record<string, MediaLibrary>,
  ) => Promise<any> | void;
  onCancel?: (...args: any) => void;
};

const ModalFooter = (props: Props) => {
  const {
    className,
    onCancel,
    onSubmit,
    addtoButtontext = 'Add to Post',
  } = props;
  const selectedMediaItems = useAppSelector(
    (state) => state.libraryMedia.selectedMediaItems,
  );
  const alreadyShardMediawithbuyer = useAppSelector(
    (state) => state.libraryMedia.existingSharedMediasSelected,
  );
  const [open, onOpen, onClose] = useOpenClose();
  const [isLoading, setIsLoading] = useState(false);
  const handleOnSubmit = async (e: any) => {
    try {
      setIsLoading(true);
      e.stopPropagation();
      if (!!Object.keys(alreadyShardMediawithbuyer as object).length) {
        onOpen();
        return;
      }
      await onSubmit?.(selectedMediaItems);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  const isShowFooter = Object.keys(selectedMediaItems || {})?.length > 0;
  return isShowFooter ? (
    <div className={`modal-footer text-right ${className}`}>
      <ConfirmationMediaExist
        description="This user already has one or more of these items. Are you sure you
            want to proceed?"
        isOpen={open}
        onSave={async () => {
          try {
            setIsLoading(true);
            await onSubmit?.(selectedMediaItems);
            setIsLoading(false);
          } catch (error) {
            console.log({ error });
            setIsLoading(false);
          }
        }}
        onClose={() => {
          onClose();
          setIsLoading(false);
        }}
      />
      {/* we can remove the type for cancel button and chagne the type to primary for save button and remove the size from both ot them to go back to previous viwe */}
      <Button
        onClick={onCancel}
        isLoading={false}
        disabled={isLoading}
        className="btn-publish"
        size="middle"
        shape="circle"
        id="sp_test_modal_cancel"
      >
        Cancel
      </Button>
      <Button
        isLoading={isLoading}
        onClick={handleOnSubmit}
        type="primary"
        className="btn-publish"
        size="middle"
        shape="circle"
        htmlType="submit"
        id="sp_test_modal_ok"
        disabled={isLoading}
      >
        {addtoButtontext}
      </Button>
    </div>
  ) : null;
};

export default styled(ModalFooter)`
  border-top: 1px solid #edf1f3 !important;
  padding: 14px 20px;

  /* .sp_dark & {
    border-top-color: var(--pallete-colors-border) !important;
  } */

  .button {
    min-width: 107px;
    padding: 8px 15px;
  }
`;
