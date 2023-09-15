import { darken, lighten } from 'util/colorUtils';
import { Colors } from '../CommonColors';

const PrimaryColors = {
  ...Colors.darkBlue,
};
export const pallete: Partial<IThemePallete> = {
  error: {
    main: Colors.red[700],
    light: Colors.red[400],
    dark: Colors.red[800],
  },
  primary: {
    main: PrimaryColors[900],
    light: PrimaryColors[700],
    lighter: PrimaryColors[400],
    dark: PrimaryColors.A400,
    darker: PrimaryColors.A700,
  },
  common: {
    black: '#000000',
    white: '#ffffff',
  },
  text: {
    main: Colors.grey[300],
    light: Colors.grey[500],
    lighter: Colors.grey[700],
    dark: Colors.grey[200],
    darker: Colors.grey[100],
  },
  action: {
    hover: lighten(PrimaryColors[900], 0.05),
    disabled: Colors.grey[300],
    active: darken(PrimaryColors[900], 0.1),
    focus: darken(PrimaryColors[900], 0.2),
    disabledBackground: Colors.grey[400],
    selected: darken(PrimaryColors[900], 0.3),
  },
  background: {
    default: Colors.darkGrey[700],
  },
};
