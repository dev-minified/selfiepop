import ImageModifications from 'components/ImageModifications';
import { ImageLayoutOptions } from 'enums';
import { ReactElement, useEffect, useMemo } from 'react';
import { isDesktop } from 'react-device-detect';
import styled, { withTheme } from 'styled-components';
import {
  getChangeUrlsOnly,
  getGradient,
  getUrlParts,
  isValidUrl,
} from '../../util';
import GetSvg from './DynamicSvg';

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

const BackgroundImageStyle = styled.div<any>`
  width: 100%;
  height: 100%;
  .bgImage {
    width: 100%;
    height: 100%;
  }
  .publicbgImage img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${({ theme }: any) => `
  opacity: ${theme?.background?.imageAdvanceSettings?.imageOpacity}%;
  filter: blur(${theme?.background?.imageBlur}px)};

`}
  }
  .image-bg-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;
export function BackgroundImage({ theme }: Props): ReactElement {
  const svg = useMemo(() => {
    if (theme?.background?.pattern && typeof window !== 'undefined') {
      return window.btoa(
        GetSvg(
          theme?.background?.pattern || '',
          theme?.background?.patternColor,
        ),
      );
    }
    return '';
  }, [theme?.background?.pattern, theme?.background?.patternColor]);
  const setThemeHeight = () => {
    setTimeout(() => {
      const el = document.getElementById('themeHeight');
      el?.setAttribute(
        'style',
        `height: calc(${window.innerHeight}px + 200px)`,
      );
    }, 0);
  };
  useEffect(() => {
    if (!isDesktop) setThemeHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.background, isDesktop]);

  const { companyName }: any = isValidUrl(theme?.background?.image)
    ? getUrlParts(theme?.background?.image)
    : {};

  const { imageOpacity = 100, imageBlur = 0 } = theme?.background || {};
  const bgImage = theme?.background?.image;
  const { url } = getChangeUrlsOnly(bgImage, {
    checkspexist: true,
  });

  const obj =
    theme?.background?.layout === ImageLayoutOptions.TITLE
      ? {
          background: `url(${url})`,
          filter: `blur(${imageBlur}px)`,
        }
      : {};

  return useMemo(
    () => (
      <BackgroundImageStyle>
        {!!theme?.background?.image && (
          <div
            id="themeHeight"
            style={{ opacity: imageOpacity / 100, ...obj }}
            className={`bgImage ${companyName}`}
          >
            {theme?.background?.imageBlendMode &&
              theme?.background?.imageBlendMode !== 'normal' && (
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
                    mixBlendMode: theme?.background?.imageBlendMode as any,
                    pointerEvents: 'none',
                    left: 0,
                    zIndex: 1,
                  }}
                />
              )}
            <ImageModifications
              className="publicbgImage"
              src={bgImage}
              imgeSizesProps={{
                onlyDesktop: true,
                checkspexist: true,
              }}
            />

            {!!theme?.background?.isPatternActive &&
              !!theme?.background?.pattern && (
                <PatternStyled url={svg} className="image-bg-overlay" />
              )}
          </div>
        )}
      </BackgroundImageStyle>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.background],
  );
}

export default withTheme(BackgroundImage);
