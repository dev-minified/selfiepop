import { updatePop } from 'api/Pop';
import {
  deleteLink,
  update,
  updateNestedAttribute,
  updateSorting,
} from 'api/User';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import { useCallback } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import swal from 'sweetalert';

import SortableList from './SortableList';
interface Props {
  links: any[];
  user?: any;
  setLinks: any;
  className?: string;
  displayFilter?: (ls: IUserLink[]) => IUserLink[];
  inlineForm?: boolean;
  addPop?: boolean;
  type?: ProfileType;
  link?: LINKTYPES;
}

const LinkListing = ({
  links,
  link,
  setLinks,
  inlineForm = true,
  addPop = false,
  displayFilter,
  type,
}: Props) => {
  const { user, setUser }: any = useAuth();
  const filteredLinks = (displayFilter && displayFilter(links)) || links;
  const { setLoading } = useRequestLoader();
  const onDeleteHandler = async (index: number) => {
    const message = 'Are you sure you want to delete?';
    swal({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      dangerMode: true,
      buttons: ['No', 'Yes'],
    }).then(async (willDelete) => {
      if (willDelete) {
        const link = filteredLinks[index];
        const newArray = links.filter((item) => item._id !== link._id);
        try {
          await deleteLink(link?._id as string);
          setLinks(newArray);
          setUser((prev: IUser) => ({
            ...prev,
            isAffiliate: false,
            links: newArray,
          }));
        } catch (e) {}
      }
    });
  };
  const onStatusToggel = async (index: number) => {
    if (index < 0 || index > filteredLinks.length) return;
    const link = filteredLinks[index];
    let isAllowToToggle = true;
    if (
      link.linkType === 'service' &&
      link?.popLinksId &&
      link?.popLinksId?.popType === ServiceType.ADVERTISE &&
      !link?.isActive
    ) {
      const pVariations = link?.popLinksId?.priceVariations;
      isAllowToToggle = !!pVariations.find((p: any) => p.isActive);
      if (!isAllowToToggle) {
        toast.info('Please activate atleast 1 variation');
        return;
      }
    }

    const requestData = {
      id: link._id,
      name: 'links',
      value: { ...link, isActive: !link.isActive },
    };
    const newArray = links.slice()?.map((item) => {
      if (item._id === link._id) {
        return {
          ...item,
          isActive: !item?.isActive,
          popLinksId: item.popLinksId && {
            ...item.popLinksId,
            isActive: !item?.isActive,
          },
        };
      }
      return item;
    });
    setLinks(newArray);
    await updateNestedAttribute(user._id, requestData)
      .then(async () => {
        if (requestData?.value?.linkType === 'service') {
          await updatePop(
            { isActive: requestData?.value?.isActive },
            requestData?.value?.popLinksId?._id,
          );
        }
      })
      .catch(() => {
        setLinks(links);
      });
  };
  const onSaveLink = async (requestData: any) => {
    await updateNestedAttribute(user._id, requestData)
      .then(() => {
        const newLinks = links?.map((item) => {
          if (item._id === requestData.id) {
            return { ...item, ...requestData.value };
          }
          return item;
        });

        setLinks(newLinks);
      })
      .catch(() => {});
  };

  const onSavePop = async (requestData: any) => {
    await updatePop(requestData, requestData._id)
      .then((res: any) => {
        const newLinks = links?.map((item) => {
          if (item?.popLinksId?._id === res._id) {
            return { ...item, popLinksId: res };
          }
          return item;
        });
        setLinks(newLinks);
      })
      .catch(console.log);
  };

  const onLinkSortEnd = async (
    {
      oldIndex,
      newIndex,
    }: {
      oldIndex: number;
      newIndex: number;
    },
    e: any,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (oldIndex === newIndex) return;
    const oldLinks = links;
    const sortedArray = arrayMove<Ilink>(oldLinks, oldIndex, newIndex)?.map(
      (item, index) => ({ ...item, sortOrder: index }),
    );

    const requestData: string[] = sortedArray?.map(({ _id }: any) => _id);
    setLinks(sortedArray);
    await updateSorting({
      ids: requestData,
      name: link,
    }).catch((e: Error) => {
      setLinks(oldLinks);
      console.log(e);
    });
  };

  const UpdateUser = useCallback(async (value: any) => {
    delete value._id;
    await update(value);
    setUser((u: any) => ({ ...u, ...value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onAddPopHandler = async (link: Ilink) => {
    const newlinks: IUserLink[] = [...(links || [])];
    setLoading(true);

    if (link.isTemp) {
      let sortOder = link.sortOrder || 1;
      newlinks.forEach((f) => {
        if (
          !f.isTemp &&
          sortOder < (f.sortOrder || 0) &&
          f.sortOrder !== 1000
        ) {
          sortOder = f.sortOrder || 0;
        }
      });
      link.sortOrder = sortOder + 1;
      //eslint-disable-next-line
      const { sortOrder, ...rest } = link.popLinksId as any;
      link.popLinksId = rest;
    }
    const requestData = {
      id: link._id,
      name: 'links',
      value: { ...link, isTemp: false },
    };
    await updateNestedAttribute(user?._id, requestData)
      .then(() => {
        const newLinkss = newlinks.map((f) => {
          const newLink = { ...f };
          if (f._id === link._id) {
            return { ...newLink, ...requestData.value };
          }
          return newLink;
        });
        const tempLinks = newLinkss.filter((f) => f.isTemp);
        const activeLinks = newLinkss.filter((f) => !f.isTemp);
        activeLinks.sort((a: any, b: any) => a?.sortOrder - b?.sortOrder);
        setLinks([...tempLinks, ...activeLinks]);
      })
      .catch(() => {
        toast.error('unable to add to Pop');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="className">
      <div id="links-area">
        <SortableList
          useDragHandle
          lockAxis="y"
          useWindowAsScrollContainer
          items={filteredLinks}
          Actions={{
            onSaveLink,
            onSavePop,
            UpdateUser,
            onStatusToggel,
            onDelete: onDeleteHandler,
            onAddPop: onAddPopHandler,
          }}
          user={user}
          showAddPopIcon={addPop}
          onDelete={onDeleteHandler}
          onSortEnd={onLinkSortEnd}
          helperClass="isdragging"
          inlineForm={inlineForm}
          type={type}
        />
      </div>
    </div>
  );
};

export default styled(LinkListing)``;
