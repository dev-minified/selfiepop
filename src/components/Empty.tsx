import { Empty } from 'assets/svgs';
import * as React from 'react';
import styled from 'styled-components';

interface IAppProps {
  className?: string;
  message?: string;
}

const App: React.FunctionComponent<IAppProps> = ({
  className,
  message = 'No Data',
}) => {
  return (
    <div className={className}>
      <div>
        <Empty />
      </div>
      <div>{message}</div>
    </div>
  );
};

export default styled(App)`
  text-align: center;
  padding: 10px 0 0;
`;
