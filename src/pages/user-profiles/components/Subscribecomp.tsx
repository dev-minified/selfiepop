import { getProfileOrdersList } from 'api/Order';
import { ServiceType } from 'appconstants';
import AddCardModel from 'components/AddCardModal/AddCardModel';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import { setLoading } from 'store/reducer/global';
import { setProfileSubscription } from 'store/reducer/profileVisitor';
import SubscribeModel from '../Model/SubscribeModel';
type ISubModel = {
  onSubmitCallback?: () => void;
  onClose?: () => void;
  title?: string;
};
const Subscribecomp = ({ onSubmitCallback, onClose, title }: ISubModel) => {
  const [Comp, SetComp] = useState<any>(<></>);

  const dispatch = useAppDispatch();

  const seller = useAppSelector(
    (state) => state.profileVisitor.selectedProfile,
  );
  const activeMembership = useAppSelector(
    (state) => state.profileVisitor.activeMemberShip,
  );
  const [pop, setPop] = useState<any>();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const card = useAppSelector((state) => state.global.primaryCard);

  useEffect(() => {
    if (seller?._id) {
      setPop(
        seller.links.find(
          (l) => l.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        ),
      );
      if (!card) {
        SetComp(
          <AddCardModel
            isOpen={true}
            onClose={() => {
              SetComp(<></>);
              setIsModelOpen(true);
            }}
            shouldCloseOnOverlayClick={false}
          />,
        );
      } else {
        setIsModelOpen(true);
      }
    }
    return () => {};
  }, [seller?._id]);
  const controller = new AbortController();
  const fetchUserSub = async (
    sellerId: string,
  ): Promise<{ error: boolean; data: any }> => {
    // setTimeout(() => controller.abort(), 500);
    try {
      setLoading(true);
      const data = await getProfileOrdersList(
        {
          userId: sellerId,
          type: 'buyer',
          popType: 'chat-subscription',
        },
        { signal: controller.signal },
      );
      setLoading(false);
      if (!data?.cancelled) {
        if (!!data?.totalCount) {
          dispatch(setProfileSubscription(data.items[0]));
          return { error: false, data };
        }

        return { error: false, data: null };
      }

      return { error: true, data: null };
    } catch (error: any) {
      setLoading(false);
      console.log({ error: error?.message });
      return { error: true, data: null };
    }
  };
  const onSubscribe = () => {
    onSubmitCallback?.();
    fetchUserSub(seller?._id as string);
  };
  return (
    <React.Fragment>
      {Comp}

      {isModelOpen ? (
        <SubscribeModel
          title={title}
          isOpen={isModelOpen}
          onClose={() => {
            onClose?.();
            setIsModelOpen(false);
          }}
          item={activeMembership}
          seller={seller}
          pop={pop}
          onSubscribe={onSubscribe}
        />
      ) : null}
    </React.Fragment>
  );
};

export default Subscribecomp;
