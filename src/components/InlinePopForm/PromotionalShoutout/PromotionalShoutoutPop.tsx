import { createPop, updatePopData } from 'api/Pop';
import { getSocialAccounts } from 'api/social-accounts';
import NewButton from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { setSocialLinks } from 'store/reducer/global';
import { addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import { addPopToState, parseQuery } from 'util/index';
import AdvertiseComponent from '../Advertise';

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

  onChange?: Function;
}

const PromotionalShoutoutPop = ({ className }: Props) => {
  const { pathname } = useLocation();

  const qs = useQuery();
  const { section = '', id } = useParams<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser, user } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const previewPop = useAppSelector((state) => state.popslice?.previewPop);

  const socialLinks = useAppSelector((state) => state?.global?.socialLinks);

  const st = parseQuery(history.location?.search);
  const { step, subType } = st;
  const { popLinksId } = previewPop;

  const form = useFormik({
    initialValues: {
      isActive: false,
      socialMediaSorting: [],
      priceVariations: [],
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      if (popLinksId?._id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, ...rest } = popLinksId;
        const items = { ...values };
        await onSavePop({
          ...rest,
          ...items,
        });
        onCancel(qs, pathname);
        setIsLoading(false);
      } else {
        await addNewPop({ ...values });
        setIsLoading(false);
      }
    },
  });
  const { values, setValues, handleSubmit, setFieldValue } = form;
  useEffect(() => {
    if (popLinksId && !!step) {
      setValues((v: any) => {
        return {
          ...v,
          isActive: popLinksId?.isActive,
          socialMediaSorting: popLinksId?.socialMediaSorting,
          priceVariations: popLinksId?.priceVariations,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popLinksId, step]);

  useEffect(() => {
    addPopToState(id, user, dispatch, previewPop);
    if (subType === ServiceType.ADVERTISE) {
      getSocialAccounts().then((res) => {
        dispatch(setSocialLinks(res?.socialMedia || []));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSavePop = async (requestData: any) => {
    delete requestData.owner;
    try {
      const res: any = await updatePopData(requestData, requestData._id);
      let updated;
      const newLinks = user?.links?.map((item: any) => {
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
      dispatch(addPreviewPop({ ...(updated || {}) }));
      return res;
    } catch (e: any) {
      console.log({ msg: e.message });
    }
  };
  const addNewPop = useCallback(
    async (values: any) => {
      try {
        const response = await createPop({
          title: '',
          popType: section,
          price: 5,
          description: '',
          popLiveAdditionalPrice: 0,
          popLiveAdditionalTime: 0,
          isThumbnailActive: true,
          popThumbnail: undefined,
          timeZone: user.timeOffset,
          ...values,
          isActive: true,
        });
        setValues((vals) => ({
          ...vals,
          additionalArt: response.pop.popLinksId.additionalArt,
        }));
        const newArray = [...(user?.links || []), response.pop];
        dispatch(addPreviewPop({ ...response.pop }));
        setUser({
          ...user,
          links: newArray,
          timeOffset: values.timeZone,
        });
        return response;
      } catch (e: any) {
        if (e.message) {
          toast.error(e.message);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser, user],
  );

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

  const onChangeHandlerandSave = (name: string, value: any) => {
    const key = name;
    let isActivePop = values.isActive;
    if (popLinksId?.popType === ServiceType.ADVERTISE) {
      if (Array.isArray(value) && popLinksId?.isActive) {
        isActivePop = !!value.find((v) => v.isActive);
        setFieldValue('isActive', isActivePop);
      } else if (name === 'isActive') {
        const priceV = values.priceVariations;
        const isAllowToactivate = !!priceV?.find((p: any) => p.isActive);
        if (!isAllowToactivate) {
          toast.info('Please activate atleast 1 variation');
          return;
        }
        isActivePop = value;
      }
    }
    onSavePop({
      ...(previewPop?.popLinksId || {}),
      ...values,
      [key]: value,
    });

    setFieldValue(name, value);
  };
  const onChangeHander = (name: string, value: any) => {
    setFieldValue(name, value);
    dispatch(
      addPreviewPop({
        ...previewPop,
        popLinksId: {
          ...(previewPop?.popLinksId || {}),
          [name]: value,
        },
      }),
    );
  };
  const getComponents = () => {
    const { step } = st;
    if (step === '1') {
      const { popLinksId } = previewPop;
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
              <AdvertiseComponent
                onChange={(name: string, value: any) => {
                  onChangeHandlerandSave(name, value);
                }}
                socialMediaLinks={socialLinks}
                priceVariations={popLinksId?.priceVariations || []}
                setField={onChangeHander}
                socialMediaSorting={popLinksId?.socialMediaSorting}
              />
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
            disabled={isLoading}
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

export default styled(PromotionalShoutoutPop)`
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
