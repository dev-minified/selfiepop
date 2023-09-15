import { getCounterLabel } from 'api/Utils';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { headerCount } from 'store/reducer/counter';
import styled from 'styled-components';
import MembersComponent from './MembersContent';
import MemberSlider from './components/memberSlider';
interface Props {
  className?: string;
  isAnimationComplete?: boolean;
}

function Members({ className }: Props): ReactElement {
  const { user } = useAuth();
  const history = useHistory();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!user?.enableMembershipFunctionality || user?.skipOnBoarding) {
      history.push('/my-profile');
    }

    getCounterLabel()
      .then((counter) => {
        if (!counter.cancelled) {
          dispatch(headerCount(counter));
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user?.enableMembershipFunctionality]);

  return (
    <div className={className}>
      <Scrollbar>
        <MembersComponent />
        <MemberSlider />
      </Scrollbar>
    </div>
  );
}
export default styled(Members)`
  height: 100%;
  .slider-links {
    padding: 0 !important;
    border: none !important;
  }
`;
