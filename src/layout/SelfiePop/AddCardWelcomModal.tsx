import AddCardModal from 'components/AddCardModal';
import WelcomeModal from 'components/WelcomeModals/WelcomeModal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { onCardModalClose } from 'store/reducer/cardModal';
import { setWecomeModelState } from 'store/reducer/global';
import { getLocalStorage, removeLocalStorage } from 'util/index';
const AddCardWelcomModal = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const showWelcomeModel = useAppSelector(
    (state) => state.global.showWelcomeModel,
  );
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(
    getLocalStorage('showWelcomeModal', false) === 'true',
  );
  const isOpen = useAppSelector((state) => state.cardModal.isOpen);
  const isWelcomeModelOpen = isWelcomeModalOpen || showWelcomeModel;
  return (
    <>
      {isOpen ? (
        <AddCardModal
          isOpen={isOpen}
          onClose={() => dispatch(onCardModalClose())}
        />
      ) : null}
      {isWelcomeModelOpen ? (
        <WelcomeModal
          isOpen={isWelcomeModelOpen}
          user={user}
          onClose={() => {
            setIsWelcomeModalOpen(false);
            removeLocalStorage('showWelcomeModal');
            dispatch(setWecomeModelState(false));
          }}
        />
      ) : null}
    </>
  );
};

export default AddCardWelcomModal;
