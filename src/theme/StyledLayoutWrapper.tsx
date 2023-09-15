import { useAppSelector } from 'hooks/useAppSelector';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './Global.styled';

export type StyledTypes = {
  children: ReactNode | JSX.Element;
};

export function StyledLayoutWrapper(props: StyledTypes) {
  const { children } = props;
  const theme = useAppSelector((state) => state.appTheme).apptheme;

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
}
