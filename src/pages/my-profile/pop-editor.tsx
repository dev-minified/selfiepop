import { updatePop } from 'api/Pop';
import { deleteLink, update, updateNestedAttribute } from 'api/User';
import { getSocialAccounts } from 'api/social-accounts';
import classNames from 'classnames';
import Scrollbar from 'components/Scrollbar';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { setSocialLinks } from 'store/reducer/global';
import styled from 'styled-components';
import swal from 'sweetalert';
import EditableItem from './components/EditableItem';
interface Props {
  className?: string;
  isAnimationComplete?: boolean;
}
const dontShowDelete = [ServiceType.CHAT_SUBSCRIPTION];
function PopEditor({
  className,
  isAnimationComplete,
}: Props): ReactElement<any> {
  const { user, setUser, isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [link, setLink] = useState<any>(null);
  const dispatch = useAppDispatch();
  const socialLinks = useAppSelector((state) => state?.global?.socialLinks);
  const ref = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const options = useQuery();

  useEffect(() => {
    setTimeout(() => {
      if (ref.current)
        scrollIntoView(ref.current, {
          behavior: 'smooth',
          block: 'start',
        });
    }, 700);
  }, []);

  const onSaveLink = async (requestData: any) => {
    await updateNestedAttribute(user._id, requestData)
      .then(() => {
        const newLinks = user?.links?.map((item: any) => {
          if (item._id === requestData.id) {
            return { ...item, ...requestData.value };
          }
          return item;
        });
        setUser({ ...user, links: newLinks });
      })
      .catch((e: Error) => {
        throw e;
      });
  };

  const onSavePop = async (requestData: any) => {
    let newItem;
    if (requestData?.owner?._id) {
      requestData.owner = requestData.owner?._id;
    }
    const res = await updatePop(requestData, requestData._id);
    const newLinks = user?.links?.map((item: any) => {
      if (item?.popLinksId?._id === res._id) {
        newItem = {
          ...item,
          isActive: res.isActive,
          isThumbnailActive: res?.isThumbnailActive,
          popLinksId: res,
        };
        return {
          ...item,
          isActive: res.isActive,
          isThumbnailActive: res?.isThumbnailActive,
          popLinksId: res,
        };
      }
      return item;
    });
    if (requestData.type === ServiceType.POPLIVE) {
      const timeZone = requestData.timeZone;
      if (timeZone !== user.timeOffset) {
        await update({ timeOffset: timeZone });
      }
    }
    setUser({
      ...user,
      links: newLinks,
      timeOffset: requestData.timeZone,
    });
    return newItem;
  };

  const UpdateUser = useCallback(
    async (value: any) => {
      delete value._id;
      await update(value);
      setUser((u: any) => ({ ...u, ...value }));
    },
    [setUser],
  );

  const updateSocialLinks = useCallback(
    async (value: any) => {
      const userData = await update({
        socialMediaLinks: value.socialMediaLinks,
      });
      delete value.socialMediaLinks;
      await onSaveLink?.(value);
      setUser((u: any) => ({ ...u, ...userData?.data }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser],
  );

  useEffect(() => {
    if (user && id && isAuthenticated) {
      const links = user?.links;
      const selectedLink = (links || [])?.find((l: any) => l._id === id);
      setLink(selectedLink);
    }
  }, [user, id, isAuthenticated, options]);

  useEffect(() => {
    if (link?.popLinksId?.popType === ServiceType.ADVERTISE) {
      getSocialAccounts().then((res) => {
        dispatch(setSocialLinks(res?.socialMedia || []));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  const handleSubmit = async (values: any) => {
    try {
      if (link.linkType === 'service') {
        await onSavePop(values);
        return handleCancel();
      }
      if (link.linkType === 'biography') {
        UpdateUser && (await UpdateUser(values));
        return;
      }
      if (link.linkType === 'socialLinks') {
        updateSocialLinks?.(values);
      }
      await onSaveLink(values);
      handleCancel();
    } catch (e) {
      toast.error('Please try again..');
      throw e;
    }
  };

  const handleCancel = () => {
    history.push(
      !options?.temp
        ? '/my-profile/links'
        : options?.type !== 'service'
        ? `/my-profile/links`
        : options?.section === 'links'
        ? `/my-profile/services?section=links`
        : `/my-profile/services/edit`,
    );
  };

  const handleDelete = () => {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete? ',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Delete'],
    }).then(async (willDelete) => {
      if (willDelete) {
        const newLinks = user?.links?.filter((l: any) => l._id !== link._id);
        try {
          if (link?._id) {
            try {
              await deleteLink(link._id);
              setUser({
                ...user,
                links: newLinks,
              });
            } catch (error) {
              console.log(error);
            }
            history.push(
              options?.temp ? '/my-profile/services/edit' : `/my-profile/links`,
            );
          }
        } catch (e) {}
      }
    });
  };
  return (
    <div ref={ref} className={classNames('pop__edit', className)}>
      <Scrollbar>
        {link && (
          <EditableItem
            type={link?.linkType}
            socialLinks={socialLinks}
            value={
              link.popLinksId
                ? { ...link.popLinksId, timeZone: user?.timeOffset }
                : link
            }
            isAnimationCompleted={isAnimationComplete}
            service={link}
            options={{
              close: false,
              status: true,
              delete:
                link.linkType === 'service'
                  ? !dontShowDelete.includes(link?.popLinksId?.popType) &&
                    user?.links.filter(
                      (v: IUserLink) =>
                        v.popLinksId?.popType === link.popLinksId.popType,
                    )?.length > 1
                  : true,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        )}
      </Scrollbar>
    </div>
  );
}

export default styled(PopEditor)`
  height: 100%;
`;
