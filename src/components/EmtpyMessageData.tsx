import { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  text?: ReactNode;
  className?: string;
};

const EmtpyMessageData = (props: Props) => {
  const { text = "You don't have any data...", className } = props;
  return (
    <div className={`py-30 px-10 empty-data text-center ${className}`}>
      {text}
    </div>
  );
};

export default styled(EmtpyMessageData)`
  color: #acacac;
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
`;
