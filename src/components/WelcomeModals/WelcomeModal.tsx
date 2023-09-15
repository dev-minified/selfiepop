import React from 'react';
import OnboardingWelcomeModal from './OnboardingWelcomeModal';
import PublicWelcomeModal from './PublicWelcomeModal';

interface Props {
  isOpen: boolean;
  user?: any;
  publicProfile?: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<Props> = ({
  isOpen,
  user,
  publicProfile = false,
  onClose,
}) => {
  return (
    <>
      {publicProfile ? (
        <PublicWelcomeModal isOpen={isOpen} onClose={onClose} user={user} />
      ) : (
        <OnboardingWelcomeModal isOpen={isOpen} onClose={onClose} user={user} />
      )}
    </>
  );
};

export default WelcomeModal;
