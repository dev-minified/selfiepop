import { forwardRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import styled from 'styled-components';
type IAudioPlay = {
  className?: string;
  onClick?: (...args: []) => void;
  id?: string;
};
const AudioPlay = forwardRef(
  (
    {
      className,

      src,
      onClick,
      id = 'audio_player',
      ...rest
    }: IAudioPlay & typeof AudioPlayer.defaultProps,
    ref,
  ) => {
    return (
      <div className={`${className} audio-holder`} id={id} onClick={onClick}>
        <AudioPlayer src={src} ref={ref as any} {...rest} />
      </div>
    );
  },
);

export default styled(AudioPlay)`
  .rhap_container {
    background: #e6ecf5;
    padding: 10px 15px 10px 46px;
    position: relative;
  }

  .rhap_progress-container {
    outline: none;
  }

  .rhap_progress-bar-show-download {
    background: #c8cdd5;
  }

  .rhap_main-controls-button {
    color: #9da0a5;
  }

  .rhap_download-progress {
    background: rgba(255, 255, 255, 0.2);
  }

  .rhap_play-pause-button {
    width: 32px;
    height: 32px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .rhap_progress-filled {
    background: var(--pallete-background-default);
  }

  .rhap_progress-indicator {
    background: var(--pallete-background-default);
  }

  .rhap_current-time {
    font-size: 14px;
    line-height: 16px;
  }

  .rhap_volume-controls,
  .rhap_additional-controls,
  .rhap_rewind-button,
  .rhap_forward-button {
    display: none;
  }

  .rhap_controls-section {
    position: absolute;
    left: 8px;
    top: 3px;
    margin-top: 0;
  }
`;
