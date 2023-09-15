import Scrollbar from 'components/Scrollbar';
import { ReactNode } from 'react';
import styled from 'styled-components';
type Props = {
  className?: string;
  children: ReactNode;
};

const ScrollBarWrapper = (props: Props) => {
  const { className, children } = props;
  return (
    <div className={className}>
      <Scrollbar>{children}</Scrollbar>
    </div>
  );
};

export default styled(ScrollBarWrapper)`
  height: 100%;
`;
