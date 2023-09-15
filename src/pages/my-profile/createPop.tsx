import { updatePop } from 'api/Pop';
import { getSocialAccounts } from 'api/social-accounts';
import classNames from 'classnames';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { setSocialLinks } from 'store/reducer/global';
import { addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';

import Scrollbar from 'components/Scrollbar';
import { create } from '../../api/Pop';
import { pushIntoUser, update } from '../../api/User';
import EditableItem from './components/EditableItem';
interface Props {
  className?: string;
}

function PopEditor({ className }: Props): ReactElement<any> {
  const { user, setUser } = useAuth();
  const [LinkType, setLinkType] = useState<IUserLink['linkType']>('simpleLink');
  const [value, setValues] = useState<Partial<IUserLink | IPop>>();
  const appDispatch = useAppDispatch();
  const socialLinks = useAppSelector((state) => state?.global?.socialLinks);
  const history = useHistory();

  const options = useQuery();
  const ref = useRef<HTMLDivElement>(null);

  const UpdateUser = useCallback(
    async (value: any) => {
      delete value._id;
      const userData = await update(value);
      await pushIntoUser(user._id, {
        name: 'links',
        value: {
          title: value.tagLine,
          isActive: value.isActive,
          linkType: 'biography',
        },
      }).then(async (data: any) => {
        setUser((u: any) => ({
          ...u,
          ...userData?.data,
          links: [...u.links, data.links[data.links.length - 1]],
        }));
      });
    },
    [setUser, user._id],
  );

  const updateSocialLinks = useCallback(
    async (value: any) => {
      delete value._id;
      const userData = await update({
        socialMediaLinks: value.socialMediaLinks,
      });
      await pushIntoUser(user._id, {
        name: 'links',
        value: {
          title: 'Social Links',
          isActive: value.isActive,
          linkType: 'socialLinks',
        },
      }).then(async (data: any) => {
        setUser((u: any) => ({
          ...u,
          ...userData?.data,
          links: [...u.links, data.links[data.links.length - 1]],
        }));
      });
    },
    [setUser, user._id],
  );

  useEffect(() => {
    setTimeout(() => {
      if (ref.current)
        scrollIntoView(ref.current, {
          behavior: 'smooth',
          block: 'start',
        });
    }, 700);
  }, []);

  const addNewPop = useCallback(
    async (values: any) => {
      try {
        values.isTemp = true;
        const response = await create(values);
        if (values.type === ServiceType.POPLIVE) {
          const timeZone = values.timeZone;
          if (timeZone !== user.timeOffset) {
            await update({ timeOffset: timeZone });
          }
        }
        const newArray = [...(user?.links || []), response.pop];
        setUser({ ...user, links: newArray, timeOffset: values.timeZone });
        toast.success('Your Pop has been created successfully.');
        const qs =
          response?.pop?.linkType === 'service'
            ? `&subType=${response?.pop?.popLinksId?.popType}&mode=edit${
                options?.section === 'links' ? '&section=links' : ''
              }&temp=true`
            : '&section=links';
        history.replace(
          `/my-profile/link/${response?.pop._id}?type=${response?.pop?.linkType}${qs}`,
        );
        return { pop: response?.pop };
      } catch (e: any) {
        if (e.message) {
          toast.error(e.message);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser, user],
  );

  const addNewLink = useCallback(
    async (value: any) => {
      if (!value) return;
      await pushIntoUser(user._id, value).then(async (data: any) => {
        setUser({
          ...user,
          links: data.links,
        });
      });
    },
    [setUser, user],
  );

  useEffect(() => {
    if (options.type === 'service') {
      setValues({
        popType: options.subType as string,
        isActive: true,
        timeZone: user.timeOffset,
      });
      setLinkType(options.type);
    } else if (options.type === 'socialLinks') {
      setLinkType(options.type);
    } else {
      setLinkType(options.subType as IUserLink['linkType']);
    }

    if (options?.subType === ServiceType.ADVERTISE) {
      getSocialAccounts().then((res) => {
        appDispatch(setSocialLinks(res?.socialMedia || []));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleSubmit = async (values: any) => {
    if (values?._id) {
      return onSavePop(values);
    }
    if (LinkType === 'service') {
      if (
        !values?.priceVariations?.length &&
        values?.popType === ServiceType.CHAT_SUBSCRIPTION
      ) {
        values.priceVariations = [
          {
            price: Number(0),
            title: 'membership 1',
            description: '',
            isActive: true,
            isArchive: false,
            questions: [],
            isDefault: true,
            allowBuyerToMessage: true,
            allowContentAccess: true,
            allowUpsaleOffer: true,
            type: 'simple',
          },
        ];
      }
      return addNewPop && (await addNewPop(values));
    }
    if (LinkType === 'biography') {
      UpdateUser && (await UpdateUser(values));
      return;
    }
    if (LinkType === 'socialLinks') {
      await updateSocialLinks?.(values);
      return;
    }
    addNewLink && (await addNewLink(values));
    handleCancel();
  };
  const onSavePop = async (requestData: any) => {
    // eslint-disable-next-line no-useless-catch
    try {
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
      newItem && appDispatch(addPreviewPop(newItem));
      setUser({
        ...user,
        links: newLinks,
        timeOffset: requestData.timeZone,
      });
      return newItem;
    } catch (e) {
      throw e;
    }
  };
  const handleCancel = () => {
    history.push(
      options?.type !== 'service'
        ? `/my-profile/pop-list?type=links`
        : options?.section === 'links'
        ? `/my-profile/pop-list?type=service&section=links`
        : `/my-profile/pop-list?type=service`,
    );
  };

  return (
    <div ref={ref} className={classNames('create__pop', className)}>
      <Scrollbar>
        {LinkType && (
          <EditableItem
            type={LinkType}
            value={
              ['biography', 'socialLinks'].includes(LinkType) ? user : value
            }
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            socialLinks={socialLinks}
            title={`Add New ${
              LinkType === 'service' ? options.subtype : LinkType
            }`}
            options={{ delete: false, status: true, close: false }}
          />
        )}
      </Scrollbar>
    </div>
  );
}

export default styled(PopEditor)`
  height: 100%;
`;
