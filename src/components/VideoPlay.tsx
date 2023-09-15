import React, { forwardRef, useEffect, useState } from 'react';
import _ReactPlayer, { ReactPlayerProps } from 'react-player';
const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;
// Only loads the YouTube player
type IVdideoProps = ReactPlayerProps & {
  className?: string;
};
const defaultAttrs = {
  controlsList: 'nodownload',
  onContextMenu: (e: any) => e?.preventDefault(),
};
const VideoPlay = forwardRef(
  (
    {
      url,
      mute,
      loop,
      playing,
      className = 'videoPlayer',
      attributes = {},
      ...rest
    }: IVdideoProps,
    ref,
  ) => {
    const [isPlaying, setIsPlaying] = useState<boolean>();
    useEffect(() => {
      setIsPlaying(playing);
      return () => {};
    }, [playing]);

    return (
      <div className={`rc-vidoe-player ${className}`}>
        <ReactPlayer
          ref={ref as any}
          url={url}
          muted={mute}
          controls={true}
          className={'react-player'}
          width="100%"
          height="100%"
          playing={isPlaying}
          loop={loop}
          config={{
            file: {
              attributes: { ...defaultAttrs, ...attributes },
            },
          }}
          {...rest}
        />
      </div>
    );
  },
);

export default VideoPlay;
