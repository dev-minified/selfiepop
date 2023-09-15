import { Link as LinkIcon } from 'assets/svgs';
import Modal from 'components/modal';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoPath: string;
}

const ShoutOutModalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  videoPath,
}) => {
  const [isCopied, copy] = useCopyToClipBoard();
  return (
    <Modal
      isOpen={isOpen}
      showHeader
      showFooter={false}
      onClose={onClose}
      className={`alert-modal`}
    >
      <div className="text-center">
        <div className="modal-head-area">
          <h3>Here is the link to your custom video.</h3>
        </div>
        <div className="modal-body-area">
          <div className="link-copy-area">
            <a
              href={videoPath}
              className="header-link-area__link"
              target="_blank"
              rel="noreferrer"
            >
              {videoPath}
            </a>
            <Button
              size="small"
              onClick={() => {
                copy(videoPath);
                toast.info('Copied the url');
              }}
            >
              <span className="img">
                <LinkIcon />
              </span>
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="modal-footer-area">
          <Button onClick={onClose} type="primary" shape="round" size="large">
            OK!
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShoutOutModalModal;
