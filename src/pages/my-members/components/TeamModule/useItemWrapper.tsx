import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findUser, getTeamManagedAccountById } from 'store/reducer/teamManager';
type IUserItemWrapper = {
  username?: string;
  isEdit?: boolean;
  allowFetch?: boolean;
};
const useItemWrapper = (props?: IUserItemWrapper) => {
  const username = props?.username;
  const isEdit = props?.isEdit;
  const allowFetch = props?.allowFetch !== undefined ? props?.allowFetch : true;
  const dispatch = useAppDispatch();
  const { username: uname } = useParams<{ username: string }>();

  const [activeItem, setActiveItem] = useState<any>({});
  const [error, setError] = useState<any>({});
  const item = useAppSelector((state) => state.teamManagedUsers.item);
  const usernamee = username || uname;
  const setUser = useCallback(() => {
    if (isEdit && allowFetch) {
      if (usernamee && item?.account?.userId?.username !== usernamee) {
        dispatch(
          getTeamManagedAccountById({
            userId: `${username || uname}`,
            params: {
              ignoreStatusCodes: [404],
            },
          }),
        )
          .unwrap()

          .catch((e) => {
            setError(e);
          });
      }
    } else if (usernamee && !item && allowFetch) {
      dispatch(
        findUser({
          userName: `${username || uname}`,
          params: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .unwrap()

        .catch((e) => {
          setError(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernamee]);
  useEffect(() => {
    if (!activeItem?.id && item) {
      setActiveItem({
        id: item._id,
        uId: item?.userId?._id,
        image: item.userId?.profileImage,
        title: `${item?.userId?.pageTitle ?? 'Incognito User'}`,
        isOnline: item?.userId?.isOnline,
        extra: (
          <div>
            {item?.userId?.username ? `@${item?.userId?.username}` : ''}
          </div>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  return { activeItem, item, error, setUser };
};

export default useItemWrapper;
