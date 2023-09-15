import { darken, lighten } from 'util/colorUtils';
import { Colors } from '../CommonColors';

const PrimaryColors = {
  primary: '#255b87',
};
const SecondaryColors = {
  secondary: '#255b87',
  secondaryDark: '#236fb7',
};
export const pallete: Partial<IThemePallete> = {
  error: {
    main: Colors.red[700],
    light: Colors.red[400],
    dark: Colors.red[800],
  },
  text: {
    main: '#000',
  },
  primary: {
    main: PrimaryColors.primary,
    light: lighten(PrimaryColors.primary, 0.3),
    lighter: lighten(PrimaryColors.primary, 0.5),
    dark: darken(PrimaryColors.primary, 0.3),
    darker: darken(PrimaryColors.primary, 0.5),
  },
  secondary: {
    main: SecondaryColors.secondary,
    light: lighten(SecondaryColors.secondary, 0.3),
    lighter: lighten(SecondaryColors.secondary, 0.5),
    dark: SecondaryColors.secondaryDark,
    darker: darken(SecondaryColors.secondaryDark, 0.3),
  },
  common: {
    black: '#000000',
    white: '#ffffff',
  },
  action: {
    hover: lighten(PrimaryColors.primary, 0.05),
    disabled: Colors.grey[300],
    active: darken(PrimaryColors.primary, 0.1),
    focus: darken(PrimaryColors.primary, 0.2),
    disabledBackground: Colors.grey[400],
    selected: darken(PrimaryColors.primary, 0.3),
  },
  background: {
    default: '#fff',
  },
};
