import { createPop, updatePopData } from 'api/Pop';
import { ImagesScreenSizes } from 'appconstants';
import { LeafIcon, UploadBold } from 'assets/svgs';
import FileContainer from 'components/FileContainer';
import NewButton from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import { addPopToState, parseQuery } from 'util/index';
import AdditionalArt from '../AdditionalArt';

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

const DigitalFileDownloadPop = ({ className }: Props) => {
  const { pathname } = useLocation();
  const qs = useQuery();
  const { section = '', id } = useParams<any>();
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
      digitalDownloads: [],
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      if (popLinksId?._id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, digitalDownloads = [], ...rest } = popLinksId;
        const items = [...values?.digitalDownloads];
        await onSavePop({
          ...rest,
          digitalDownloads: [...items],
        });
        onCancel(qs, pathname);
        setIsLoading(false);
      } else {
        await addNewPop({ digitalDownloads: values?.digitalDownloads });
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
          digitalDownloads: popLinksId?.digitalDownloads,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popLinksId, step]);

  useEffect(() => {
    addPopToState(id, user, dispatch, previewPop);
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
          digitalDownloads: response.pop.popLinksId.digitalDownloads,
        }));
        const newArray = [...(user?.links || []), response.pop];
        // dispatch(addPop({ ...response.pop, addPop: true }));
        dispatch(addPreviewPop({ ...response.pop }));
        setUser({ ...user, links: newArray, timeOffset: values.timeZone });
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

  const { digitalDownloads = [] } = values;
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
  const pushIntoValueArray = async (name: keyof typeof values, value: any) => {
    setValues((v: any) => {
      const oldarray: any = v[name];
      const newArray = [...oldarray, value];
      return { ...v, [name]: newArray };
    });
  };

  const updateNestedArrayElement = async (
    name: keyof typeof values,
    id: string,
    value: any,
  ) => {
    setValues((vls) => {
      const oldarray: any = [...vls[name]];
      const indexof: any = oldarray.findIndex((el: any) => el.id === id);
      if (indexof === -1) return vls;
      oldarray[indexof] = { ...oldarray[indexof], ...value };
      return { ...vls, [name]: oldarray };
    });
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
              <Card.Header className="card-header-box">
                <div className="header-image">
                  <LeafIcon />
                </div>
                <div className="header-text">
                  <strong className="header-title">Digital Downloads</strong>
                  <p>Add the files you’re providing for this service.</p>
                </div>
              </Card.Header>
              <AdditionalArt
                value={
                  digitalDownloads?.map((l: any) => {
                    return {
                      ...l,
                    };
                  }) as any
                }
                imgSettings={{
                  onlyMobile: true,
                }}
                showLoading={true}
                options={{ delete: true, view: false, toggel: true }}
                onChange={onChangeHander.bind(undefined, 'digitalDownloads')}
              />

              <FileContainer
                // accept={['image/*', 'video/*']}
                accept={{ 'image/*': [], 'video/*': [] }}
                imageSizes={ImagesScreenSizes.promotionalMedia}
                onStartUploading={(file) => {
                  pushIntoValueArray('digitalDownloads', {
                    showProgressBar: true,
                    isActive: true,
                    ...file,
                  });
                }}
                onProgress={(file) => {
                  updateNestedArrayElement('digitalDownloads', file.id, {
                    showProgressBar: true,
                    ...file,
                  });
                }}
                onSuccess={(file) => {
                  updateNestedArrayElement('digitalDownloads', file.id, {
                    showProgressBar: false,
                    path: file.url,
                    ...file,
                  });
                }}
                onFail={(file) => {
                  updateNestedArrayElement('digitalDownloads', file.id, {
                    failed: true,
                    ...file,
                  });
                }}
                customrequest={false}
                validation={{ maxSize: 100 * 1024 * 1024 }} //100MB
                url={'/image/upload'}
                cropper={false}
                UploadButton={
                  <NewButton type="primary" block>
                    <span className="custom-icon">
                      <UploadBold />
                    </span>
                    Add a Digital Download File
                  </NewButton>
                }
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

export default styled(DigitalFileDownloadPop)`
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
