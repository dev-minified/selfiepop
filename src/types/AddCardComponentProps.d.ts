type IAddCardComponentProps = {
  title?: string;
  onSubmit: () => void;
  buttonTitle: string;
  style?: {
    button: React.CSSProperties;
  };
};
