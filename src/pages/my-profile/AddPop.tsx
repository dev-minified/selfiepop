// import NewButton from 'components/NButton';
import ChatSubscription from 'components/InlinePopForm/Chatsubscription/ChatSubscription';
import DigitalFileDownloadPop from 'components/InlinePopForm/DigitalFileDownload/DigitalFileDownloadPop';
import CustomVideoPopcustomVideoPop from 'components/InlinePopForm/PriceVariation/PriceVariationPop';
import PromotionalMediaPop from 'components/InlinePopForm/PromotionalMedia/PromotionalMediaPop';
import PromotionalShoutoutPop from 'components/InlinePopForm/PromotionalShoutout/PromotionalShoutoutPop';
import QuestionPop from 'components/InlinePopForm/Questions/QuestionPop';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { addPopToState, parseQuery } from 'util/index';
import MemberLevels from '../my-members/components/MemberLevels';

function AddPop({ className }: { className?: string }): ReactElement {
  const location = useLocation();
  const st = parseQuery(location.search);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const previewPopId = useAppSelector(
    (state) => state.popslice?.previewPop?._id,
  );
  const { id } = useParams<any>();
  useEffect(() => {
    if (id) {
      addPopToState(id, user, dispatch, { _id: previewPopId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getComponents = () => {
    const { subType, slider } = st;
    if (subType === 'chat-subscription' && slider === 'PriceVariation') {
      return <MemberLevels />;
    }
    if (slider === 'PriceVariation') {
      return (
        <CustomVideoPopcustomVideoPop
          buttonTitle={
            subType === 'chat-subscription' ? 'New Membership Type' : ''
          }
        />
      );
    } else if (slider === 'PromotionalMedia') {
      return <PromotionalMediaPop />;
    } else if (slider === 'DigitalDownloadFile') {
      return <DigitalFileDownloadPop />;
    } else if (slider === 'Questions') {
      return <QuestionPop title={'Related Questions'} />;
    } else if (slider === 'PromotionalShoutout') {
      return <PromotionalShoutoutPop />;
    } else if (subType === 'chat-subscription') {
      return <ChatSubscription />;
    }
    return null;
  };
  return (
    <div className={className}>
      <Scrollbar>{getComponents()}</Scrollbar>
    </div>
  );
}
export default styled(AddPop)`
  height: 100%;
`;
