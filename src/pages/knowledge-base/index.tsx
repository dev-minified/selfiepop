import TwoPanelLayout from 'layout/TwoPanelLayout';
import styled from 'styled-components';
import LeftLayout from './components/LeftLayout';
import RightLayout from './components/RightLayout';

const KnowledgeBase = () => {
  return (
    <div>
      <TwoPanelLayout
        leftSubHeader={false}
        rightSubHeader={false}
        leftView={<LeftLayout />}
        rightView={<RightLayout />}
      />
    </div>
  );
};

export default styled(KnowledgeBase)``;
