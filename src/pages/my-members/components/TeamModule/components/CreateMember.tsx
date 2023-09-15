import FocusInput from 'components/focus-input';
import HeaderTitle from 'components/HeaderTitle';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { findUser } from 'store/reducer/teamManager';
import styled from 'styled-components';
import useItemWrapper from '../useItemWrapper';
interface Props {
  className?: string;
  isAnimationComplete?: boolean;
}

function TeamMembers({ className }: Props): ReactElement {
  const { user } = useAuth();
  const [username, setUsername] = useState<any>('');

  const dispatch = useAppDispatch();
  const history = useHistory();
  const { item, setUser } = useItemWrapper();
  const [activeButton, setIsActiveButton] = useState<boolean>(false);

  const fetchUser = useCallback(
    (values: any) => {
      setIsActiveButton(true);
      dispatch(
        findUser({
          userName: `${values}`,
          params: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .unwrap()
        .then((data: any) => {
          setIsActiveButton(false);
          if (data._id) {
            history.push(`/my-members/add-team-member/${data?.username}`);
          }
        })
        .catch((e) => {
          setIsActiveButton(false);
          if (e?.message) {
            toast.error(e.message);
            return;
          }
          toast.error('Something went wrong please try again!');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeButton],
  );
  useEffect(() => {
    if (item?.username && !username) {
      setUsername(item?.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.userId]);
  useEffect(() => {
    !item && setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div className="block-head">
        <p>
          Please enter the <strong>@USERNAME</strong> of the user who you want
          to add to your team.
        </p>
      </div>
      <FocusInput
        materialDesign
        label="Team Member Username"
        type="text"
        name="user"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          // fetchUser(e.target.value);
        }}
        validations={[{ noSpace: true }]}
      />
      <HeaderTitle
        buttonText={'NEXT STEP'}
        isloading={activeButton}
        isdisabled={activeButton}
        onClick={() => {
          if (username && username !== user?.username) {
            fetchUser(username);
          }
          if (username && username === user?.username) {
            toast.error("You can't manage your own account");
          }

          // history.push(`/my-members/add-team-member/${userss?.item?.username}`);
        }}
      />
    </div>
  );
}
export default styled(TeamMembers)`
  padding: 23px 30px;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .button.button-secondary {
    background: var(--pallete-primary-main);

    &:hover {
      background: var(--colors-indigo-200);
    }
  }

  .block-head {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 14px;

    p {
      margin: 0 0 16px;

      @media (max-width: 767px) {
        margin: 0 0 10px;
      }

      strong {
        color: var(--pallete-text-main);
      }
    }
  }
`;
