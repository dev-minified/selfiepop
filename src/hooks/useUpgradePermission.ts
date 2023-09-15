import dayjs from 'dayjs';
import { PostTierTypes } from 'enums';

const useUpgradePermission = (item?: IPost, isSeller = false) => {
  const current = dayjs();
  const personAccessType = item?.membership?.accessType;
  const itemMemberShips = item?.membershipAccessType || [];
  const ispostText = !!item?.postText;
  const isMedia = !!item?.media?.length;
  const isPaid =
    isSeller ||
    (personAccessType === PostTierTypes?.pay_to_view && !item?.paymentComplete);
  const isFreeSubExist = !!itemMemberShips?.find(
    (m) => m.accessType === PostTierTypes.free_to_view,
  );
  const isUpgrade =
    isSeller || (personAccessType === PostTierTypes.hidden && isFreeSubExist);
  let timestamp =
    item?.postType === 'scheduled'
      ? dayjs(item?.publishAt)
      : item?.createdAt
      ? dayjs(item?.createdAt)
      : '';
  if (timestamp) {
    // timestamp = (timestamp as dayjs.Dayjs).isSame(current, 'date')
    //   ? (timestamp as dayjs.Dayjs).fromNow()
    //   : (timestamp as dayjs.Dayjs).format('MM/DD/YYYY hh:mm A');
    timestamp = (timestamp as dayjs.Dayjs).fromNow();
  }
  return {
    personAccessType,
    isFreeSubExist,
    isUpgrade,
    ispostText,
    isMedia,
    isPaid,
    timestamp,
    now: current,
  };
};
export default useUpgradePermission;
