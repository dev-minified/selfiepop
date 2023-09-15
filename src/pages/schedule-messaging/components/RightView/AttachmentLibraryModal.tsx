import { ImageThumbnail } from 'assets/svgs';
import AttachmentContainer from 'components/AttachmentContainer';
import Modal from 'components/modal';
import Button from 'components/NButton';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
interface Props {
  attachments?: MediaType[];
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (media: MediaType[]) => void;
}

const AttachmentLibraryModal: React.FC<Props> = (props) => {
  const { attachments, isOpen, onClose, onSubmit } = props;
  const sentMedia = useAppSelector((state) => state.scheduledMessaging.media);
  const [media, setMedia] =
    useState<(MediaType & { checked?: boolean })[]>(sentMedia);

  useEffect(() => {
    const attachmentNames = attachments?.map((a) => a.name) || [];
    setMedia(
      sentMedia.map((m) => ({
        ...m,
        checked: attachmentNames.includes(m.name),
      })),
    );
  }, [sentMedia, attachments]);

  const onCheck = (id: string, value: boolean) => {
    setMedia((prev) =>
      prev.map((m) => (m._id === id ? { ...m, checked: value } : m)),
    );
  };

  const handleSubmit = () => {
    onSubmit?.(media.filter((m) => m.checked));
  };

  return (
    <Modal
      className="gallery-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span>
          <ImageThumbnail /> Library
        </span>
      }
      showFooter={false}
    >
      <div className="flex-wrap library-attachments d-flex">
        {media
          ?.filter((val, id, array) => {
            return !(
              array.slice(id + 1).findIndex((f) => f?.name === val?.name) > -1
            );
          })
          ?.map((a, index) => (
            <AttachmentContainer
              key={index}
              media={a}
              showOptions={{
                timeStampText: true,
                video: true,
                play: true,
                closeIcon: false,
                selectable: true,
              }}
              onSelect={onCheck}
            />
          ))}
      </div>
      <div className="attachment-library-footer">
        <Button type="text" onClick={onClose}>
          CANCEL
        </Button>
        <Button type="text" onClick={handleSubmit}>
          EXCLUDE
        </Button>
      </div>
    </Modal>
  );
};

export default AttachmentLibraryModal;
