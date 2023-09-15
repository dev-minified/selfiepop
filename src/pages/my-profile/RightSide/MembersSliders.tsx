// import NewButton from 'components/NButton';
import Model from 'components/Model';
import Scrollbar from 'components/Scrollbar';
import { ServiceType } from 'enums';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import ChatSubscription from 'pages/[username]/[popslug]/components/ChatSubscription';
import RightView from 'pages/schedule-messaging/components/RightView/RightView';
import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

interface Props {
  className?: string;
  showAttachmentViwe?: boolean;
}
const RightCalenderView = () => {
  return <RightView />;
};
function MembersSlider({ className }: Props): ReactElement {
  const location = useLocation();
  const { user } = useAuth();
  const [previewPop, setpreviewPop] = useState<any>(null);
  const [stopPOPup, onStopPOPupOpen, onStopPOPupClose] = useOpenClose();
  const { slider } = parseQuery(location.search);
  useEffect(() => {
    const links = user.links;
    slider !== 'schedule' &&
      setpreviewPop(
        links.find(
          (l: any) => l?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        ),
      );
  }, [slider, user.links]);

  return (
    <>
      <div className={`${className}`}>
        <Scrollbar>
          <div className="membershipPadding">
            {slider === 'schedule' ? (
              <RightCalenderView />
            ) : (
              <ChatSubscription
                pop={previewPop}
                ownProfile
                publicUser={user}
                onStopPOPupOpen={onStopPOPupOpen}
              />
            )}

            <Model
              open={stopPOPup}
              icon="error"
              title="Can not perform this action"
              text="Sorry, but you can not purchase a service from yourself."
              onClose={onStopPOPupClose}
              onConfirm={onStopPOPupClose}
            />
          </div>
        </Scrollbar>
      </div>
    </>
  );
}
export default styled(MembersSlider)`
  height: 100%;
  .membershipPadding {
    padding: 15px 0;
  }
  .chat_widget_height {
    height: calc(100vh - 114px);
    display: flex;
    flex-direction: column;
  }
`;
