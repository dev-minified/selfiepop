import HeaderTitle from 'components/HeaderTitle';
import ListItem from 'components/UserList/ListItem';
import { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import useItemWrapper from '../useItemWrapper';
interface Props {
  className?: string;
  isAnimationComplete?: boolean;
}

function ConfirmTeamMember({ className }: Props): ReactElement {
  const { username } = useParams<{ username: string }>();

  const { activeItem, item, setUser } = useItemWrapper();
  useEffect(() => {
    !item && setUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div className="block-head">
        <p>Please confirm this is the user you wish to add to your team:</p>
      </div>
      <ListItem
        className="user_list"
        {...activeItem}
        // onItemClick={(item: typeof items[0]) => {
        //   history.push(`/managed-accounts/${item.id}`);
        // }}
      />
      <HeaderTitle
        buttonText={'NEXT STEP'}
        buttonUrl={`/my-members/add-team-member/${username}/settings`}
      />
    </div>
  );
}
export default styled(ConfirmTeamMember)`
  padding: 23px 30px;

  @media (max-width: 767px) {
    padding: 10px 15px 30px;
  }

  .user_list {
    background: var(--pallete-background-default);

    &:hover {
      background: var(--pallete-background-secondary);
    }

    .user-managed-list__wrap {
      padding: 0;
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
