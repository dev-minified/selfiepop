import {
  Dollar,
  FacebookAlt,
  InstagramAlt,
  OnlyFans,
  PlusFilled,
  Tiktok,
  TwitterAlt,
  YoutubeAlt,
} from 'assets/svgs';
import classNames from 'classnames';
import NewButton from 'components/NButton';
import useOpenClose from 'hooks/useOpenClose';
import React, { useEffect, useRef, useState } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

import DragableItem from '../DragableItem';
import SortableList from '../SortableList';
import InlinePriceVariationFrom from './SubscriptionPriceVariationFrom';

const getAdvertisementVariationIcon = (type?: string) => {
  switch (type) {
    case 'facebook':
      return <FacebookAlt />;
    case 'instagram':
      return <InstagramAlt />;
    case 'twitter':
      return <TwitterAlt />;
    case 'youtube':
      return <YoutubeAlt />;
    case 'tiktok':
      return <Tiktok />;
    case 'onlyfans':
      return <OnlyFans />;
    default:
      return <Dollar />;
  }
};

const AddVariationButton = ({
  addVariation,
  title,
  type,
  renderQuestionInForm,
  socialMediaLinks = [],
  cardIcon,
  className,
  addVariationbtnTitle = '',
}: any) => {
  const [open, onOpen, onClose] = useOpenClose();
  const ref = useRef<any>(null);
  const handleAddVariation = async (values: any) => {
    addVariation && (await addVariation(values));
    onClose();
  };
  const handleOpen = () => {
    onOpen();

    setTimeout(() => {
      if (ref?.current) {
        scrollIntoView(ref.current, {
          behavior: 'smooth',
          scrollMode: 'if-needed',
          block: 'center',
          inline: 'nearest',
        });
      }
    }, 0);
  };
  return (
    <div className={classNames('__add', className)}>
      <NewButton
        type="primary"
        icon={<PlusFilled />}
        block
        onClick={handleOpen}
      >
        <span className="pl-10">
          {addVariationbtnTitle || `New  ${title}  Options`}
        </span>
      </NewButton>
      {open && (
        <div className="mt-15 mb-15" ref={ref}>
          <InlinePriceVariationFrom
            questions={renderQuestionInForm}
            icon={cardIcon}
            footer={true}
            cbonCancel={onClose}
            cbonSubmit={handleAddVariation}
            value={{ type }}
            socialMediaLinks={socialMediaLinks}
            type={type}
            title={'Add a Coupon'}
            // options={
            //   type === 'simple'
            //     ? { delete: false, status: true, close: true }
            //     : { delete: false, status: false, close: false }
            // }
            options={{ delete: false, status: true, close: false }}
          />
        </div>
      )}
    </div>
  );
};

const VariationDragableListing = ({
  value,
  onChange,
  title = 'Title',
  type,
  renderQuestionInForm = false,
  socialMediaLinks = [],
  itemStyleType = 'default',
  buttonPosition = 'top',
  itemIcon,
  showItemPriceTag = true,
  addVariationbtnTitle,
  onVariationUpdateCallback,
}: {
  value: PriceVariant[];
  title?: string;
  onChange?: Function;
  onVariationUpdateCallback?: Function;
  type: string;
  renderQuestionInForm?: boolean;
  showItemPriceTag?: boolean;
  socialMediaLinks?: SocialLink[];
  itemStyleType?: 'default' | 'compact';
  buttonPosition?: 'top' | 'bottom';
  itemIcon?: React.ReactElement;
  itemSubtitle?: any;
  addVariationbtnTitle?: string;
}) => {
  const [variations, setVariations] = useState<any[]>(value || []);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (value?.length > 0) {
      setVariations(value);
    }
  }, [value]);

  useEffect(() => {
    onChange?.(variations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variations]);

  const addVariation = (values: any) => {
    setVariations([...variations, { ...values }]);
    onVariationUpdateCallback?.({ ...values });
  };

  const removeVariation = (index: number) => {
    const newVariations = [...variations];
    const deletedItem = newVariations.splice(index, 1);
    setVariations(newVariations);
    setSelected(null);
    onVariationUpdateCallback?.(deletedItem && deletedItem[0], true);
  };

  const updateActive = (index: number, isActive: boolean) => {
    const newArray = variations.slice();
    newArray[index] = { ...newArray[index], isActive };
    setVariations(newArray);
    onVariationUpdateCallback?.(newArray[index]);
  };

  const updateVariation = (values: any) => {
    if (selected === null) return;
    const newArray = variations.slice();
    newArray[selected] = { ...newArray[selected], ...values };
    setVariations(newArray);
    setSelected(null);
    onVariationUpdateCallback?.(newArray[selected]);
  };

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const sortedArray = arrayMove<any>(variations, oldIndex, newIndex).map(
      (item, index) => ({ ...item, sortOrder: index }),
    );
    setVariations(sortedArray);
    onVariationUpdateCallback?.(sortedArray, false, 'sort');
  };

  const shouldCancelStart = (e: any): boolean => {
    // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
    if (
      [
        'input',
        'label',
        'img',
        'button',
        'textarea',
        'select',
        'option',
      ].indexOf(e.target.tagName.toLowerCase()) !== -1
    ) {
      return true; // Return true to cancel sorting
    }

    return false;
  };

  return (
    <div>
      {buttonPosition === 'top' && (
        <AddVariationButton
          addVariation={addVariation}
          socialMediaLinks={socialMediaLinks}
          addVariationbtnTitle={addVariationbtnTitle}
          title={title}
          type={type}
          renderQuestionInForm={renderQuestionInForm}
          cardIcon={itemIcon}
          className={classNames(itemStyleType, {
            [`social_variation_${type}`]: type,
          })}
        />
      )}
      <SortableList
        useDragHandle
        onSortEnd={onSortEnd}
        shouldCancelStart={shouldCancelStart}
        distance={5}
        selected={selected}
        items={variations}
        renderItem={(
          item: PriceVariant & { amount: number; code: string },
          index: number,
        ) => {
          return !(selected === index) ? (
            <>
              <DragableItem
                icon={
                  type === 'advertise'
                    ? getAdvertisementVariationIcon(item.type)
                    : itemIcon || <Dollar />
                }
                className={classNames(itemStyleType, {
                  [`social_variation_${item.type}`]: type,
                })}
                index={index}
                onEdit={(index: number) => setSelected(index)}
                onToggel={async () => {
                  await updateActive(index, !item.isActive);
                }}
                subtitle={item?.code}
                tag={
                  showItemPriceTag &&
                  `$${(Math.round(item.amount * 100) / 100).toFixed(2)}`
                }
                onDeleteClick={() => removeVariation(index)}
                options={{ edit: true, delete: true, toggel: true }}
                {...item}
              />
            </>
          ) : (
            <div className="mb-15">
              <InlinePriceVariationFrom
                value={item}
                icon={
                  type === 'advertise'
                    ? getAdvertisementVariationIcon(item.type)
                    : itemIcon || <Dollar />
                }
                socialMediaLinks={socialMediaLinks}
                questions={renderQuestionInForm}
                type={type}
                cbonCancel={() => setSelected(null)}
                cbonSubmit={updateVariation}
                onDeleteClick={() => removeVariation(index)}
                className={classNames(itemStyleType, {
                  [`social_variation_${item.type}`]: type,
                })}
              />
            </div>
          );
        }}
      />
      {buttonPosition === 'bottom' && (
        <AddVariationButton
          addVariation={addVariation}
          socialMediaLinks={socialMediaLinks}
          title={title}
          type={type}
          cardIcon={itemIcon}
          renderQuestionInForm={renderQuestionInForm}
          addVariationbtnTitle={addVariationbtnTitle}
          className={classNames(itemStyleType, {
            [`social_variation_${type}`]: type,
          })}
        />
      )}
    </div>
  );
};

export default VariationDragableListing;
