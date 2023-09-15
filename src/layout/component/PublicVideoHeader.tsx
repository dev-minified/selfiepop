import VideoPlay from 'components/VideoPlay';
import React, { useMemo, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';

interface Props {
  applyFullTheme?: boolean;
  theme?: ITheme;
  user?: IUser;
  className?: string;
}

const PublicVideoHeader: React.FC<Props> = (props) => {
  const { className, theme } = props;
  const [error, setError] = useState(false);
  const video = isMobileOnly
    ? theme?.profile?.profileVideo?.mobile
    : theme?.profile?.profileVideo?.desktop;
  const vidoePlayer = useMemo(() => {
    return error ? (
      <VideoPlay
        url={video}
        muted
        loop
        playsInline
        preload="metadata"
        playing={true}
        controls={false}
        key={video}
      />
    ) : (
      <video
        key={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        // eslint-disable-next-line
        onError={() => setError((_: boolean) => true)}
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }, [error, video]);
  return theme?.profile?.isActive ? (
    <div className={`visual-frame  ${className}`} key={video}>
      <div className="container" onContextMenu={(e) => e.preventDefault()}>
        {vidoePlayer}
      </div>
    </div>
  ) : null;
};

export default styled(PublicVideoHeader)`
  width: 594px;
  height: 334px;
  margin: 0 auto 30px;
  position: relative;
  z-index: 3;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
  }

  video {
    width: 100%;
    height: 100%;

    @media (max-width: 600px) {
      width: 100%;
      height: auto;
    }
  }
`;
