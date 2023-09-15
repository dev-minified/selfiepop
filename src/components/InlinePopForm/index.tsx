import { updatePop } from 'api/Pop';
import classNames from 'classnames';
import {
  TimeComponents,
  TimeSlotInterface,
} from 'components/DateRangeSelector/interfaces';
import NewButton from 'components/NButton';
import { default as SwitchBox } from 'components/switchbox';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServiceType, SocialPlatforms } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { ILinkEditorProps } from 'interfaces/ILinkEditorProps';
import debounce from 'lodash/debounce';
import { default as React, useCallback, useEffect, useRef } from 'react';
import { addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import swal from 'sweetalert';

import { GetPopIcon, LinkTypeName } from 'appconstants';
import { RecycleBin } from 'assets/svgs';
import useAuth from 'hooks/useAuth';
import * as yup from 'yup';
import Card from '../SPCards';
import ChatSubscriptionPopType from './Chatsubscription/ChatSubscriptionPopType';
import DigitalFileDownloadPopType from './DigitalFileDownload/DigitalFileDownloadPopType';
import PopLiveSection from './PopLiveSection';
import PriceVariationPopType from './PriceVariation/PriceVariationPopType';
import PromotionalMediaPopType from './PromotionalMedia/PromotionalMediaPopType';
import PromotionalShoutoutPopType from './PromotionalShoutout/PromotionalShoutoutPopType';
import QuestionPopType from './Questions/QuestionPopType';
import SimplePopFrom from './simplePopFrom';

dayjs.extend(utc);
const platfromTypeArray: string[] = [
  SocialPlatforms.FACEBOOK,
  SocialPlatforms.INSTAGRAM,
  SocialPlatforms.ONLYFANS,
  SocialPlatforms.TIKTOK,
  SocialPlatforms.TWITTER,
  SocialPlatforms.YOUTUBE,
];
const validationSchema = yup.object().shape({
  title: yup.string().trim().max(255).required('Title is required'),
  price: yup
    .number()
    .min(0, 'Price should be At least $0')
    .required('Price should be At least $0'),
  description: yup.string().max(500),
});

const PriceVariationBlackList = [
  ServiceType.DIGITAL_DOWNLOADS,
  ServiceType.ADVERTISE,
  ServiceType.POPLIVE,
];

const getTimeComponents = (item: string) => {
  try {
    const time = item.split(' ');
    const hours = time[0].split(':')[0];
    const minutes = time[0].split(':')[1];
    const type = time[1];
    return {
      hours,
      minutes,
      ampm: type,
    };
  } catch (e) {
    console.error(e);
    return {
      hours: '00',
      minutes: '00',
      ampm: 'AM',
    };
  }
};
const getTimeComponentsString = (item: TimeComponents): string => {
  return `${item.hours}:${item.minutes} ${item.ampm}`;
};
const getMilliFromTimeComponents = (startTime: TimeComponents): Number => {
  return Date.parse(`1/1/1970 ${getTimeComponentsString(startTime)}`);
};
const compareTime = (
  startTime: TimeComponents,
  endTime: TimeComponents,
  slots: TimeSlotInterface[],
  id?: string,
): { isError: boolean; compareWith: object | null } => {
  const milliSecStartTime = getMilliFromTimeComponents(startTime);
  const milliSecEndtime = getMilliFromTimeComponents(endTime);
  if (milliSecStartTime >= milliSecEndtime && startTime.ampm === endTime.ampm) {
    toast.error(
      'Start time is later than end time, please make sure start time comes earlier than the selected end time',
    );
    return { isError: true, compareWith: null };
  }

  for (const slot of slots) {
    if (slot._id && id && slot._id === id) continue;

    const existingStartTime = Date.parse(`1/1/1970 ${slot.startTime}`);
    const existingEndTime = Date.parse(`1/1/1970 ${slot.endTime}`);

    if (
      milliSecStartTime === existingStartTime &&
      milliSecEndtime === existingEndTime
    ) {
      toast.error(
        'Two slots with same times. Please choose appropriate Options.',
      );
      return { isError: true, compareWith: slot };
    } else if (
      milliSecStartTime < existingStartTime &&
      milliSecEndtime > existingEndTime
    ) {
      toast.error(
        `This range is in conflict with ${slot.startTime} -  ${slot.endTime}. Please delete ${slot.startTime} -  ${slot.endTime} if you want to create this new range.`,
      );
      return { isError: true, compareWith: slot };
    } else if (
      (milliSecStartTime > existingStartTime &&
        milliSecStartTime < existingEndTime) ||
      (milliSecEndtime > existingStartTime && milliSecEndtime < existingEndTime)
    ) {
      toast.error(
        'You can not have a time range that overlaps with another time range',
      );
      return { isError: true, compareWith: slot };
    }
  }

  return { isError: false, compareWith: null };
};
const InlinePopForm: React.FC<
  { value: Partial<IPop>; className?: string } & Omit<
    ILinkEditorProps,
    'title' | 'value'
  >
> = ({
  onCancel,
  className,
  value,
  onSubmit,
  options = { status: true, delete: true, close: false },
  onDeleteClick,
}) => {
  const { user, setUser } = useAuth();

  const dispatch = useAppDispatch();

  const { previewPop } = useAppSelector((state) => state.popslice);
  const didMount = useRef(false);
  const form = useFormik<IPop>({
    validationSchema,
    initialValues: {
      _id: '',
      title: '',
      popType: '',
      price: 5,
      description: '',
      actionText: 'Exclusive Content',
      popLiveAdditionalPrice: 0,
      popLiveAdditionalTime: 0,
      isActive: false,
      isThumbnailActive: true,
      popThumbnail: undefined,
      additionalArt: [],
      priceVariations: [],
      questions: [],
      digitalDownloads: [],
      socialMediaSorting: [],
      weeklyHours: [],
      timeIntervalBetweenEvents: 5,
      pricePerAdditionalFiveMinutes: 5,
      duration: 15,
      monEnabled: false,
      tueEnabled: false,
      thuEnabled: false,
      wedEnabled: false,
      friEnabled: false,
      satEnabled: false,
      sunEnabled: false,
    },
    // validate: (values) => {

    // },
    onSubmit: async (values) => {
      //Deleting some value before sending
      delete values.popName;
      if (values.popType === ServiceType.POPLIVE) {
        if (Number(values.pricePerAdditionalFiveMinutes || '0') < 5) {
          form.setFieldError(
            'pricePerAdditionalFiveMinutes',
            'Additional price must be at least 5',
          );
          return;
        }
      }
      //filter out the failed uploads
      const newAdditionalArts = values.additionalArt?.filter(
        ({ failed, showProgressBar }: any) => !failed && !showProgressBar,
      );
      const newdigitalDownloads = values.digitalDownloads?.filter(
        ({ failed, showProgressBar }: any) => !failed && !showProgressBar,
      );

      const inprocessAA = values.additionalArt?.filter(
        ({ showProgressBar }: any) => showProgressBar,
      ).length;
      const inprocessDD = values.digitalDownloads?.filter(
        ({ showProgressBar }: any) => showProgressBar,
      ).length;

      if (inprocessAA || inprocessDD) {
        const res = await swal({
          title: 'File are getting uploaded',
          text: 'Some of the files are still in progress do you want to continue without them?',
          icon: 'error',
          buttons: ['No', 'Yes'],
        });
        if (!res) return;
      }

      const sumbitValues = {
        ...values,
        additionalArt: newAdditionalArts,
        digitalDownloads: newdigitalDownloads,
      };

      onSubmit &&
        (await onSubmit(sumbitValues)
          .then((res: any) => {
            setValues((v) => {
              return { ...v, ...res?.pop?.popLinksId };
            });
          })
          .catch(console.log));
    },
  });
  const checkOverLappingDates = useCallback((form: any) => {
    const { setFieldValue, setValues, values: formValues } = form;
    const { weeklyHours } = formValues;
    const daysObj: Record<string, any> = {
      sat: [],
      sun: [],
      mon: [],
      fri: [],
      thu: [],
      wed: [],
      tue: [],
    };
    weeklyHours.forEach((b: Record<string, any>) => {
      const a = { ...b };
      const day = a.dayOfTheWeek.toLowerCase();
      a.isError = false;
      daysObj[day].push(a);
    });

    let isError: {
      isError: boolean;
      compareWith: Record<string, any> | null;
    } = { isError: false, compareWith: null };
    let i = 0;
    const slotsArray = Object.keys(daysObj);
    while (i < slotsArray.length) {
      const comparingSlots = daysObj[slotsArray[i]];
      if (isError.isError) {
        return isError.isError;
      }
      if (comparingSlots?.length) {
        let j = 0;
        const comLength = [...comparingSlots].length;
        while (j < comLength) {
          const s = comparingSlots[j];
          isError = compareTime(
            getTimeComponents(s.startTime),
            getTimeComponents(s.endTime),
            comparingSlots.slice(j + 1),
            s?._id,
          );
          if (isError.isError) {
            const { compareWith } = isError;
            const st = s.dayOfTheWeek.toLowerCase();
            const stDaySlots = daysObj[st];
            stDaySlots.forEach((a: any) => {
              if (a.startTime === s.startTime && a.endTime === s.endTime) {
                a.isError = true;
              }
            });
            if (compareWith) {
              const { dayOfTheWeek, startTime, endTime } = compareWith;
              const se = dayOfTheWeek.toLowerCase();
              const seDaySlots = daysObj[se];
              seDaySlots.forEach((a: any) => {
                if (a.startTime === startTime && a.endTime === endTime) {
                  a.isError = true;
                }
              });
              setValues({
                ...formValues,
                [st]: stDaySlots,
                [se]: seDaySlots,
              } as any);
            } else {
              setFieldValue(st, stDaySlots);
            }

            return isError.isError;
          }
          j++;
        }
      }

      i++;
    }
    return isError.isError;
  }, []);

  const { values, setValues, setFieldValue } = form;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatepreviewPOp = useCallback(
    debounce((values) => {
      dispatch(
        addPreviewPop({
          ...values,
        }),
      );
    }, 500),
    [],
  );
  useEffect(() => {
    if (didMount.current) {
      updatepreviewPOp({
        ...previewPop,
        popLinksId: { ...(previewPop?.popLinksId || {}), ...values },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.title,
    values.description,
    values.isActive,
    values.isThumbnailActive,
    values.price,
    values.pricePerAdditionalFiveMinutes,
    values.tueEnabled,
    values.satEnabled,
    values.monEnabled,
    values.friEnabled,
    values.sunEnabled,
    values.wedEnabled,
    values.thuEnabled,
    values.weeklyHours,
    values.duration,
    values.timeIntervalBetweenEvents,
    values.popThumbnail,
    values.actionText,
  ]);

  useEffect(() => {
    const {
      _id,
      title,
      popType,
      price = 5,
      description,
      actionText = 'Exclusive Content',
      isActive = false,
      popThumbnail,
      isThumbnailActive = true,
      additionalArt = [],
      priceVariations = [],
      questions = [],
      digitalDownloads = [],
      socialMediaSorting = [],
      popLiveAdditionalPrice = 0,
      popLiveAdditionalTime = 0,
      duration = 15,
      timeIntervalBetweenEvents = 5,
      monEnabled = false,
      tueEnabled = false,
      thuEnabled = false,
      wedEnabled = false,
      friEnabled = false,
      satEnabled = false,
      sunEnabled = false,
      weeklyHours = [],
      timeZone,
      pricePerAdditionalFiveMinutes = 5,
    } = value;
    const valuObj = {
      _id,
      title,
      popType,
      price,
      description,
      actionText,
      isActive,
      popThumbnail,
      isThumbnailActive,
      additionalArt,
      questions,
      digitalDownloads,
      priceVariations,
      popLiveAdditionalPrice,
      popLiveAdditionalTime,
      duration,
      timeIntervalBetweenEvents,
      monEnabled,
      tueEnabled,
      thuEnabled,
      wedEnabled,
      friEnabled,
      satEnabled,
      sunEnabled,
      weeklyHours,
      timeZone,
      pricePerAdditionalFiveMinutes,

      socialMediaSorting: Array.from(
        new Set([...socialMediaSorting, ...platfromTypeArray]),
      ),
      // ...(pop?.popLinksId || {}),
    };
    setValues((v) => {
      return { ...v, ...valuObj };
    });
    dispatch(
      addPreviewPop({
        ...previewPop,
        popLinksId: {
          ...values,
          ...valuObj,
        },
      }),
    );
    didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { handleChange, handleSubmit, isSubmitting } = form;
  const ChangeHandler = (e: any) => {
    handleChange(e);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const pushIntoValueArray = async (name: keyof typeof values, value: any) => {
    setValues((v) => {
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

  const onChangeHandlerandSave = (name: string, value: any) => {
    if (values._id) {
      let isActivePop = values.isActive;
      if (values.popType === ServiceType.ADVERTISE) {
        if (Array.isArray(value) && values.isActive) {
          isActivePop = !!value.find((v) => v.isActive);
          setFieldValue('isActive', isActivePop);
        } else if (name === 'isActive') {
          const priceV = values.priceVariations;
          const isAllowToactivate = !!priceV?.find((p) => p.isActive);
          if (!isAllowToactivate) {
            toast.info('Please activate atleast 1 variation');
            return;
          }
          isActivePop = value;
        }
      }
      let data = value;
      if (name === 'additionalArt') {
        data = value.filter(
          ({ failed, showProgressBar }: any) => !failed && !showProgressBar,
        );
      }
      saveValueRealTime({
        isActive: isActivePop,
        [name]: data,
        _id: values._id,
      });
    } else {
      const key = name;
      let val = value;
      if (key === 'additionalArt') {
        val = value?.filter((a: any) => a.status === 'completed') || [];
      }
      dispatch(
        addPreviewPop({
          ...previewPop,
          popLinksId: {
            ...(previewPop?.popLinksId || {}),
            ...values,
            [key]: val,
          },
        }),
      );
    }
    setFieldValue(name, value);
  };

  const saveValueRealTime = useCallback(async (values: any) => {
    const res = await updatePop(values, values._id).then((res) => {
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
      });
      dispatch(addPreviewPop({ ...(updated || {}) }));
    });
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const additionalArtOnSuccess = useCallback(
    (file: any) => {
      new Promise((res) => {
        setValues((prev) => {
          res(prev.additionalArt);
          return prev;
        });
      }).then((additionalArts: any) => {
        const oldarray: any = [...(additionalArts || [])];
        const indexof: any = oldarray.findIndex((el: any) => el.id === file.id);
        if (indexof === -1) {
          oldarray.push({
            artName: file.name,
            artPath: file.url,
            artType: file.type,
            showProgressBar: false,
            isActive: true,
            ...file,
          });
        } else {
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
        }

        onChangeHandlerandSave('additionalArt', oldarray);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values],
  );

  const { popType, additionalArt } = values;
  if (!popType) return null;

  const { status: showStatus, close: showClose, delete: showDelete } = options;

  const preSubmit = (e?: React.FormEvent<HTMLFormElement> | undefined) => {
    const isErrorExist = checkOverLappingDates(form);
    if (!isErrorExist) {
      handleSubmit(e);
    }
  };
  const getSubtitle = (popType: string) => {
    switch (popType) {
      case ServiceType.SHOUTOUT:
        return LinkTypeName[popType as keyof typeof LinkTypeName];
      case ServiceType.ADVERTISE:
        return 'advertising';
      case ServiceType.CHAT_SUBSCRIPTION:
        return 'Subscription Chat & Content';
      case ServiceType.ADDITIONAL_SERVICES:
        return 'Additional Services';

      default:
        return popType;
    }
  };
  const getTitle = (popType: string) => {
    switch (popType) {
      case ServiceType.CHAT_SUBSCRIPTION:
        return 'Chat Subscription';
      default:
        return LinkTypeName[popType as keyof typeof LinkTypeName];
    }
  };
  return (
    <div className={className}>
      <Card
        title={getTitle(popType)}
        subtitle={getSubtitle(popType)}
        onCancel={handleCancel}
        icon={<GetPopIcon type={popType as ServiceType} />}
        classes={{
          card: classNames({ [`pop-${popType}`]: popType }),
        }}
        showClose={showClose}
        extra={
          <div>
            {showStatus && (
              <SwitchBox
                value={values.isActive}
                onChange={(e: any) => {
                  onChangeHandlerandSave('isActive', e.target.checked);
                }}
                name="isActive"
                status={false}
                size="small"
              />
            )}
            {showDelete && (
              <span>
                <NewButton
                  icon={<RecycleBin />}
                  outline
                  onClick={onDeleteClick}
                />
              </span>
            )}
          </div>
        }
        onSave={preSubmit}
        isloading={isSubmitting}
      >
        <div className="form">
          <SimplePopFrom
            form={form}
            ChangeHandler={ChangeHandler}
            cbonCancel={onCancel}
            placeholder={LinkTypeName[popType as keyof typeof LinkTypeName]}
          />
        </div>
        {values._id && (
          <div className="services_container_wrapper">
            {popType === ServiceType.POPLIVE && (
              <QuestionPopType
                additionalArtOnSuccess={additionalArtOnSuccess}
                pushIntoValueArray={pushIntoValueArray}
                updateNestedArrayElement={updateNestedArrayElement}
                onChangeHandlerandSave={onChangeHandlerandSave}
                additionalArt={additionalArt}
                value={values}
              />
            )}
            {popType === ServiceType.DIGITAL_DOWNLOADS && (
              <DigitalFileDownloadPopType
                additionalArtOnSuccess={additionalArtOnSuccess}
                pushIntoValueArray={pushIntoValueArray}
                updateNestedArrayElement={updateNestedArrayElement}
                onChangeHandlerandSave={onChangeHandlerandSave}
                additionalArt={additionalArt}
                value={values}
              />
            )}
            {popType === ServiceType.POPLIVE && (
              <PopLiveSection
                value={values}
                onChange={(v) => {
                  setValues((val) => {
                    return Object.assign(val, { ...v });
                  });
                }}
              />
            )}
          </div>
        )}
      </Card>
      {values._id && (
        <div className="promotional-media-options">
          {popType === ServiceType.ADDITIONAL_SERVICES && (
            <QuestionPopType
              additionalArtOnSuccess={additionalArtOnSuccess}
              pushIntoValueArray={pushIntoValueArray}
              updateNestedArrayElement={updateNestedArrayElement}
              onChangeHandlerandSave={onChangeHandlerandSave}
              additionalArt={additionalArt}
              value={values}
            />
          )}

          {popType === ServiceType.ADVERTISE && (
            <PromotionalShoutoutPopType
              additionalArtOnSuccess={additionalArtOnSuccess}
              pushIntoValueArray={pushIntoValueArray}
              updateNestedArrayElement={updateNestedArrayElement}
              onChangeHandlerandSave={onChangeHandlerandSave}
              additionalArt={additionalArt}
              value={values}
            />
          )}

          {/* {popType !== ServiceType.CHAT_SUBSCRIPTION && ( */}
          <PromotionalMediaPopType
            additionalArtOnSuccess={additionalArtOnSuccess}
            pushIntoValueArray={pushIntoValueArray}
            updateNestedArrayElement={updateNestedArrayElement}
            onChangeHandlerandSave={onChangeHandlerandSave}
            additionalArt={additionalArt}
            value={values}
          />
          {/* )} */}

          {popType &&
            !PriceVariationBlackList.includes(popType as ServiceType) && (
              <PriceVariationPopType
                additionalArtOnSuccess={additionalArtOnSuccess}
                pushIntoValueArray={pushIntoValueArray}
                updateNestedArrayElement={updateNestedArrayElement}
                onChangeHandlerandSave={onChangeHandlerandSave}
                additionalArt={additionalArt}
                value={values}
              />
            )}
          {popType === ServiceType.CHAT_SUBSCRIPTION && (
            <ChatSubscriptionPopType
              additionalArtOnSuccess={additionalArtOnSuccess}
              pushIntoValueArray={pushIntoValueArray}
              updateNestedArrayElement={updateNestedArrayElement}
              onChangeHandlerandSave={onChangeHandlerandSave}
              additionalArt={additionalArt}
              value={values}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default styled(InlinePopForm)`
  .simple-according {
    .indicator {
      @media (max-width: 767px) {
        right: 15px;
      }
    }

    .sp__card {
      &.paid-promotion {
        margin-left: -20px;
        margin-right: -20px;

        @media (max-width: 767px) {
          margin-left: 0;
          margin-right: 0;
        }
      }
    }
    .__add {
      margin: 0 0 20px;
    }

    .rc-header {
      background: var(--pallete-background-gray);
      border-top: 1px solid #ededf1;
      border-bottom: 1px solid #ededf1;
      cursor: pointer;

      .title {
        // color: #005a5a;
      }
    }

    .subtitle_according {
      font-size: 14px;
      line-height: 18px;
      color: rgba(#000, 0.6);
      margin: 0 0 20px;
    }

    .extra {
      position: static;
    }

    .content {
      padding: 20px 40px;

      @media (max-width: 767px) {
        padding: 20px 15px;
      }
    }
  }

  .schedule-block {
    margin: 0;
    > .addition__art {
      &.shoutout-block {
        padding: 0;
      }
    }

    .shoutout-block {
      .rc-card-header {
        margin: 0;
        padding: 15px 42px;

        @media (max-width: 767px) {
          padding: 15px 17px;
        }
      }

      .shoutout-block__body-area {
        padding: 30px 42px;
        position: relative;
        background: var(--pallete-background-gray);

        @media (max-width: 767px) {
          padding: 30px 17px;
        }
      }

      .dashed-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
    }
  }

  .promotional-media-options {
    border-top: 1px solid var(--pallete-colors-border);
  }
`;
