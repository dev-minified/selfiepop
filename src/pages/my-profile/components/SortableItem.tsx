import { GetPopIcon, LinkTypeName } from 'appconstants';
import { ContentIcon, ProfileAvatar, Text, Youtube } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { useHistory } from 'react-router';
import { SortableElement } from 'react-sortable-hoc';
import styled from 'styled-components';
import EditableItem from './EditableItem';
import CardDragable from './card-dragable';

const Li = styled.li`
  z-index: 14;
  margin-bottom: 15px;
  &.service {
    input:checked + .switcher {
      background: var(--pallete-primary-main) !important;

      .sp_dark & {
        background: #000 !important;
      }
    }

    .card-dragable::before {
      background: var(--pallete-primary-main) !important;
    }
    .card-dragable.inactive::before {
      background: #d4d4d4 !important;
    }
  }
  &.isdragging .card-dragable {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #dcbde7;
    transform: scale(1.02);

    .drag-dots {
      color: var(--pallete-primary-darker);
    }
  }
  & .sp__card {
    border-radius: 10px;
    border: 1px solid var(--pallete-colors-border);
    overflow: hidden;
  }
`;
const SortableItem = SortableElement<ISortableItem>(
  ({
    link,
    onDelete,
    Actions,
    edit,
    setEdit,
    sn,
    user,
    inlineForm,
    className,
    showDeleteIcon = true,
    showActiveToggle = true,
    showEditIcon = true,
    showAddPopIcon = false,
    TempLink = false,
  }: ISortableItem) => {
    const history = useHistory();
    const { onStatusToggel, onAddPop } = Actions;
    const { linkType, title, isActive, _id, popLinksId, imageURL } = link;
    const onEditHandler = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (inlineForm) {
        setEdit && setEdit(sn);
        return;
      }
      const qs =
        link.linkType === 'service'
          ? `&subType=${popLinksId?.popType}&mode=edit${
              showAddPopIcon ? `&temp=true` : ''
            }`
          : '&section=links';
      history.push(`/my-profile/link/${link._id}?type=${linkType}${qs}`);
    };
    const onAddPopHandler = async () => {
      onAddPop?.(link);
    };

    if (edit !== null && edit === sn) {
      const getValues = () => {
        if (linkType === 'service') {
          return popLinksId;
        }
        if (linkType === 'sectionTitle') {
          return { title, isActive, _id };
        }
        if (linkType === 'biography') {
          return user;
        }
        return link;
      };
      const { onSavePop, onSaveLink, UpdateUser } = Actions;
      return (
        <Li key={sn} className={className}>
          <EditableItem
            type={linkType as string}
            onCancel={() => setEdit(undefined)}
            onSubmit={(values: IPop | IUserLink) => {
              if (linkType === 'service') {
                onSavePop && onSavePop(values);
                return;
              }
              if (linkType === 'biography') {
                UpdateUser && UpdateUser(values);
                return;
              }
              onSaveLink && onSaveLink(values);
            }}
            value={getValues()}
          />
        </Li>
      );
    }
    if (linkType === 'service' && popLinksId?._id) {
      const {
        _id,
        title = '',
        popThumbnail,
        isThumbnailActive,
        popType,
      } = popLinksId;
      return (
        <Li key={sn} className={`${className} service`}>
          <CardDragable
            icon={
              popThumbnail && isThumbnailActive ? (
                <ImageModifications
                  imgeSizesProps={{
                    onlyMobile: true,
                  }}
                  src={popThumbnail}
                  alt="icon"
                />
              ) : (
                <GetPopIcon
                  type={popType}
                  primaryColor="var(--pallete-primary-main)"
                />
              )
            }
            _id={_id}
            title={title}
            active={isActive}
            onEdit={onEditHandler}
            onToggel={onStatusToggel}
            index={sn}
            showAddPopIcon={showAddPopIcon}
            showDeleteIcon={showDeleteIcon}
            showActiveToggle={showActiveToggle}
            showEditIcon={showEditIcon}
            onDelete={onDelete}
            TempLink={TempLink}
            onAddPop={onAddPopHandler}
            subTitle={LinkTypeName[popType as keyof typeof LinkTypeName]}
          />
        </Li>
      );
    }
    return (
      <Li key={sn} className={className}>
        <CardDragable
          _id={_id}
          title={title}
          active={isActive}
          onEdit={onEditHandler}
          onDelete={onDelete}
          onToggel={onStatusToggel}
          subTitle={LinkTypeName[linkType as keyof typeof LinkTypeName]}
          showDeleteIcon={showDeleteIcon}
          showActiveToggle={showActiveToggle}
          showEditIcon={showEditIcon}
          index={sn}
          icon={
            linkType === 'sectionTitle' ? (
              <Text />
            ) : linkType === 'contentBlock' ? (
              <ContentIcon />
            ) : linkType === 'biography' ? (
              <ProfileAvatar />
            ) : linkType === 'youtubeLink' ? (
              <Youtube />
            ) : imageURL ? (
              <ImageModifications
                imgeSizesProps={{
                  onlyMobile: true,
                }}
                src={imageURL}
                alt="icon"
              />
            ) : (
              <span className="icon-url"></span>
            )
          }
        />
      </Li>
    );
  },
);
export default SortableItem;
