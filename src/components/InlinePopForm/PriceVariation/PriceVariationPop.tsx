import {
  addPriceVariation,
  delPriceVariation,
  updateVariation,
} from 'api/ChatSubscriptions';
import { sortPopArribute, updatePopData } from 'api/Pop';
import { Dollar } from 'assets/svgs';
import NewButton from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { addPop, addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import { addPopToState, parseQuery } from 'util/index';
import VariationDragableListing from '../VariationDragableListing';

const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    // position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};

type ActionTypes = {
  status?: boolean;
  delete?: boolean;
  close?: boolean;
  toggel?: boolean;
  edit?: boolean;
  view?: boolean;
};
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  options?: ActionTypes;
  questionActions?: ActionTypes;
  buttonTitle?: string;
  defaultMessage?: string;
  showFooterDisabled?: boolean;
  buttonPosition?: 'top' | 'bottom';
  showHeader?: boolean;
  showCheck?: boolean;
  onChange?: Function;
}

const PriceVariationPop = ({
  className,
  buttonTitle = '',
  defaultMessage = '',
  showHeader = true,
  showFooterDisabled = true,
  buttonPosition = 'top',
}: Props) => {
  const { pathname } = useLocation();
  const qs = useQuery();
  const { id } = useParams<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser, user } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const previewPop = useAppSelector((state) => state.popslice?.previewPop);
  const st = parseQuery(history.location?.search);
  const { step } = st;
  const { popLinksId } = previewPop;
  const form = useFormik({
    initialValues: {
      priceVariations: [],
    },
    validateOnChange: true,
    onSubmit: async () => {
      setIsLoading(true);
      if (popLinksId?._id) {
        await onSavePop({
          _id: popLinksId?._id,
          defaultMessage: defaultMessage,
        });
        onCancel(qs, pathname);
        setIsLoading(false);
      }
    },
  });
  const onSavePop = async (requestData: any) => {
    delete requestData.owner;
    try {
      const res: any = await updatePopData(requestData, requestData._id);
      let updated;
      const newLinks = (user?.links || []).map((item: any) => {
        if (item?.popLinksId?._id === res._id) {
          updated = { ...item, isActive: res.isActive, popLinksId: res };
          return { ...item, isActive: res.isActive, popLinksId: res };
        }
        return item;
      });
      setUser({
        ...user,
        links: newLinks,
        timeOffset: requestData.timeZone,
      });
      dispatch(addPreviewPop({ ...(updated || {}), addPop: true }));
      return res;
    } catch (e: any) {
      console.log({ msg: e.message });
    }
  };
  const { values, setValues, handleSubmit, setFieldValue } = form;
  useEffect(() => {
    if (popLinksId && !!step) {
      setValues((v: any) => {
        return {
          ...v,
          priceVariations: popLinksId?.priceVariations,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popLinksId?.priceVariations, step]);

  useEffect(() => {
    addPopToState(id, user, dispatch, previewPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { priceVariations = [] } = values;
  const onCancel = (qs: Record<string, any>, pathname: string) => {
    const { mode } = qs;
    if (mode === 'add') {
      const { step, ...rest } = qs;
      if (step === '1') {
        history.replace(`/my-profile/link?${stringify({ ...rest })}`);
      }
    }
    if (mode === 'edit') {
      const { step, ...rest } = qs;
      if (step === '1') {
        history.replace(
          `/my-profile/link/${pathname.split('/')[3]}?${stringify({
            ...rest,
          })}`,
        );
      }
    }
  };
  const onChangeHandlerandSave = async (
    value: any,
    variant?: any,
    action?: string,
  ) => {
    const val = value;
    let promise;
    if (popLinksId?._id) {
      setIsLoading(true);
      if (action === 'delete' && variant?._id) {
        promise = delPriceVariation(popLinksId?._id || '', {
          name: 'priceVariations',
          id: variant?._id,
        });
      } else if (action === 'update' && variant?._id) {
        promise = updateVariation(popLinksId?._id || '', {
          value: variant,
        });
      } else if (action === 'add') {
        promise = addPriceVariation(popLinksId?._id || '', {
          name: 'priceVariations',
          value: { ...variant, sort: priceVariations?.length },
        });
      } else if (action === 'sort') {
        setFieldValue('priceVariations', val);
        sortPopArribute({
          popId: popLinksId._id,
          values: val?.map((v: any) => v._id),
          attributeName: 'priceVariations',
        })
          .then(() => {
            let updated;
            const newLinks = user?.links?.map((item: any) => {
              if (item?.popLinksId?._id === popLinksId._id) {
                updated = {
                  ...item,
                  popLinksId: {
                    ...(previewPop?.popLinksId || {}),
                    ...values,
                    priceVariations: val,
                  },
                };
                return updated;
              }
              return item;
            });
            setUser({
              ...user,
              links: newLinks,
            });
            dispatch(addPop({ ...(updated || {}), addPop: true }));
            setIsLoading(false);
          })
          .catch(() => {
            dispatch(
              addPreviewPop({
                ...{
                  ...previewPop,
                  popLinksId: {
                    ...(previewPop?.popLinksId || {}),
                    priceVariations: popLinksId.priceVariations,
                  },
                },
                addPop: true,
              }),
            );
            setFieldValue('priceVariations', popLinksId.priceVariations || []);
            setIsLoading(false);
          });

        return;
      }
      promise
        ?.then((res) => {
          let updated = val;
          if (action === 'add') {
            updated = res.data;
            setFieldValue('priceVariations', res.data);
          }
          if (action === 'delete') {
            updated = res.data;
            setFieldValue('priceVariations', res.data);
          }
          const newLinks = user?.links?.map((item: any) => {
            if (item?.popLinksId?._id === popLinksId?._id) {
              return {
                ...item,
                isActive: popLinksId?.isActive,
                popLinksId: {
                  ...popLinksId,
                  priceVariations: updated,
                },
              };
            }
            return item;
          });
          setUser({
            ...user,
            links: newLinks,
            timeOffset: popLinksId?.timeZone,
          });

          dispatch(
            addPreviewPop({
              ...previewPop,
              popLinksId: {
                ...(previewPop?.popLinksId || {}),
                ...values,
                priceVariations: updated,
              },
            }),
          );
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setFieldValue('priceVariations', [...val, variant]);
          setIsLoading(false);
        });
    } else {
      dispatch(
        addPreviewPop({
          ...previewPop,
          popLinksId: {
            ...(previewPop?.popLinksId || {}),
            ...values,
            priceVariations: val,
          },
        }),
      );
      setFieldValue('priceVariations', val);
    }
  };
  const isChatSub = st.subType === ServiceType.CHAT_SUBSCRIPTION;
  const getComponents = () => {
    const { step } = st;
    if (step === '1') {
      return (
        <AnimatePresence initial={false}>
          <motion.div
            key="left"
            custom={'left'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            <Card className="pop-card-alt">
              {showHeader && (
                <Card.Header className="card-header-box">
                  <div className="header-image">
                    <Dollar />
                  </div>
                  <div className="header-text">
                    <strong className="header-title">
                      {isChatSub ? 'Membership Types' : 'Price Variation'}
                    </strong>
                    <p>
                      {isChatSub ? 'Membership Types' : 'Price variants'} are an
                      advanced option that allow you to charge different amounts
                      depending on what you are providing to your fan.
                    </p>
                  </div>
                </Card.Header>
              )}
              <div className="price--variation">
                <VariationDragableListing
                  sortKey={'sort'}
                  buttonPosition={buttonPosition || 'top'}
                  options={{
                    edit: true,
                    toggel: true,
                    delete: isChatSub,
                  }}
                  cardTitle={isChatSub ? 'Add Membership Type' : ''}
                  addVariationbtnTitle={buttonTitle || 'New Price Variation'}
                  value={
                    priceVariations?.map((variant: PriceVariant | any) => {
                      const obj = { ...variant };
                      if ((obj?.isDefault || obj?.isArchive) && isChatSub) {
                        obj.allowDelete = false;
                      } else {
                        obj.allowDelete =
                          isChatSub && !obj?.isArchive ? true : false;
                      }
                      return obj;
                    }) || []
                  }
                  onChange={(value: any, variant?: any, action?: string) =>
                    onChangeHandlerandSave(value, variant, action)
                  }
                  type="simple"
                  popType={st.subType as string}
                />
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      );
    }
  };

  return (
    <div className={className}>
      {getComponents()}

      <footer className="footer-card">
        <div className="footer-links">
          <NewButton
            type="default"
            size="large"
            onClick={() => onCancel(qs, pathname)}
            shape="circle"
          >
            Cancel
          </NewButton>
          <NewButton
            htmlType="submit"
            type="primary"
            size="large"
            shape="circle"
            disabled={showFooterDisabled || isLoading}
            isLoading={isLoading}
            onClick={() => handleSubmit()}
          >
            Save
          </NewButton>
        </div>
      </footer>
    </div>
  );
};

export default styled(PriceVariationPop)`
  overflow: hidden;
  .personal-info {
    padding: 20px;
    @media (max-width: 479px) {
      padding: 20px 15px;
    }
    .react-datepicker__current-month {
      color: var(--pallete-primary-main);
    }
    .react-datepicker__day {
      &.react-datepicker__day--selected,
      &.react-datepicker__day--keyboard-selected,
      &:hover {
        background: var(--pallete-primary-main);
      }
      &:before {
        border-color: var(--pallete-primary-main);
      }
    }
  }
  .heading-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main);
    font-weight: 400;
    .img {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-darker);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      overflow: hidden;
    }
    .description {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 10px;
    }
    .description-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 3px;
    }
  }
  .footer-links {
    padding: 20px;
    text-align: center;
    border-top: 1px solid var(--pallete-colors-border);
  }
  ul.sortable {
    margin-top: 20px;
    .card--price {
      white-space: nowrap;
    }
    .card--text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }
    .card--title {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .price-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    .text-input {
      width: 141px;
      margin: 0 10px 10px 0 !important;
    }
    .price-info {
      font-size: 13px;
      line-height: 15px;
      color: var(--pallete-text-main-100);
      font-weight: 500;
      margin: 0 0 10px;
    }
  }
  .price-description {
    color: #959a9f;
    font-size: 13px;
    line-height: 15px;
    strong {
      color: var(--pallete-text-main);
    }
  }
  .card-header-box {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2857;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 25px;
    .header-image {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-main);
      color: #e5e5e5;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-title {
      color: var(--pallete-text-main);
      font-size: 15px;
    }
    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 12px;
    }
    p {
      margin: 0;
    }
  }
  .dashedLine {
    margin: 0 -20px;
    border: none;
    height: 1px;
    background: #e6ecf5;
  }
`;
