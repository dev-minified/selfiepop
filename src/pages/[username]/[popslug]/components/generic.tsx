import { orderCreate } from 'api/Order';
import { updateGuestUser } from 'api/User';
import { createOrderWithGuestUser } from 'api/Utils';
import attrAccept from 'attr-accept';
import ImageModifications from 'components/ImageModifications';
import InformationWidget from 'components/InformationWidget';
import Button, { ButtonSkeleton } from 'components/NButton';
import Select from 'components/Select';
import Slider from 'components/slider';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import PaymaForm from 'pages/purchase/payma-form';
import PopLiveForm from 'pages/purchase/poplive-form';
import ShoutoutForm from 'pages/purchase/shoutout-form';
import { stringify } from 'querystring';
import React, { ReactElement, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory, useParams } from 'react-router';
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import styled from 'styled-components';
import 'styles/qa-widget.css';
import { arrayFilter } from 'util/index';
import InfoCard from './Infocard';
interface IServiceProps {
  pop: any;
  ownProfile: boolean;
  onStopPOPupOpen: Function;
  infoCard?: any;
  icon?: ReactElement;
  buttonTitle?: string;
  className?: string;
  skeleton?: boolean;
  isPreview?: boolean;
  imgSettings?: ImageSizesProps['settings'];
  onCreateOrder?: (
    order: IOrderType & {
      buyer: Record<string, any>;
      seller: Record<string, any>;
    },
  ) => void | Promise<any>;
}

const Generic: React.FC<IServiceProps> = (props) => {
  const {
    pop,
    infoCard,
    buttonTitle,
    ownProfile,
    onStopPOPupOpen,
    icon,
    className,
    isPreview,
    skeleton,
    onCreateOrder,
    imgSettings = {
      onlyDesktop: true,
    },
  } = props;

  const {
    _id,
    title,
    price,
    description,
    priceVariations = [],
    questions = [],
    additionalArt = [],
    popType,
  } = pop || {};

  const { user: authUser, loggedIn } = useAuth();
  const gstUser = useAppSelector((state) => state.checkout?.guestUser);
  const history = useHistory();
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const [isloader, setLoader] = useState(false);
  const [variations, setVariations] = useState([]);
  const [selectedV, setSelectedV] = useState<any>({});

  useEffect(() => {
    const vs: any = [
      {
        _id,
        title,
        price,
        description,
        product: true,
        isActive: true,
      },
      ...priceVariations,
    ]
      .filter(({ isActive }) => isActive)
      .map((v: any) => {
        return { label: `${v.title || ''} - $${v.price}`, value: v };
      });

    setVariations(vs);
    setSelectedV(vs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop]);

  const handleCreateOrder = async (values: any) => {
    if (ownProfile && onStopPOPupOpen) {
      onStopPOPupOpen();
      return;
    }
    setLoader(true);
    const selected = selectedV.value;
    dispatch(resetOrder());
    const sQuestions = arrayFilter(questions, { isActive: true }).concat(
      arrayFilter(selected?.questions || [], { isActive: true }),
    );

    const requestData: any = {
      questions: sQuestions,
      popId: _id,
      vpopId: selected._id,
      buyer:
        loggedIn || gstUser?.data?._id
          ? authUser?._id ?? gstUser?.data?._id
          : null,
    };

    if (popType === ServiceType.PAYMA) {
      requestData.paymaQuestion = values.paymaQuestion;
    }

    if (popType === ServiceType.SHOUTOUT) {
      requestData.questions = values.questions;
    }

    if (popType === ServiceType.POPLIVE) {
      requestData.popLiveDateTime = values.dateTime;
    }

    try {
      const response =
        loggedIn || gstUser?.data?._id
          ? await orderCreate(requestData)
          : await createOrderWithGuestUser(requestData);

      const { order, guestUser } = response;
      if (!loggedIn && !gstUser?.data?._id) {
        dispatch(setGuestUser(guestUser));
        dispatch(
          setGuestUserTokens({
            refreshToken: guestUser.refreshToken,
            token: guestUser.token,
          }),
        );
      }

      dispatch(setOrder(order));
      const GuesUser = gstUser?.data?._id ? gstUser : guestUser;
      onCreateOrder?.(order);
      if (popType === ServiceType.SHOUTOUT) {
        if (
          values.questions?.[0]?.responseValue === 'me' &&
          values.user?.name?.length &&
          !loggedIn
        ) {
          const name = values.user?.name?.replace(/\s{2,}/g, ' ').trim();
          const firstName = name.split(' ').slice(0, -1).join(' ');
          const lastName = name.split(' ').slice(-1).join(' ');

          await updateGuestUser({ firstName, lastName }).then((data) => {
            dispatch(setGuestUser({ ...GuesUser, ...data }));
          });
        }
      }

      const prams = stringify({ order: order._id, type: popType });
      return history.push(
        `/${username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    } catch (e: any) {
      if (e?.message) {
        toast.error(e?.message);
      }
    }
    setLoader(false);
  };

  const {
    title: vTitle,
    description: vDescription,
    _id: vId,
  } = selectedV?.value || {};
  return (
    <>
      <div className={className}>
        <div className="qa-wedget mb-30">
          <div className="title-box justify-content-between w-100">
            <div className="heading_Wrapper d-flex align-items-center">
              {icon && skeleton ? (
                <Skeleton circle width={40} height={40} />
              ) : pop.isThumbnailActive && pop.popThumbnail ? (
                <ImageModifications
                  imgeSizesProps={{
                    onlyMobile: true,
                    imgix: {
                      all: 'w=64&h=64',
                    },
                  }}
                  src={pop?.popThumbnail}
                  className="thumbnail"
                  alt=""
                />
              ) : (
                <span className="icon">{icon}</span>
              )}

              {skeleton ? (
                <div className="w-100">
                  <Skeleton height={40} width="50%" />
                </div>
              ) : (
                <h2 className="text-capitalize">{vTitle || title}</h2>
              )}
            </div>
            {selectedV?.value?.price > -1 && (
              <span className="price h2">{`$${selectedV?.value?.price}`}</span>
            )}
          </div>
        </div>
        {additionalArt.length > 0 && (
          <Slider
            imgSettings={imgSettings}
            additionalArt={additionalArt.map((f: any) => {
              if (
                attrAccept({ name: f?.artName, type: f?.artType }, 'image/*')
              ) {
                return {
                  ...f,
                  artPath: f?.artPath,
                };
              }
              return f;
            })}
          />
        )}
        {infoCard && (
          <InfoCard {...infoCard} skeleton={skeleton} className="mb-30" />
        )}

        {description?.length > 0 && (
          <InformationWidget icon={false} className="mb-30">
            {description}
          </InformationWidget>
        )}

        {variations.length > 1 && (
          <div className="select-wrap mb-30 pb-0">
            <Select
              options={variations}
              defaultValue={selectedV}
              value={selectedV}
              onChange={(data) => {
                setSelectedV(data);
              }}
              size="large"
            />
          </div>
        )}
        {vDescription?.length > 0 && vId !== _id && (
          <InformationWidget className="mb-30">
            {vDescription}
          </InformationWidget>
        )}
        {popType === ServiceType.PAYMA && (
          <PaymaForm
            isPreview={isPreview}
            submitButton={
              skeleton ? (
                <ButtonSkeleton size="x-large" />
              ) : (
                !isPreview && (
                  <Button
                    type="primary"
                    size="x-large"
                    htmlType="submit"
                    block
                    isLoading={isloader}
                  >
                    {buttonTitle}
                  </Button>
                )
              )
            }
            onSubmit={handleCreateOrder}
          />
        )}

        {popType === ServiceType.SHOUTOUT && (
          <ShoutoutForm
            isPreview={isPreview}
            submitButton={
              skeleton ? (
                <ButtonSkeleton size="x-large" />
              ) : (
                !isPreview && (
                  <Button
                    type="primary"
                    size="x-large"
                    htmlType="submit"
                    block
                    isLoading={isloader}
                  >
                    {buttonTitle}
                  </Button>
                )
              )
            }
            pop={pop}
            onSubmit={handleCreateOrder}
          />
        )}

        {(popType === ServiceType.POPLIVE || popType === ServiceType) && (
          <PopLiveForm
            submitButton={
              skeleton ? (
                <ButtonSkeleton size="x-large" />
              ) : (
                !isPreview && (
                  <Button
                    type="primary"
                    size="x-large"
                    htmlType="submit"
                    block
                    isLoading={isloader}
                  >
                    {buttonTitle}
                  </Button>
                )
              )
            }
            pop={pop}
            onSubmit={handleCreateOrder}
          />
        )}
        {popType === ServiceType.ADDITIONAL_SERVICES &&
          (skeleton ? (
            <ButtonSkeleton size="x-large" />
          ) : (
            !isPreview && (
              <Button
                type="primary"
                size="x-large"
                htmlType="submit"
                block
                isLoading={isloader}
                onClick={handleCreateOrder}
              >
                {buttonTitle}
              </Button>
            )
          ))}
      </div>
    </>
  );
};

export default styled(Generic)`
  .icon {
    margin-right: 12px;
    color: var(--pallete-primary-darker);
  }

  .thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    object-fit: cover;
    margin: 0 15px 0 0;
  }
`;
