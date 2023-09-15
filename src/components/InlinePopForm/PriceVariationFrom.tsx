import { createSocialAccount } from 'api/social-accounts';
import {
  Dollar,
  FacebookAlt,
  InstagramAlt,
  OnlyFans,
  QuestionMark,
  SnapChat,
  Tiktok,
  TwitterAlt,
  YoutubeAlt,
} from 'assets/svgs';
import NewButton from 'components/NButton';
import { CardSection } from 'components/SPCards/SimpleCard';
import Select from 'components/Select';
import Checkbox from 'components/checkbox';
import Model from 'components/modal';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useOpenClose from 'hooks/useOpenClose';
import CreateShoutoutSocialIconModel from 'pages/account/components/CreateShoutoutSocialIconModel';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { setSocialLinks } from 'store/reducer/global';
import styled from 'styled-components';
import * as yup from 'yup';
import FocusInput from '../focus-input';
import CustomQuestionsDragableListing from './CustomQuestionsDragableListing';
import {
  SelectCustomItem,
  SelectCustomMenu,
  SelectCustomOption,
} from './CustomSelectOptions';

// const validationSchema = yup.object().shape({
//   title: yup.string().max(255).required('Title is required'),
//   price: yup
//     .number()
//     .min(0, 'Price should be At least $0')
//     .required('Price should be At least $0'),
//   description: yup.string().max(500),
// });
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  footer?: ReactNode;
  questions?: boolean;
  onDeleteClick?(): void;
  className?: string;
  title?: string;
  type?: string;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  socialMediaLinks?: SocialLink[];
  icon?: ReactElement;
  isOpen?: boolean;
  showQuestions?: boolean;
  popType?: string;
}
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
      return <SnapChat />;
    default:
      return <Dollar />;
  }
};
const InlinePriceVariationFrom = ({
  value,
  cbonCancel,
  cbonSubmit,
  footer,
  questions,
  className,
  title: cardTitle,
  type,
  socialMediaLinks = [],
  icon,
  isOpen: isModelOpen = false,
  showQuestions: showQuestionsModule = true,
  popType = '',
}: Props) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [showPriceVariationModel, setShowPriceVariationModel] = useState(false);
  const [isOpen, onOpen, onClose] = useOpenClose();
  const [socialValue, setSocialValue] = useState<any>();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (questions && showQuestionsModule) setShowQuestions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setShowPriceVariationModel(isModelOpen);
  }, [isModelOpen]);
  const validationSchema = yup.object().shape({
    title: yup.string().max(255).required('Title is required'),
    price:
      popType === ServiceType.CHAT_SUBSCRIPTION
        ? yup.number().required('Paid memberships must be at least $5')
        : yup
            .number()
            .min(0, 'Price should be At least $0')
            .required('Price should be At least $0'),
    description: yup.string().max(500),
  });

  const links = socialMediaLinks?.map((link) => ({
    label: (
      <SelectCustomItem
        icon={getAdvertisementVariationIcon(link.type)}
        label={link.name}
        type={link.type}
      />
    ),
    value: link._id,
  }));
  const {
    values,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik<any>({
    validationSchema,
    initialValues: {
      title: '',
      price: 0,
      description: '',
      isActive: true,
      stats: undefined,
      allowBuyerToMessage: true,
      allowContentAccess: true,
    },
    onSubmit: async (values) => {
      const submittedData: any = {
        ...values,
        price: Number(values.price),
      };
      if (type !== 'simple' && !values.stats?.value) {
        setFieldError('stats', 'Must select an account');
        return;
      } else if (type !== 'simple') {
        const link = socialMediaLinks?.find(
          (link) => link._id === submittedData?.stats?.value,
        );
        submittedData.type = link?.type;
        submittedData.stats = {
          ...submittedData.stats,
          label: link?.name,
          url: link?.url || '',
          type: link?.type,
        };
      }
      if (cbonSubmit) {
        await cbonSubmit(submittedData);
      }
      cancelHanlder();
    },
  });
  const cancelHanlder = () => {
    setSocialValue(null);
    cbonCancel && cbonCancel();
    resetForm();
  };

  useEffect(() => {
    if (isModelOpen) {
      let link = socialValue || links[0];
      if (value.stats) {
        const isFound = links.find((l) => l.value === value.stats?.value);
        if (isFound) {
          link = isFound;
        }
      }
      if (value)
        setValues((v: any) => ({
          ...v,
          ...value,
          stats: link ? { label: link.label, value: link.value } : undefined,
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, socialMediaLinks, isModelOpen]);

  const createSocialLink = async (values: any) => {
    setShowPriceVariationModel(true);
    const res = await createSocialAccount(values).catch(() => {
      toast.error('Could not create link');
    });

    if (res.socialLink) {
      setSocialValue({
        label: (
          <SelectCustomItem
            icon={getAdvertisementVariationIcon(res.socialLink.type)}
            label={res.socialLink.name}
            type={res.socialLink.type}
          />
        ),
        value: res.socialLink._id,
      });
      dispatch(setSocialLinks([...socialMediaLinks, res.socialLink]));
    }
  };

  let newClass = 'newPricepromotion';
  if (type === 'advertise' && value?._id) {
    newClass = '';
  }

  return (
    <div className={className}>
      <Model
        title={
          <span className="title-holder">
            <span className="">
              <span className={`title-icon ${newClass}`}>
                {icon || <Dollar />}
              </span>
              <span className="title-text">
                {cardTitle || value?.title || 'Title'}
              </span>
            </span>
          </span>
        }
        isDisabled={Object.keys(errors || {})?.length > 0}
        onClose={cancelHanlder}
        onOk={handleSubmit}
        className={`price-variation-form ${className}`}
        showFooter={true}
        isOpen={showPriceVariationModel}
      >
        <div className="form">
          <div className="form-field">
            <div className="row-holder">
              <div className="col-75">
                <FocusInput
                  hasIcon={false}
                  icon="star1"
                  label={'Title*'}
                  inputClasses="mb-25"
                  id="title"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.title}
                  touched={touched.title}
                  value={values.title}
                  materialDesign
                />
              </div>
              <div className="col-25">
                <FocusInput
                  inputClasses="mb-25"
                  label={'Price*'}
                  hasIcon={true}
                  id="price"
                  name="price"
                  icon="dollar"
                  validations={[{ type: 'number' }]}
                  onChange={(e) => {
                    handleChange(e);
                    if (popType === ServiceType.CHAT_SUBSCRIPTION) {
                      setTimeout(() => {
                        if (
                          Number(e.target.value) > 0 &&
                          Number(e.target.value) < 5
                        ) {
                          setFieldError(
                            'price',
                            'Paid memberships must be at least $5',
                          );
                        }
                      }, 0);
                    }
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    if (popType === ServiceType.CHAT_SUBSCRIPTION) {
                      setTimeout(() => {
                        if (
                          Number(e.target.value) > 0 &&
                          Number(e.target.value) < 5
                        ) {
                          setFieldError(
                            'price',
                            'Paid memberships must be at least $5',
                          );
                        }
                      }, 0);
                    }
                  }}
                  error={errors.price}
                  touched={touched.price}
                  value={`${values.price}`}
                  materialDesign
                />
              </div>
            </div>
            <FocusInput
              label={'Description'}
              inputClasses="mb-5"
              id="description"
              name="description"
              type="textarea"
              rows={6}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.title}
              value={values.description}
              materialDesign
            />
            {popType === ServiceType.CHAT_SUBSCRIPTION && (
              <Checkbox
                className="make_it_required"
                name="allowBuyerToMessage"
                defaultChecked={values.allowBuyerToMessage || false}
                onChange={(e: any) =>
                  setFieldValue(e.target.name, e.target.checked)
                }
                label="Allow these members to send you messages"
                value={values.allowBuyerToMessage}
              />
            )}
            {popType === ServiceType.CHAT_SUBSCRIPTION && (
              <Checkbox
                className="make_it_required"
                name="allowContentAccess"
                defaultChecked={values.allowContentAccess || false}
                onChange={(e: any) =>
                  setFieldValue(e.target.name, e.target.checked)
                }
                label="Allow Content Access"
                value={values.allowContentAccess}
              />
            )}
            {type !== 'simple' && (
              <div className="mb-30 actions-area">
                <NewButton
                  outline
                  icon={icon}
                  onClick={() => {
                    setShowPriceVariationModel(false);
                    onOpen();
                  }}
                >
                  Add Connection
                </NewButton>
                {links?.length > 0 && (
                  <CustomSelect
                    options={links}
                    value={values.stats}
                    components={{
                      Menu: SelectCustomMenu,
                      Option: SelectCustomOption,
                    }}
                    isSearchable={false}
                    onChange={(v) => {
                      setFieldValue('stats', v);
                    }}
                    touched={true}
                    error={errors?.stats as string}
                  />
                )}
              </div>
            )}
          </div>
          {footer}
        </div>

        {showQuestions && (
          <CardSection
            className="sub-item"
            title="Related Questions"
            subtitle="Ask your customers the questions you need to complete the custom service you are offering them. "
            icon={<QuestionMark />}
          >
            <CustomQuestionsDragableListing
              value={values.questions || []}
              onChange={(value: any) => setFieldValue('questions', value)}
            />
          </CardSection>
        )}
      </Model>
      <CreateShoutoutSocialIconModel
        onSubmit={createSocialLink}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setShowPriceVariationModel(true);
        }}
      />
    </div>
  );
};
const CustomSelect = styled(Select)`
  .react-select__single-value {
    width: 90%;
  }
  .react-select__value-container {
    padding: 0.5rem 0;
  }
`;
export default styled(InlinePriceVariationFrom)`
  .actions-area {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;

    .button {
      width: 155px;
      min-width: 155px;
      margin: 0px 20px 0px 0px;
      padding-left: 15px;
      padding-right: 15px;
      text-align: center;
      color: rgb(0, 0, 0);
      border-color: rgb(0, 0, 0);
      border-width: 1px;
      height: 40px;

      @media (max-width: 767px) {
        width: 100%;
        margin: 0px 0px 15px;
      }

      svg {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translate(0px, -50%);
        margin: 0px;
      }
    }

    .default {
      flex-grow: 1;
      flex-basis: 0;
      margin: 0;

      @media (max-width: 767px) {
        flex: inherit;
      }
    }
  }

  .modal-header {
    border: none;
    padding-bottom: 12px;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .title-icon {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;
      color: #000;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;

        path {
          color: #000;
        }
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: #495057;
  }
`;
