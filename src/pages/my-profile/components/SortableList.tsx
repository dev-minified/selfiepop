import { ServiceType } from 'enums';
import { useState } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import SortableItem from './SortableItem';

const dontShowDelete = [ServiceType.CHAT_SUBSCRIPTION];
const dontShowEdit: string[] = [];

const SortableList = SortableContainer<any>(
  ({
    items,
    onDelete,
    Actions,
    showAddPopIcon,

    ...rest
  }: {
    items: IUserLink[];
    onDelete?: (index: number) => void;
    Actions?: any;
    user: any;
    showAddPopIcon?: boolean;
    inlineForm?: boolean;
    type?: ProfileType;
  }) => {
    // tslint:disable-next-line: react-hooks-nesting
    const [edit, setEdit] = useState(undefined);
    return (
      <ul className="sortable">
        {items?.map((item: any, index: number, arr: IUserLink[]) => {
          if (rest?.type === 'links' && item.isTemp) {
            return null;
          }
          if (rest?.type === 'services' && item?.linkType !== 'service') {
            return null;
          }
          // if (
          //   item.linkType === 'service' &&
          //   !rest?.user?.enableMembershipFunctionality
          // ) {
          //   if (item?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION) {
          //     return null;
          //   }
          // }
          const showDeleteIcon =
            item.linkType === 'service' && !item.isTemp
              ? arr?.filter(
                  (v) =>
                    v.popLinksId?.popType === item.popLinksId.popType &&
                    !dontShowDelete.includes(item.popLinksId.popType),
                )?.length > 1
              : true;
          const showToggleAction =
            item.linkType === 'service'
              ? !dontShowEdit.includes(item?.popLinksId?.popType)
              : true;
          const showEditIcon = item.linkType !== 'innerCircleLink';
          const showActiveToggle =
            item.linkType !== 'innerCircleLink' && showToggleAction;
          return (
            <SortableItem
              TempLink={item?.isTemp}
              onDelete={onDelete}
              Actions={Actions}
              key={`item-${index}-${item._id}`}
              link={item}
              index={index}
              edit={edit}
              sn={index}
              setEdit={setEdit}
              disabled={edit === index}
              showDeleteIcon={showDeleteIcon}
              showEditIcon={showEditIcon}
              showActiveToggle={showActiveToggle}
              showAddPopIcon={showAddPopIcon}
              {...rest}
            />
          );
        })}
      </ul>
    );
  },
);
export default SortableList;
