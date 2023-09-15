import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import _ReactPlayer, { ReactPlayerProps } from 'react-player';
import styled, { withTheme } from 'styled-components';
import { getGradient, getUrlParts, isValidUrl } from '../../util';
import GetSvg from './DynamicSvg';
const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;
const getVideoId = (video: string) => {
  if (!!video) {
    try {
      const url = new URL(video);
      return url.searchParams.get('v');
    } catch (e) {
      return '';
    }
  }

  return '';
};

interface Props {
  theme: ITheme;
}
const PatternStyled = styled.div<any>`
  ${({ url, theme }: any) => `
  background-image: url("data:image/svg+xml;base64,${url}");
  opacity: ${theme?.background?.patternOpacity}%;
  z-index: 0;
`}
`;

const BackgroundVideoStyle = styled.div<any>`
  .video {
    position: fixed;
    left: 0px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  #existing-iframe-example {
    width: 100%;
    height: 100%;
  }

  iframe {
    width: 100vw !important;
    height: 56.25vw !important;
    min-height: 100vh;
    min-width: 177.77vh;
    position: absolute;
    top: 50%;
    margin: 0 !important;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > div {
    width: 100% !important;
    height: 100% !important;
  }

  .video-player-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;
export function BackgroundVideo({ theme }: Props): ReactElement {
  const svg = useMemo(() => {
    if (theme?.background?.pattern && typeof window !== 'undefined') {
      return window.btoa(
        GetSvg(theme?.background?.pattern, theme?.background?.patternColor),
      );
    }
    return '';
  }, [theme?.background?.pattern, theme?.background?.patternColor]);

  const [playing, setPlaying] = useState(true);
  const rp: any = useRef<typeof ReactPlayer>(null);
  const { companyName }: any = isValidUrl(theme?.background?.video)
    ? getUrlParts(theme?.background?.video)
    : {};

  useEffect(() => {
    if (!playing) {
      setPlaying(true);
    }
  }, [playing]);

  const { videoOpacity = 100 } = theme?.background || {};
  return useMemo(
    () => (
      <BackgroundVideoStyle>
        {theme?.background?.type === 'video' && !!theme?.background?.video && (
          <div
            style={{ opacity: videoOpacity / 100 }}
            className={`video ${companyName}`}
          >
            {theme?.background?.videoBlendMode && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: getGradient(
                    theme?.background?.subtype || 'solid',
                    theme?.background?.gradient,
                    theme?.background?.solidColor || '#fff',
                  ),
                  position: 'absolute',
                  top: 0,
                  mixBlendMode: theme?.background?.videoBlendMode as any,
                  pointerEvents: 'none',
                  left: 0,
                  zIndex: 1,
                }}
              />
            )}
            <ReactPlayer
              ref={rp}
              muted
              id="existing-iframe-example"
              width="640"
              height="360"
              playing={playing}
              url={theme?.background?.video}
              playsinline
              stopOnUnmount={false}
              controls={false}
              onEnded={() => {
                rp.current.seekTo(0);
              }}
              config={{
                youtube: {
                  playerVars: {
                    lazy: true,
                    mute: 1,
                    enablejsapi: 1,
                    controls: 0,
                    playlist: getVideoId(theme?.background?.video),
                    playsinline: 1,
                  },
                },
                vimeo: {
                  playerOptions: {
                    lazy: true,
                    responsive: false,
                    background: true,
                    controls: false,
                    autoplay: true,
                    loop: true,
                  },
                },
              }}
              onPause={() => {
                setPlaying(false);
              }}
            />
            {!!theme?.background?.isPatternActive &&
              !!theme?.background?.pattern && (
                <PatternStyled url={svg} className="video-player-overlay" />
              )}
          </div>
        )}
      </BackgroundVideoStyle>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.background, playing],
  );
}

export default withTheme(BackgroundVideo);
