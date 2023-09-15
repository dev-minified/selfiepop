type Color = {
  50: string;

  100: string;

  200: string;

  300: string;

  400: string;

  500: string;

  600: string;

  700: string;

  800: string;

  900: string;

  A100: string;

  A200: string;

  A400: string;

  A700: string;
};

type IThemeShadows = string[];
type IThemAction = {
  active?: string;
  hover: string;
  selected?: string;
  disabled: string;
  disabledBackground?: string;
  focus?: string;
};
type PalleteColor = {
  main?: string;
  light?: string;
  dark?: string;
  lighter?: string;
  darker?: string;
  contrastText?: string;
  shades?: {};
};
type IThemeBackground = {
  default: string;
};
type IThemePallete = {
  primary: PalleteColor;
  secondary: PalleteColor;
  info: PalleteColor;
  text: PalleteColor;
  success: PalleteColor;
  error: PalleteColor;
  warning: PalleteColor;
  common: {
    black: string;
    white: string;
  };
  action: IThemAction;
  background?: IThemeBackground;
};
type IThemeColors = {
  yellow: Color;
  teal: Color;
  red: Color;
  purple: Color;
  pink: Color;
  orange: Color;
  lime: Color;
  lightBlue: Color;
  indigo: Color;
  grey: Color;
  green: Color;
  deepPurple: Color;
  deepOrange: Color;
  cyan: Color;
  brown: Color;
  blueGrey: Color;
  blue: Color;
  amber: Color;
  darkGrey: Color;
  darkBlue: Color;
};

// type ThemeProps = {
//   name: string;
//   borderRadius: string;
//   bodyColor: string;
//   textColor: string;
// };

type IThemeMode = 'dark' | 'light';
type IAppTheme = {
  name?: string;
  mode: IThemeMode;

  pallete: Partial<IThemePallete>;
  colors: IThemeColors;

  shadows: IThemeShadows;
};

type Apptheme = IAppTheme & { publicTheme?: ITheme };
