import { useState } from 'react';

const useOpenClose = (
  d: any = false,
): [boolean, () => void, () => void, () => void] => {
  const [open, setOpen] = useState(d);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen(!open);
  return [open, onOpen, onClose, onToggle];
};

export default useOpenClose;
