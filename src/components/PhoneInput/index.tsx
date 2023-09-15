import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styled from 'styled-components';

interface Props extends PhoneInputProps {}

const ReactPhoneInput: React.FC<Props> = (props) => {
  const { ...rest } = props;
  return <PhoneInput {...rest} />;
};

export default styled(ReactPhoneInput)``;
