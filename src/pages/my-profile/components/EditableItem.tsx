import InlinePopFrom from 'components/InlinePopForm';
import LinkWidget from 'components/LinkWidget';
import { RequestLoader } from 'components/SiteLoader';
import { useAnimationEndHook } from 'hooks/useAnimationEndHook';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { ReactElement, useCallback } from 'react';
import { addPreviewPop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import BiographyCard from './BiographyCard';
import ContentBlockCard from './ContentBlockCard';
import SectionTitleCard from './SectionTitleCard';
import SocialLinksWidget from './SocialLinksWidget';
import YoutubeCard from './YoutubeCard';

interface Props {
  type?: string;
  value?: any;
  onCancel?: any;
  onSubmit?: any;
  className?: string;
  title?: string;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  socialLinks?: SocialLink[];
  onDelete?(): void;
  isAnimationCompleted?: boolean;
  service?: any;
}

function EditableItem({
  type,
  value,
  onCancel,
  onSubmit,
  className,
  onDelete,
  service,
  isAnimationCompleted,
  ...rest
}: Props): ReactElement {
  const { user } = useAuth();
  const popId = useAppSelector((state) => state.popslice.previewPop._id);
  const dispatch = useAppDispatch();
  const setPop = useCallback(() => {
    if (type === 'service' && !popId) {
      dispatch(addPreviewPop({ ...service }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?._id]);
  const { isAnimationEnd } = useAnimationEndHook({
    isAnimationEnd: isAnimationCompleted,
    otherProps: value?._id,
    callback: setPop,
  });

  if (!isAnimationEnd) {
    return (
      <RequestLoader
        isLoading={true}
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
    );
  }
  if (type === 'service') {
    return (
      <div className={className}>
        <InlinePopFrom
          onCancel={onCancel}
          value={value}
          onSubmit={onSubmit}
          onDeleteClick={onDelete}
          {...rest}
        />
      </div>
    );
  }
  if (type === 'socialLinks') {
    return (
      <div className={className}>
        <SocialLinksWidget
          onCancel={onCancel}
          user={user}
          value={value}
          onSubmit={onSubmit}
          {...rest}
        />
      </div>
    );
  }
  if (type === 'sectionTitle') {
    return (
      <div className={className}>
        <SectionTitleCard
          onCancel={onCancel}
          value={value}
          onSubmit={onSubmit}
          onDeleteClick={onDelete}
          {...rest}
        />
      </div>
    );
  }

  if (type === 'contentBlock') {
    return (
      <div className={className}>
        <ContentBlockCard
          onCancel={onCancel}
          value={value}
          onSubmit={onSubmit}
          onDeleteClick={onDelete}
          {...rest}
        />
      </div>
    );
  }

  if (type === 'youtubeLink') {
    return (
      <div className={className}>
        <YoutubeCard
          onCancel={onCancel}
          value={value}
          onSubmit={onSubmit}
          onDeleteClick={onDelete}
          {...rest}
        />
      </div>
    );
  }
  if (type === 'biography') {
    return (
      <div className={className}>
        <BiographyCard
          onCancel={onCancel}
          value={{ ...user, ...value }}
          onSubmit={onSubmit}
          onDeleteClick={onDelete}
          {...rest}
        />
      </div>
    );
  }
  return (
    <div className={className}>
      <LinkWidget
        onCancel={onCancel}
        onSave={onSubmit}
        Link={value}
        onDeleteClick={onDelete}
        {...rest}
      />
    </div>
  );
}

export default styled(EditableItem)`
  .header .icon {
    border-radius: 100%;
    overflow: hidden;
  }
  .custom-thumb-pop .social--icon svg {
    width: 100%;
    height: 100%;
    border-radius: 100%;

    &.img-chat {
      max-width: 30px;
    }
  }
`;
