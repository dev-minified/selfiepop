import { Picker } from 'emoji-mart';
import useDropDown from 'hooks/useDropDown';
import React from 'react';
import styled from 'styled-components';

interface Props extends React.ComponentProps<typeof Picker> {
  triggerElement: React.ReactNode;
  className?: string;
}

const EmojiPicker: React.FC<Props> = (props) => {
  const { ref, isVisible, setIsVisible } = useDropDown(false, false);
  const mode: any = localStorage.getItem('sp_theme');
  const { triggerElement, className, onSelect } = props;
  return (
    <div className={`emoji-box ${className}`}>
      <div className="emoji">
        <div ref={ref}>
          {isVisible && (
            <Picker
              theme={mode}
              showPreview={false}
              showSkinTones={false}
              onSelect={onSelect}
              {...props}
            />
          )}
        </div>
        <div
          className="emoji-opener"
          onClick={() => setIsVisible((prev: boolean) => !prev)}
        >
          {triggerElement}
        </div>
      </div>
    </div>
  );
};

export default styled(EmojiPicker)``;
