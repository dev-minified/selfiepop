import Scrollbar from 'components/Scrollbar';
import RightView from 'pages/schedule-messaging/components/RightView/RightView';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const ScheduleRightWrapper = ({ className }: Props) => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={`${className}  `}>
      <Scrollbar>
        <div className="wrapper-div">
          <RightView
            className={className}
            managedAccountId={id}
            messagePrefix={`manager-${id}`}
          />
        </div>
      </Scrollbar>
    </div>
  );
};

export default styled(ScheduleRightWrapper)`
  height: 100%;
  .wrapper-div {
    margin: 0 auto;
    max-width: 800px;
  }
`;
