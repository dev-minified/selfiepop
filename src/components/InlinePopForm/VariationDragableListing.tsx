import {
  Dollar,
  FacebookAlt,
  InstagramAlt,
  OnlyFans,
  PlusFilled,
  SnapChat,
  Tiktok,
  TwitterAlt,
  YoutubeAlt,
} from 'assets/svgs';
import classNames from 'classnames';
import NewButton from 'components/NButton';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import React, { useEffect, useState } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import swal from 'sweetalert';
import useOpenClose from '../../hooks/useOpenClose';
import DragableItem from './DragableItem';
import InlinePriceVariationFrom from './PriceVariationFrom';
import QuestionForm from './QuestionForm';
import SortableList from './SortableList';

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
    case 'snapchat':
      return <SnapChat className="shoutout-snapicon" />;
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
  popType = '',
  cardTitle = '',
}: any) => {
  const [open, onOpen, onClose] = useOpenClose();

  const handleAddVariation = async (values: any) => {
    addVariation && (await addVariation(values));
    onClose();
  };

  const handleOpen = () => {
    onOpen();
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

      <InlinePriceVariationFrom
        isOpen={open}
        questions={renderQuestionInForm}
        icon={cardIcon}
        showQuestions={false}
        cbonCancel={onClose}
        cbonSubmit={handleAddVariation}
        value={{ type }}
        socialMediaLinks={socialMediaLinks}
        type={type}
        popType={popType}
        title={
          cardTitle
            ? cardTitle
            : type === 'simple'
            ? 'Add New Variation'
            : 'New Promotional Shoutout'
        }
        options={
          type === 'simple'
            ? { delete: false, status: true, close: true }
            : { delete: false, status: false, close: false }
        }
      />
    </div>
  );
};

const VariationDragableListing = ({
  value,
  onChange,
  title = 'Title',
  type,
  renderQuestionInForm = false,
  options = { edit: true, toggel: true },
  socialMediaLinks = [],
  itemStyleType = 'default',
  buttonPosition = 'top',
  itemIcon,
  showItemPriceTag = true,
  itemSubtitle: ItemSubtitle,
  addVariationbtnTitle,
  popType = '',
  sortKey = 'sortOrder',
  cardTitle = '',
}: {
  value: PriceVariant[];
  title?: string;
  onChange: Function;
  options?: {
    toggel?: boolean;
    delete?: boolean;
    edit?: boolean;
    view?: boolean;
    download?: boolean;
    tag?: boolean;
  };
  type: string;
  renderQuestionInForm?: boolean;
  showItemPriceTag?: boolean;
  socialMediaLinks?: SocialLink[];
  itemStyleType?: 'default' | 'compact';
  buttonPosition?: 'top' | 'bottom';
  itemIcon?: React.ReactElement;
  itemSubtitle?: any;
  addVariationbtnTitle?: string;
  popType?: string;
  sortKey?: string;
  cardTitle?: string;
}) => {
  const [variations, setVariations] = useState<any[]>(value || []);
  const [selected, setSelected] = useState<number | null>(null);
  const [isQuestionModalOpen, onQuestionModalOpen, onQuestionModalClose] =
    useOpenClose();
  const [selectedQuestionVariation, setSelectedQuestionVariation] = useState<
    number | null
  >(null);

  const handleVariationChange = (v: any, variant?: any, action?: string) => {
    setVariations(v);
    onChange(v, variant, action);
  };

  useEffect(() => {
    if (value?.length > 0) {
      setVariations(value);
    }
  }, [value]);
  const addVariation = (values: any) => {
    if (type === 'advertise') {
      swal({
        title: 'Shoutout saved',
        text: 'Do you want to add a question for this shoutout?',
        buttons: ['Later Maybe', 'Yes'],
        icon: 'info',
      }).then((isYes) => {
        if (isYes) {
          onQuestionModalOpen();
          setSelectedQuestionVariation(variations.length);
        }
      });
    }
    if (popType === ServiceType.CHAT_SUBSCRIPTION) {
      const isExist = variations.find(
        (v: any) => (v.title || '').trim() === (values.title || '').trim(),
      );

      if (isExist) {
        toast.error(
          `Variation with the same title (${values?.title}) already exist...`,
        );
        return;
      }
    }

    handleVariationChange(
      [...variations, { ...values, isNew: true }],
      { ...values, isNew: true },
      'add',
    );
  };

  const removeVariation = (index: number) => {
    const newVariations = [...variations];
    const delVariation = newVariations.splice(index, 1);
    handleVariationChange(newVariations, delVariation[0], 'delete');
    setSelected(null);
  };

  const updateActive = (index: number, isActive: boolean) => {
    const newArray = variations.slice();
    newArray[index] = { ...newArray[index], isActive };
    handleVariationChange(newArray, newArray[index], 'update');
  };

  const updateVariation = (values: any) => {
    if (selected === null) return;
    const newArray = variations.slice();
    newArray[selected] = { ...newArray[selected], ...values };
    handleVariationChange(newArray, newArray[selected], 'update');
    setSelected(null);
  };

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex === newIndex) return;
    const sortedArray = arrayMove<any>(variations, oldIndex, newIndex).map(
      (item, index) => ({ ...item, [sortKey]: index }),
    );
    handleVariationChange(sortedArray, null, 'sort');
  };

  const onQuestionSubmitHandler = (values: any) => {
    if (selectedQuestionVariation === null || selectedQuestionVariation < 0)
      return;
    const newV = [...variations];
    const questions = { ...newV[selectedQuestionVariation] };
    questions.questions = [
      ...(newV[selectedQuestionVariation].questions || []),
      { ...values },
    ];
    newV[selectedQuestionVariation] = questions;
    handleVariationChange(newV, newV[selectedQuestionVariation], 'update');
    onQuestionModalClose();
  };

  const selectedItemValue =
    selected !== null ? variations[selected] : undefined;
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
          popType={popType}
          cardTitle={cardTitle}
        />
      )}
      <SortableList
        useDragHandle
        onSortEnd={onSortEnd}
        distance={5}
        selected={selected}
        items={variations}
        renderItem={(item: PriceVariant | any, index: number) => {
          return (
            <DragableItem
              options={{
                ...options,
                delete: item?.allowDelete,
                edit: item?.isDeleted ? false : true,
                toggel: item?.isDeleted ? false : true,
              }}
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
              onDeleteClick={(index: number) => removeVariation(index)}
              subtitle={ItemSubtitle?.(item?.stats)}
              tag={
                showItemPriceTag
                  ? `$${(Math.round(item.price * 100) / 100).toFixed(2)}`
                  : showItemPriceTag && item.price
              }
              {...item}
            />
          );
        }}
      />

      <InlinePriceVariationFrom
        isOpen={selected !== null}
        value={selectedItemValue}
        icon={
          type === 'advertise'
            ? getAdvertisementVariationIcon(selectedItemValue?.type)
            : itemIcon || <Dollar />
        }
        socialMediaLinks={socialMediaLinks}
        questions={renderQuestionInForm}
        type={type}
        cbonCancel={() => setSelected(null)}
        cbonSubmit={updateVariation}
        // onDeleteClick={() => removeVariation(index)}
        className={classNames(itemStyleType, {
          [`social_variation_${selectedItemValue?.type}`]: type,
        })}
        popType={popType}
      />

      <QuestionForm
        isOpen={isQuestionModalOpen}
        value={{ isActive: true }}
        title={'New Question'}
        cbonCancel={onQuestionModalClose}
        cbonSubmit={onQuestionSubmitHandler}
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
          popType={popType}
          cardTitle={cardTitle}
        />
      )}
    </div>
  );
};

export default VariationDragableListing;
