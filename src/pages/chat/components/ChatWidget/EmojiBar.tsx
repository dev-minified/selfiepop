import { HorizontalDots } from 'assets/svgs';
import EmojiPicker from 'components/EmojiPicker';
import { Emoji, EmojiData } from 'emoji-mart';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  onSelect(emoji: EmojiData): void;
}

const emojis = [
  ':hearts:',
  ':thumbsup:',
  ':thumbsdown:',
  ':joy:',
  ':hushed:',
  ':cry:',
];

const EmojiBar: React.FC<Props> = (props) => {
  const { className, onSelect } = props;
  return (
    <div className={`emoji-bar-holder ${className}`}>
      <div className="emoji-bar">
        {emojis.map((e) => (
          <Emoji
            key={e}
            emoji={e}
            size={26}
            onClick={(emoji) => onSelect(emoji)}
          />
        ))}
        <EmojiPicker
          triggerElement={
            <span className="dots-img">
              <HorizontalDots />
            </span>
          }
          onSelect={(emoji) => onSelect(emoji)}
        />
      </div>
    </div>
  );
};

export default styled(EmojiBar)`
  min-width: 290px;
  border: 2px solid var(--pallete-colors-border);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
  display: inline-block;
  vertical-align: top;
  padding: 5px;
  border-radius: 20px;
  background: var(--pallete-background-default);

  .emoji-bar {
    display: flex;
    align-items: center;
  }

  .emoji-mart {
    position: absolute;
    right: 0;
    top: 100%;
  }

  .emoji-mart-emoji {
    width: 27px;
    margin: 0 6px;
    vertical-align: middle;
  }

  .dots-img {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--pallete-background-gray-400);
    border-radius: 100%;
    color: #fff;
    margin: 0 0 0 10px;

    circle {
      fill: currentColor;
    }
  }
`;
