import Scrollbar from 'components/Scrollbar';
import { ReactElement } from 'react';
import styled from 'styled-components';
import MemberShipSchedulePop from './components/MemberShipModule';

interface Props {
  className?: string;
}

function Slider({ className }: Props): ReactElement {
  return (
    <>
      <div className={`${className}`}>
        <Scrollbar>
          <MemberShipSchedulePop />
        </Scrollbar>
      </div>
    </>
  );
}
export default styled(Slider)`
  height: 100%;
`;
