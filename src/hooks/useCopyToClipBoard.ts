import { useState } from 'react';
import { CopyToClipBoard } from '../util';
let timeout: NodeJS.Timeout;
const useCopyToClipBoard = (destroytime = -1): [boolean, Function] => {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    setCopied(false);
    CopyToClipBoard(text);
    setCopied(true);
    if (destroytime > -1) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setCopied((f) => false);
      }, destroytime);
    }
  };
  return [copied, copy];
};

export default useCopyToClipBoard;
