import Scrollbar from 'components/Scrollbar';
import PeopleYoumayknow from 'pages/subscriptions/PeopleYoumayknow';
import { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const NewFeedRightView = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const history = useHistory();
  return (
    <div className={`${className} right-col all-subs-right-col`}>
      <Scrollbar>
        <PeopleYoumayknow
          onProfileCardClick={(item: any) => {
            history.push(`/profile/${item?.username}`);
          }}
        />
      </Scrollbar>
    </div>
  );
};
export default styled(NewFeedRightView)``;
