import { Cancel, Mp3Icon, Play, Plus, PlusCircledAlt } from 'assets/svgs';
import Image from 'components/Image';
import Button from 'components/NButton';
import React, { useState } from 'react';
import styled from 'styled-components';
import AttachmentLibraryModal from './AttachmentLibraryModal';
interface Props {
  className?: string;
  attachments?: ChatMessage['messageMedia'];
  showAddButton?: boolean;
  title?: React.ReactNode;
  removable?: boolean;
  onUpdate?(media: MediaType[]): void;
  cacheburst?: boolean;
}

const ScheduledMessageAttachments: React.FC<Props> = (props) => {
  const {
    className,
    attachments,
    showAddButton = false,
    removable = true,
    title,
    onUpdate,
    cacheburst = false,
  } = props;
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  return (
    <div className={className}>
      {title}
      {attachments?.length ? (
        <div className="images-list">
          {attachments?.map((attachment, idx, arr) => {
            return (
              <div className="image" key={attachment._id}>
                {attachment?.type?.includes('video') ? (
                  <img src={attachment.thumbnail} alt="" />
                ) : attachment?.type?.includes('audio') ? (
                  <div className="audio_thumbnail">
                    <div className="icons-holder">
                      <span className="img-audio">
                        <Mp3Icon />
                      </span>
                    </div>
                  </div>
                ) : (
                  <Image
                    fallbackUrl={attachment?.fallbackUrl}
                    src={attachment?.path}
                    breakCache={cacheburst}
                  />
                )}
                {attachment?.type?.includes('video') && (
                  <span className="img-play">
                    <Play />
                  </span>
                )}
                {removable && (
                  <span
                    className="cancel"
                    onClick={() =>
                      onUpdate?.(arr.filter((a) => a._id !== attachment._id))
                    }
                  >
                    <Cancel />
                  </span>
                )}
              </div>
            );
          })}
          {showAddButton && (
            <div
              className="add-attachment"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus />
            </div>
          )}
        </div>
      ) : showAddButton ? (
        <Button
          shape="circle"
          icon={<PlusCircledAlt />}
          block
          type="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-media"
        >
          SELECT MEDIA
        </Button>
      ) : null}
      {isAddModalOpen && (
        <AttachmentLibraryModal
          attachments={attachments}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(media) => {
            onUpdate?.(media);
            setIsAddModalOpen(false);
          }}
          isOpen={isAddModalOpen}
        />
      )}
    </div>
  );
};

export default styled(ScheduledMessageAttachments)`
  .images-list {
    position: relative;
    margin: 0 -3px;
    display: flex;
    flex-wrap: wrap;

    .image {
      position: relative;
      margin: 0 3px 6px;
      width: 63px;
      height: 63px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .audio_thumbnail {
      width: 100%;
      height: 100%;
      background: var(--pallete-background-gray-secondary-light);
      display: flex;
      align-items: center;
      justify-content: center;

      .icons-holder {
        width: 40px;

        img,
        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
    }

    .add-attachment {
      width: 63px;
      height: 63px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: #e6dee8;
      cursor: pointer;
      margin: 0 3px 6px;
    }
  }

  .cancel {
    position: absolute;
    width: 10px;
    right: 4px;
    top: 4px;
    background: #000;
    border-radius: 100%;
    height: 10px;
    color: #fff;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .img-play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
`;
