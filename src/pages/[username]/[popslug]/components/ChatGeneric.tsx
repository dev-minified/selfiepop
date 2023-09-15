import attrAccept from 'attr-accept';
import ImageModifications from 'components/ImageModifications';
import InformationWidget from 'components/InformationWidget';
import Slider from 'components/slider';
import { toast } from 'components/toaster';
import React, { ReactElement, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/qa-widget.css';
import ChatsubscriptionstepForm from './ChatsubscriptionstepForm';
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
  publicUser?: IUser;

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

    ownProfile,

    icon,
    className,

    skeleton,
    onCreateOrder,
    publicUser,
    imgSettings = {
      onlyDesktop: true,
    },
  } = props;

  const {
    // _id,
    title,

    priceVariations = [],

    additionalArt = [],
  } = pop || {};

  // const [variations, setVariations] = useState([]);
  const [selectedV, setSelectedV] = useState<any>({});
  const history = useHistory();

  // useEffect(() => {
  // const vs: any = [
  //   {
  //     _id,
  //     title,
  //     price,
  //     description,
  //     product: true,
  //     isActive: true,
  //   },
  //   ...priceVariations,
  // ]
  //   .filter(({ isActive }) => isActive)
  //   .map((v: any) => {
  //     return { label: `${v.title || ''} - $${v.price}`, value: v };
  //   });

  // setVariations(vs);
  // setSelectedV(vs[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pop]);
  useEffect(() => {
    if (!!priceVariations?.length) {
      let variation = priceVariations.find(
        (v: PriceVariant) => v.isDefault && !v.isArchive && v.isActive,
      );
      if (!variation) {
        variation = priceVariations.find(
          (v: PriceVariant) => !v.isArchive && v.isActive,
        );
      }
      if (!variation) {
        toast.error("This seller don't have any membership");
        return history.replace(`/${publicUser?.username}`);
      }
      setSelectedV(variation);
    }
  }, [pop]);
  const { title: vTitle, description } = selectedV || {};
  // const {
  //   title: vTitle,
  //   description: vDescription,
  //   _id: vId,
  // } = selectedV?.value || {};
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
            {selectedV?.price > -1 && (
              <span className="price h2">{`$${selectedV?.price}`}</span>
            )}
            {/* {selectedV?.value?.price > -1 && (
              <span className="price h2">{`$${selectedV?.value?.price}`}</span>
            )} */}
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

        {/* {variations.length > 1 && (
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
        )} */}
        {/* {vDescription?.length > 0 && vId !== _id && (
          <InformationWidget className="mb-30">
            {vDescription}
          </InformationWidget>
        )} */}
        <ChatsubscriptionstepForm
          publicUser={publicUser}
          onCreateOrder={onCreateOrder}
          ownProfile={ownProfile}
          pop={pop}
          selectedV={selectedV}
        />
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
