import {
  BookVideo,
  CalendarIcon,
  Card,
  ClockIcon,
  DigitalDownload,
  Forward,
  Message,
  OK,
  PopLive,
  Question,
  Shoutout,
  ThumbsUpIcon,
  VideoClip,
} from 'assets/svgs';
import { ServiceType } from 'enums';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';

import Model from 'components/Model';
import useOpenClose from 'hooks/useOpenClose';
import Advertise from '../components/advertise';
import Generic from '../components/generic';
import ChatSubscription from './ChatGeneric';

const shoutoutQuestion: Questions[] = [
  {
    title: 'Who is this Custom Video for?',
    text: 'Is this Custom Video for you or someone else?',
    responseType: 'radioOptions',
    responseOptions: [
      { key: 'someone_else', value: true, text: 'Someone Else' },
      { key: 'me', value: false, text: 'Myself' },
    ],
    responseValue: 'someone_else',
    isRequired: true,
    questionHint: 'Is this Custom Video for you?',
    isActive: true,
  },
  {
    title: 'Who is this Custom Video for?',
    text: '',
    responseType: 'text',
    responseValue: '',
    isRequired: true,
    questionHint: 'The person this Custom Video is for.',
    isActive: true,
  },
  {
    title: 'What do you want me to say to them ?',
    text: 'Shoutout Instructions',
    responseType: 'bigText',
    responseValue: '',
    isRequired: true,
    isActive: true,
    questionHint:
      'Try to be as specific as possible with your request such as your relationship to the recipient, numbers and details.',
  },
];

const PublicServices: React.FC<{
  value?: any;
  user?: any;
  isPreivew?: boolean;
  isOwnProfile?: boolean;
  className?: string;
}> = ({
  user: publicUser,
  value = null,
  isPreivew = false,
  isOwnProfile: ownProfile = false,

  className,
}) => {
  const [stopPOPup, onStopPOPupOpen, onStopPOPupClose] = useOpenClose();
  const [pop, setPop] = useState<any>({});
  const analytics = useAnalytics();

  useEffect(() => {
    if (value) {
      setPop(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const onOrderCreate = (
    order: IOrderType & {
      buyer: Record<string, any>;
      seller: Record<string, any>;
    },
  ) => {
    analytics.track('purchase_step_1', {
      purchasedFrom: order.seller._id,
      purchaseTypeSlug: pop.popType,
      purchaseAmount: order?.price,
      itemId: pop?._id,
    });
  };
  const GetPop = useMemo(() => {
    switch (pop.popType) {
      case ServiceType.PAYMA:
        return (
          <Generic
            pop={pop}
            isPreview={isPreivew}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            buttonTitle="Submit Question"
            icon={<Question />}
            onCreateOrder={onOrderCreate}
          />
        );
      case ServiceType.POPLIVE:
        return (
          <Generic
            pop={pop}
            isPreview={isPreivew}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            icon={<PopLive />}
            onCreateOrder={onOrderCreate}
            buttonTitle="Book it"
            infoCard={{
              title: 'How does it Work?',
              items: [
                {
                  icon: <CalendarIcon />,
                  label: 'Select a date',
                },
                {
                  icon: <ClockIcon />,
                  label: 'Choose the time',
                },
                {
                  icon: <BookVideo />,
                  label: 'Book Your Video Call',
                },
              ],
            }}
          />
        );
      case ServiceType.SHOUTOUT:
        return (
          <Generic
            isPreview={isPreivew}
            onCreateOrder={onOrderCreate}
            pop={{ ...pop, questions: shoutoutQuestion }}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            buttonTitle="Order Custom Video"
            icon={<Shoutout />}
            infoCard={{
              title: 'How does Custom Video Work?',
              items: [
                {
                  icon: <Forward />,
                  label: 'Send your Request',
                },
                {
                  icon: <VideoClip />,
                  label: 'Get your video',
                },
                {
                  icon: <ThumbsUpIcon />,
                  label: 'Share and enjoy',
                },
              ],
            }}
          />
        );
      case ServiceType.DIGITAL_DOWNLOADS:
        return (
          <Generic
            isPreview={isPreivew}
            pop={pop}
            onCreateOrder={onOrderCreate}
            icon={<DigitalDownload />}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            buttonTitle="Ask Anything"
            infoCard={{
              title: 'How does a Digital Download Work?',
              items: [
                {
                  icon: <OK />,
                  label: 'Choose your options',
                },
                {
                  icon: <Card />,
                  label: 'Complete payment',
                },
                {
                  icon: <BookVideo />,
                  label: 'Download your file',
                },
              ],
            }}
          />
        );
      case ServiceType.ADDITIONAL_SERVICES:
        return (
          <Generic
            isPreview={isPreivew}
            pop={pop}
            ownProfile={ownProfile}
            onCreateOrder={onOrderCreate}
            onStopPOPupOpen={onStopPOPupOpen}
            buttonTitle="Order Now"
          />
        );
      case ServiceType.ADVERTISE:
        return (
          <Advertise
            pop={pop}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            onCreateOrder={onOrderCreate}
          />
        );
      case ServiceType.CHAT_SUBSCRIPTION:
        return (
          <ChatSubscription
            publicUser={publicUser}
            pop={pop}
            onCreateOrder={onOrderCreate}
            ownProfile={ownProfile}
            onStopPOPupOpen={onStopPOPupOpen}
            icon={<Message color="var(--pallete-text-main)" />}
          />
        );
      default:
        return (
          <Generic
            pop={{}}
            onCreateOrder={onOrderCreate}
            ownProfile={false}
            onStopPOPupOpen={onStopPOPupOpen}
            infoCard={{}}
            skeleton
          />
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStopPOPupOpen, ownProfile, pop]);

  return (
    <div className={className}>
      {GetPop}
      <Model
        open={stopPOPup}
        icon="error"
        title="Can not perform this action"
        text="Sorry, but you can not purchase a service from yourself."
        onClose={onStopPOPupClose}
        onConfirm={onStopPOPupClose}
      />
    </div>
  );
};

export default styled(PublicServices)``;
