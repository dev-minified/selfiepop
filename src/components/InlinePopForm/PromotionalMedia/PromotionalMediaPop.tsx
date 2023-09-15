import { createPop, updatePopData } from 'api/Pop';
import { ImagesScreenSizes } from 'appconstants';
import { LeafIcon, PlusFilled } from 'assets/svgs';
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
import { parseQuery } from 'util/index';
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

const NFTPop = ({ className }: Props) => {
  const { pathname } = useLocation();
  const qs = useQuery();
  const { section = '' } = useParams<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setisDisabled] = useState<boolean>(false);
  const { setUser, user } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const previewPop = useAppSelector((state) => state.popslice?.previewPop);
  const st = parseQuery(history.location?.search);
  const { step } = st;
  const { popLinksId } = previewPop;

  const form = useFormik({
    initialValues: {
      additionalArt: popLinksId?.additionalArt || [],
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      if (popLinksId?._id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, additionalArt = [], ...rest } = popLinksId;
        const items = [...values?.additionalArt.filter((f: any) => !f.failed)];
        await onSavePop({
          ...rest,
          additionalArt: [...items],
        });
        onCancel(qs, pathname);
        setIsLoading(false);
      } else {
        await addNewPop({ additionalArt: values?.additionalArt });
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
          additionalArt: popLinksId?.additionalArt,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popLinksId?._id]);
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
    async (values: Record<string, any>) => {
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

  // const { status: showStatus, close: showClose, delete: showDelete } = options;
  const { additionalArt = [] } = values;

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
    setisDisabled(true);
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
      if (value.failed) {
        oldarray.splice(indexof, 1);
      } else {
        oldarray[indexof] = { ...oldarray[indexof], ...value };
      }
      return { ...vls, [name]: oldarray };
    });
  };

  const additionalArtOnSuccess = useCallback(
    (file: any) => {
      setValues((vls) => {
        const oldarray: any = [...(vls?.additionalArt || [])];
        const indexof: any = oldarray.findIndex((el: any) => el.id === file.id);
        if (indexof === -1) return vls;
        oldarray[indexof] = {
          ...oldarray[indexof],
          ...{
            artName: file.name,
            artPath: file.url,
            artType: file.type,
            showProgressBar: false,
            isActive: true,
            ...file,
          },
        };
        if (file.url && file.status === 'completed') {
          onChangeHandlerandSave(
            'additionalArt',
            oldarray.filter((f: any) => f?.status === 'completed' && !f.failed),
          );
        }
        const newState = { ...vls, ['additionalArt']: oldarray };
        return newState;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values?.additionalArt, popLinksId],
  );
  const onChangeHandlerandSave = async (name: string, value: any) => {
    const key = name;
    setIsLoading(true);
    dispatch(
      addPreviewPop({
        ...previewPop,
        popLinksId: {
          ...(previewPop?.popLinksId || {}),
          ...values,
          [key]: value,
        },
      }),
    );
    // setFieldValue(name, value);
    await onSavePop({
      ...previewPop?.popLinksId,
      ...values,
      [key]: value,
    });
    setIsLoading(false);
    setisDisabled(false);
  };
  const onChangeHandlerandSaveForArt = async (name: string, value: any) => {
    onChangeHandlerandSave(name, value);
    setFieldValue(name, value);
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
                  <strong className="header-title">Promotional Media</strong>
                  <p>
                    Upload images or videos to share more about your service.
                    Drag and drop the list items to sort the order they will be
                    displayed.
                  </p>
                </div>
              </Card.Header>
              <FileContainer
                imageSizes={ImagesScreenSizes.promotionalMedia}
                // accept={['image/*', 'video/*']}
                accept={{ 'image/*': [], 'video/*': [] }}
                onStartUploading={(file) => {
                  pushIntoValueArray('additionalArt', {
                    artName: file.name,
                    artPath: file.url,
                    artType: file.type,
                    showProgressBar: true,
                    isActive: true,
                    ...file,
                  });
                }}
                onProgress={(file) => {
                  updateNestedArrayElement('additionalArt', file.id, {
                    artName: file.name,
                    artPath: file.url,
                    artType: file.type,
                    showProgressBar: true,
                    ...file,
                  });
                }}
                // onSuccess={additionalArtOnSuccess}
                onFail={(file) => {
                  updateNestedArrayElement('additionalArt', file.id, {
                    failed: true,
                    ...file,
                  });
                }}
                onSuccess={(file) => {
                  additionalArtOnSuccess({
                    ...file,
                    status: 'completed',
                  });
                }}
                url={'/image/upload'}
                customrequest={false}
                UploadButton={
                  <div>
                    <NewButton
                      type="primary"
                      icon={<PlusFilled />}
                      block
                      className="mb-20"
                    >
                      <span className="pl-10">Add Promotional Media</span>
                    </NewButton>
                  </div>
                }
              />
              <div className="addition__art">
                <AdditionalArt
                  imgSettings={{
                    onlyDesktop: true,
                  }}
                  value={
                    additionalArt?.map((l: any) => {
                      return {
                        ...l,
                        // tag: `${
                        //   l.size ? ((l.size as any) / (1024 * 1024)).toFixed(2) : 0
                        // }MB`,
                      };
                    }) as any
                  }
                  showLoading={true}
                  onChange={onChangeHandlerandSaveForArt.bind(
                    undefined,
                    'additionalArt',
                  )}
                  binding={{
                    name: 'artName',
                    path: 'artPath',
                    type: 'artType',
                  }}
                />
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      );
    }

    // return <></>;
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
            disabled={isDisabled}
            onClick={() => handleSubmit()}
            // isLoading={Loading}
          >
            Save
          </NewButton>
        </div>
      </footer>
    </div>
  );
};

export default styled(NFTPop)`
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
