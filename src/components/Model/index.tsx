import { useEffect } from 'react';
import swal from 'sweetalert';
interface IModelProps {
  title?: string;
  text?: string;
  open: boolean;
  icon: 'warning' | 'success' | 'error' | string;
  onClose?: () => void;
  className?: string;
  onConfirm?: () => void;
  confirmButtonText?: string;
  ShowButtons?: [boolean, boolean];
  onCloseButtonText?: string;
}

export const AppAlert = ({
  title,
  text,
  className,
  buttons = [],
  icon,
  onClose,
  onConfirm,
}: any) => {
  let ic = '';
  const [closeText, ConfirmText] = buttons;
  switch (icon) {
    default:
      ic = '/assets/images/error.png';
  }

  swal({
    title,
    text,
    className: className || 'app-popup',
    buttons: [closeText || '', ConfirmText || 'OK'],
    icon: ic,
  }).then(async (event) => {
    if (event) onConfirm && (await onConfirm());
    else onClose && onClose();
  });
};

const Model: React.FC<IModelProps> = ({
  text,
  title,
  open = false,
  icon,
  onClose,
  onConfirm,
  className,
  confirmButtonText = 'OK',
  onCloseButtonText = '',
}: IModelProps) => {
  useEffect(() => {
    if (open) {
      AppAlert({
        title,
        text,
        icon,
        className,
        onClose,
        onConfirm,
        buttons: [onCloseButtonText, confirmButtonText],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, icon, open, title, text, confirmButtonText, onConfirm, onClose]);
  return null;
};

export default Model;
