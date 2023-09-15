import { Link as LinkIcon } from 'assets/svgs';
import Modal from 'components/modal';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../NButton';
import { toast } from '../toaster';
interface Props {
  isOpen: boolean;
  user?: any;
  onClose: () => void;
}

const OnboardingWelcomeModal: React.FC<Props> = ({ isOpen, user, onClose }) => {
  const [isCopied, copy] = useCopyToClipBoard();
  const [copyStatus, setCopyStatus] = useState(false);
  const link = `${window.location.host}/${user?.username}`.replace('www.', '');
  return (
    <Modal
      isOpen={isOpen}
      showHeader
      showFooter={false}
      onClose={onClose}
      className={`alert-modal mobile`}
      styles={{ overlayStyle: { zIndex: 101 } }}
    >
      <div className="text-center">
        <div className="modal-head-area">
          <h2 className="text-capitalize">
            Hi {user?.pageTitle ?? 'Incognito User'}!
          </h2>
          <h3>Your page is ready to go!</h3>
        </div>
        <div className="modal-body-area">
          <p>
            Simply click the copy button below to copy and share your pop page
            on your social media bio!
          </p>
          <div className="link-copy-area">
            <Link
              to={`${window.location.host}/${user?.username}`}
              className="header-link-area__link"
              target="_blank"
            >
              {link}
            </Link>
            <Button
              size="small"
              onClick={() => {
                copy(link);
                toast.info('Copied the url');
                setCopyStatus(true);
                setTimeout(() => {
                  setCopyStatus(false);
                }, 8000);
              }}
            >
              <span className="img">
                <LinkIcon />
              </span>
              {isCopied && copyStatus ? 'Copied' : 'Copy'}
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
export default OnboardingWelcomeModal;
