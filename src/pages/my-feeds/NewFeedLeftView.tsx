import PostsMobile from 'pages/subscriptions/mainContent/PostsMobile';
import { ReactElement } from 'react';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';

const NewFeedLeftView = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  return (
    <div
      className={`${className} all-subs-section ${
        isMobileOnly ? 'all-subs-mobile' : ''
      }`}
    >
      <PostsMobile
        className="chat-block all-subs-posts"
        AllUsers={true}
        //   onPostUserNameClick={onPostUserNameClick}
      />
    </div>
  );
};
export default styled(NewFeedLeftView)`
  &.all-subs-mobile {
    .posts-wrap {
      border: none;
    }
  }
`;
