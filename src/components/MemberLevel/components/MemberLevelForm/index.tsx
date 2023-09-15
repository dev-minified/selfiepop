import { addPriceVariation, updateVariation } from 'api/ChatSubscriptions';
import { ImagesScreenSizes } from 'appconstants';
import attrAccept from 'attr-accept';
import NewButton from 'components/NButton';
import FocusInput from 'components/focus-input';
import Switchbox from 'components/switchbox';

import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import PaidMessageInput from 'pages/chat/components/PaidMessageInput';
import { stringify } from 'querystring';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import swal from 'sweetalert';
import {
  getFilemetaData,
  getImageURL,
  getUrlParts,
  parseQuery,
  processFilesForRotation,
} from 'util/index';
import * as yup from 'yup';

import { updateImagesPhysically } from 'api/sales';
import { ImageThumbnail, PlusFilled } from 'assets/svgs';
import LibraryModal from 'components/LibraryView';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import MessageInput from 'pages/chat/components/MessageInput';
import {
  removeMessageFiles,
  setMessage,
  setMessageFiles,
  setPrice,
} from 'store/reducer/chat';
import ViewMessage from './components/view-message';
interface Props {
  className?: string;
  variants: PriceVariant[];
  // levelValidationInfo?: Function;
  popLinksId?: any;
  setPriceVariation?: Function;
  managedAccountId?: string;
}

const MemberLevelForm = ({
  className,
  popLinksId,

  variants,
  setPriceVariation,
  managedAccountId,
}: Props) => {
  const history = useHistory();
  const location = useLocation();
  const st = parseQuery(history.location?.search);
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();
  const [showMesssageBar, setShowMesssageBar] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<
    'chat' | 'thumbs' | null
  >(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const messageFiles = useAppSelector((state) => state.chat.messageFiles);
  const [lastVariant, setLastVariant] = useState<PriceVariant>();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const { variantId } = st;
  const { user, setUser } = useAuth();
  const validationSchema = yup.object().shape({
    title: yup.string().max(255).required('Title is required'),
    price: variantId
      ? yup.number().required('Price is required!')
      : yup
          .number()
          .test(
            'test less than',
            `Paid memberships must be at least ${lastVariant?.price as number}`,
            (value: any) => {
              if (lastVariant) {
                return value >= (lastVariant?.price as number);
              } else {
                return true;
              }
            },
          )
          .required(
            `Paid memberships must be at least ${lastVariant?.price as number}`,
          ),
    description: yup.string().max(500),
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    errors,
    touched,
    isSubmitting,
    setFieldError,
  } = useFormik<any>({
    validationSchema,
    initialValues: {
      title: '',
      price: (lastVariant?.price as number) || 0,
      description: '',
      defaultMessage: null,
      isActive: true,
      stats: undefined,
      allowBuyerToMessage: true,
      allowContentAccess: true,
      allowUpsaleOffer: false,
    },
    onSubmit: async (values) => {
      let promise;
      if (values?._id) {
        if (typeof values?.defaultMessage === 'string') {
          values.defaultMessage = {
            message: values.defaultMessage,
          };
        }
        promise = updateVariation(
          popLinksId?._id || '',
          {
            value: { ...values, sellerId: managedAccountId },
          },
          { sellerId: managedAccountId },
        );
      } else {
        if (!values?.defaultMessage) {
          values.defaultMessage = {};
        }
        delete values?.defaultMessage?.createdAt;
        promise = addPriceVariation(popLinksId?._id || '', {
          name: 'priceVariations',
          value: { ...values, sort: variants?.length },
          sellerId: managedAccountId,
        });
      }
      await promise.then((res) => {
        const updated = res.data;
        let arr: any = [];
        if (res?.message?.split(' ')?.[0] === 'updated') {
          arr = [...variants];
          const variantIndex: number = variants?.findIndex(
            (v) => v._id === values?._id,
          );
          if (variantIndex > -1) {
            arr[variantIndex] = values;
            setPriceVariation?.(arr);
          }
        } else {
          setPriceVariation?.(updated);
        }
        const newLinks = user?.links?.map((item: any) => {
          if (item?.popLinksId?._id === popLinksId?._id) {
            return {
              ...item,
              isActive: popLinksId?.isActive,
              popLinksId: {
                ...popLinksId,
                priceVariations:
                  res?.message?.split(' ')?.[0] === 'updated' ? arr : updated,
              },
            };
          }
          return item;
        });
        setUser({
          ...user,
          links: newLinks,
        });
        onCancel();
      });
    },
  });

  const levelValidationInfo = (value: any) => {
    if (variantId) {
      const indx = variants?.findIndex(
        (f: PriceVariant) => f?._id === variantId,
      );
      const previousVariation = variants?.[indx - 1];
      const nextVariation = variants?.[indx + 1];
      let msg = '';
      if (
        previousVariation &&
        nextVariation &&
        (value < (previousVariation?.price as number) ||
          value > (nextVariation?.price as number))
      ) {
        msg = `Price must be between $${previousVariation?.price} to $${nextVariation?.price}`;
        setFieldError('price', msg);
      } else if (
        previousVariation &&
        value < (previousVariation?.price as number)
      ) {
        msg = `Price must be greater than $${previousVariation?.price}`;
        setFieldError('price', msg);
      } else if (nextVariation && value > (nextVariation?.price as number)) {
        msg = `Price must be less than $${nextVariation?.price}`;
        setFieldError('price', msg);
      }
    }
  };
  useEffect(() => {
    if (variantId && !!variants?.length) {
      const vart: any = variants?.find((v) => v._id === variantId);
      setValues(vart);
      if (vart?.defaultMessage) {
        setShowMesssageBar(false);
      } else {
        setShowMesssageBar(true);
      }
    }
    if (!!variants?.length) {
      setLastVariant(variants?.[variants.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantId, variants]);

  const onCancel = () => {
    const searchLocation = parseQuery(location?.search);
    const query: any = {
      ...searchLocation,
    };
    delete query?.levelStep;
    delete query?.variantId;
    history.push({
      pathname: location?.pathname,
      search: stringify(query),
    });
  };
  const handleSendMessage = async (message: string) => {
    setFieldValue('defaultMessage', {
      message: message,
    });
    setShowMesssageBar(false);
  };
  const onComplete = useCallback(
    async (
      uploadedFiles: Record<string, any>,
      message: string,
      price: number,
    ) => {
      const files = [];

      let newImage = '';
      for (let j = 0; j < (uploadedFiles?.files || []).length; j++) {
        let f = uploadedFiles.files[j];

        const isVideo = attrAccept({ type: f.type }, 'video/*');
        const isAudio = attrAccept({ type: f.type }, 'audio/*');
        const isImage = attrAccept({ type: f.type }, 'image/*');
        newImage = !!newImage.length
          ? newImage
          : isImage
          ? f.path
            ? f.path
            : f.url
          : '';
        f = await getFilemetaData(f);

        const id =
          f._id ||
          f.id ||
          getUrlParts(f.path ? f.path : f.url)
            ?.pathname?.split('_')
            ?.pop()
            ?.split('.')?.[0];
        const file: any = {
          id: id,
          _id: id,
          type: isVideo
            ? 'video/mp4'
            : !isAudio
            ? `image/${(f.path ? f.path : f.url)?.split('.')?.pop()}`
            : f.type,
          path: f.path ? f.path : f.url,
          thumbnail: f.thumbnail,
          isPaidType: isPaid,
          name: f.name,
          videoDuration: f.timeDuration,
          duration: f.duration,
          blurThumbnail: f?.blurThumbnail,
          size: f.size,
          width: f.width,
          height: f.height,
        };
        if (f.rotate !== undefined && f._id) {
          const isRotateable = (((f.rotate || 0) % 360) + 360) % 360 !== 0;
          if (isRotateable) {
            file.rotate = f.rotate;
          }
        }
        files.push(file);
      }

      const promises: any = [];
      const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
        files,
        ImagesScreenSizes.chat,
      );
      const imageUrl = filesWithoutRotation.find(
        (f) => f?.blurThumbnail,
      )?.blurThumbnail;
      const blurImageUrl = imageUrl
        ? imageUrl
        : !!newImage.length
        ? newImage
        : '';
      let blurThumnail: string | undefined = undefined;
      if (filesWithoutRotation?.[0]?.isPaidType && !imageUrl) {
        blurThumnail = getImageURL({
          url: blurImageUrl,
          settings: {
            bdesktop: true,
            transform: false,
          },
        })?.url;

        updateImagesPhysically({
          url: blurImageUrl,
          name: blurThumnail?.split('/').pop(),
        });
      }
      newFiles?.forEach((f: any) => {
        promises.push(
          updateImagesPhysically({
            url: f.oldUrl,
            name: f.path.split('/').pop() || f.name,
          }),
        );
      });
      await Promise.all([...promises]).then(() => {
        setFieldValue('defaultMessage', {
          price: price,
          message: message,
          blurThumnail: filesWithoutRotation.find((f) => f.blurThumbnail)
            ?.blurThumbnail,
          library: filesWithoutRotation,
        });
        dispatch(setMessage(''));
        dispatch(setPrice(5));
        dispatch(removeMessageFiles());
        setShowMesssageBar(false);
        setisLoading(false);
      });
    },
    [isPaid],
  );

  const onSubmitHandler = useCallback(
    (props: any) => {
      if (!!props) {
        const libraryMedia = { ...(props || {}) };
        const defaultMsg = { ...(values.defaultMessage || {}) };
        let msgMedia = [...(defaultMsg.library || [])];
        msgMedia?.forEach((ele) => {
          if (!!libraryMedia[ele?._id]) {
            delete libraryMedia[ele?._id];
          }
        });
        const newMediaItems = Object.values(libraryMedia || {});
        msgMedia = [...msgMedia, ...newMediaItems];
        dispatch(setMessageFiles(msgMedia));
        setFieldValue('defaultMessage', {
          library: msgMedia,
        });
        setSelectedOptions('chat');
      }
      onNewListCloseModel();
      return;
    },
    [values.defaultMessage],
  );
  const onCancelHandler = useCallback(() => {
    onNewListCloseModel();
    return;
  }, []);

  return (
    <div className={className}>
      <div className="form">
        <div className="form-field">
          <div className="row-holder">
            <div className="col-75">
              <FocusInput
                hasIcon={false}
                label={'Subscription Title'}
                inputClasses="mb-25 mb-md-40"
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
                inputClasses="mb-25 mb-md-40"
                label={'Price'}
                hasIcon={true}
                id="price"
                name="price"
                icon="dollar"
                validations={[{ type: 'number' }]}
                onChange={(e) => {
                  handleChange(e);
                  setTimeout(() => {
                    levelValidationInfo(Number(e.target.value));
                  }, 0);
                }}
                onBlur={handleBlur}
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
            rows={3}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            value={values.description}
            materialDesign
          />
          {!showMesssageBar ? (
            typeof values.defaultMessage === 'string' ? (
              <ViewMessage
                messages={values.defaultMessage}
                images={
                  values.defaultMessage?.library
                    ? values.defaultMessage?.library
                    : []
                }
                onEditCb={() => {
                  dispatch(setMessage(values.defaultMessage));
                  setSelectedOptions(null);
                  setShowMesssageBar(true);
                }}
              />
            ) : (
              <ViewMessage
                messages={values.defaultMessage.message}
                images={
                  values.defaultMessage?.library
                    ? values.defaultMessage?.library
                    : []
                }
                onEditCb={() => {
                  setShowMesssageBar(true);
                  if (!!values?.defaultMessage?.library?.length) {
                    dispatch(setMessage(values.defaultMessage.message));
                    dispatch(setMessageFiles(values.defaultMessage.library));
                    setSelectedOptions('chat');
                    const lib = [...(values?.defaultMessage?.library || [])];
                    const isPaid = lib.find((f) => f.isPaidType)?.isPaidType;
                    if (values?.defaultMessage?.blurThumnail && isPaid) {
                      dispatch(setPrice(values.defaultMessage.price));
                      setIsPaid(true);
                      return;
                    }
                    setIsPaid(false);
                    return;
                  }
                  dispatch(setMessage(values.defaultMessage.message));
                  setIsPaid(false);
                  setSelectedOptions(null);
                }}
              />
            )
          ) : (
            <Fragment>
              {selectedOptions === 'chat' && (
                <PaidMessageInput
                  onChangeView={(view) => {
                    if (view === 'standard') {
                      setIsPaid(false);
                      return;
                    }
                    setIsPaid(true);
                  }}
                  files={values?.defaultMessage?.library || []}
                  isSending={isLoading}
                  onComplete={(
                    uploadedFiles: Record<string, any>,
                    message: string,
                    price: number,
                  ) => {
                    onComplete(uploadedFiles, message, price);
                  }}
                  customButton={
                    <>
                      {!!messageFiles?.length && (
                        <div
                          className="upload_placeholder"
                          onClick={onNewListOpenModel}
                        >
                          <PlusFilled />
                        </div>
                      )}
                    </>
                  }
                  hasPaid={true}
                  defaultType={isPaid ? 'pay-to-view' : 'standard'}
                  onSubmit={() => {
                    setisLoading(true);
                  }}
                  onFileChange={(libraryObjectFiles) => {
                    const newMedia = [...(libraryObjectFiles || [])];
                    dispatch(setMessageFiles(newMedia));
                    setFieldValue('defaultMessage', {
                      library: newMedia,
                    });
                  }}
                  onCloseTabs={() => {
                    setSelectedOptions(null);
                    dispatch(removeMessageFiles());
                    setShowMesssageBar(false);
                    dispatch(setPrice(5));
                  }}
                  media={messageFiles || []}
                />
              )}
              <div className="chat-input">
                {selectedOptions === null && (
                  <div className="input-wrap">
                    <MessageInput handleSendMessage={handleSendMessage} />
                  </div>
                )}
                {/* <hr /> */}
                <div className="input-actions">
                  <span
                    className="input-actions__img"
                    onClick={() => onNewListOpenModel()}
                  >
                    <ImageThumbnail />
                  </span>
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <ul className="switcher-actions-list">
          <li>
            <Switchbox
              status={false}
              onChange={() =>
                setFieldValue('allowContentAccess', !values.allowContentAccess)
              }
              value={values.allowContentAccess}
              size="small"
              name="allowContentAccess"
            />
            <span className="label">Allow Pop Wall Access</span>
          </li>
          <li>
            <Switchbox
              status={false}
              onChange={() =>
                setFieldValue(
                  'allowBuyerToMessage',
                  !values.allowBuyerToMessage,
                )
              }
              value={values.allowBuyerToMessage}
              size="small"
              name="allowBuyerToMessage"
            />

            <span className="label">Allow to Send Direct Messages</span>
          </li>
          <li>
            <Switchbox
              status={false}
              onChange={() => {
                const isArc = !values.isArchive;
                setFieldValue('isArchive', isArc);
                setFieldValue('isActive', !isArc);
              }}
              value={values.isArchive}
              size="small"
              name="isArchive"
            />
            <span className="label">Archive Membership</span>
          </li>
        </ul>
      </div>
      <footer className="footer-card">
        <div className="footer-links">
          <NewButton
            type="default"
            size="large"
            onClick={() => onCancel()}
            shape="circle"
          >
            Cancel
          </NewButton>
          <NewButton
            htmlType="submit"
            type="primary"
            size="large"
            shape="circle"
            disabled={Object.keys(errors || {}).length > 0 || isLoading}
            onClick={() => {
              if (values.isArchive) {
                swal({
                  title: 'Are you sure?',
                  text: 'This membership will no longer be available to the new users',
                  icon: 'warning',
                  dangerMode: true,
                  buttons: ['Cancel', 'Yes'],
                }).then(async (willDelete) => {
                  if (willDelete) {
                    handleSubmit();
                  } else {
                    const isArc = !values.isArchive;
                    setFieldValue('isArchive', isArc);
                    setFieldValue('isActive', !isArc);
                    handleSubmit();
                  }
                });
              } else {
                handleSubmit();
              }
            }}
            isLoading={isSubmitting}
          >
            Save
          </NewButton>
        </div>
      </footer>
      {isNewListModelOpen && (
        <LibraryModal
          notAllowedTypes={['audio']}
          isOpen={isNewListModelOpen}
          onPostHandler={onSubmitHandler}
          onCancel={onCancelHandler}
          addtoButtontext="Add to Message"
          managedAccountId={managedAccountId}
        />
      )}
    </div>
  );
};

export default styled(MemberLevelForm)`
  .form-field {
    margin: 0 0 7px;
  }
  .row-holder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -10px;

    .col-25 {
      width: 30%;
      padding: 0 10px;

      @media (max-width: 480px) {
        width: 100%;
      }
    }

    .col-75 {
      padding: 0 10px;
      flex-grow: 1;
      flex-basis: 0;
    }
  }

  .switcher-actions-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 17px;
    color: var(--pallete-text-main);
    font-weight: 400;

    li {
      display: flex;
      align-items: center;
      margin: 0 0 18px 0;

      .toggle-switch {
        margin: 0 20px 0 0;
      }
    }
  }
`;
