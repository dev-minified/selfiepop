import { ReactElement, useMemo } from 'react';
import styled, { withTheme } from 'styled-components';
import { getGradient } from '../../util';
import GetSvg from './DynamicSvg';

interface Props {
  theme: ITheme;
  twoPanelLayout?: boolean;
}
const PatternStyled = styled.div<any>`
  ${({ url, theme }: any) => `
  background-image: url("data:image/svg+xml;base64,${url}");
  opacity: ${theme?.background?.patternOpacity}%;
  z-index: 0;
`}
`;
const BackgroundColorElemet = styled.div<{
  twoPanelLayout?: boolean;
  theme: ITheme;
}>`
  :before {
    position: fixed;
    ${({ twoPanelLayout }: any) =>
      twoPanelLayout ? ' left: 420px;' : ' left: 0;'}
    right: 0;
    top: 0;
    bottom: 0;
    content: '';
    z-index: -1;
    ${({ theme }) => {
      const gradient: string = getGradient(
        theme?.background?.subtype || 'solid',
        theme?.background?.gradient,
        theme?.background?.solidColor || '#fff',
      );
      return `background: ${gradient};

      `;
    }}
  }
  .color-bg-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

export function BackgroundColor({
  theme,
  twoPanelLayout,
}: Props): ReactElement {
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

  return useMemo(
    () => (
      <BackgroundColorElemet twoPanelLayout={twoPanelLayout}>
        <div className={`bgColor`}>
          {theme?.background?.colorBlendMode && (
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
                mixBlendMode: theme?.background?.colorBlendMode as any,
                pointerEvents: 'none',
                left: 0,
                zIndex: 1,
              }}
            />
          )}

          {!!theme?.background?.isPatternActive &&
            !!theme?.background?.pattern && (
              <PatternStyled url={svg} className="color-bg-overlay" />
            )}
        </div>
      </BackgroundColorElemet>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.background],
  );
}

export default withTheme(BackgroundColor);
