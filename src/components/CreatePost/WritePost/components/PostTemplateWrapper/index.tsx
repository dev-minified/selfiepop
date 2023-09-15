import { getPostTemplates } from 'api/PostTemplate';
import TemplateModal from 'components/TemplateModal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { editedPostTemplate } from 'store/reducer/member-post';

interface IPostTemplateModalWrapper {
  className?: string;
  managedAccountId?: string;
  isOpen: boolean;
  onClose: () => void;
}
const PostTemplateModalWrapper: React.FC<IPostTemplateModalWrapper> = (
  props,
) => {
  const { className, isOpen, onClose, managedAccountId } = props;
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedPostTemplate,
  );
  const [selectedTemplate, setSelectedTemplate] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postTemplate, setPostTemplate] = useState<any>({
    items: [],
    totalCount: 0,
  });
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getPostTemplates({
        limit: 50,
        sellerId: managedAccountId,
        sort: 'createdAt',
        order: -1,
      })
        .then((res) => {
          setPostTemplate({
            items: res?.items,
            totalCount: res?.totalCount,
          });
        })
        .catch(console.log)
        .finally(() => setIsLoading(false));
      return () => {
        setPostTemplate({
          items: [],
          totalCount: 0,
        });
      };
    }
  }, [isOpen, managedAccountId]);
  const loadMore = useCallback(() => {
    if (postTemplate.totalCount !== 0) {
      if (postTemplate.totalCount === postTemplate?.items?.length) {
        return;
      }
    }
    setIsLoading(true);
    getPostTemplates({
      skip: postTemplate?.items?.length,
      sellerId: managedAccountId,
      sort: 'createdAt',
      order: -1,
    })
      .then((res) => {
        setPostTemplate((val: any) => {
          return {
            items: [...val.items, ...res?.items],
            totalCount: res?.totalCount,
          };
        });
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managedAccountId, postTemplate?.items?.length]);
  const oK = () => {
    if (selectedTemplate) {
      dispatch(
        editedPostTemplate({
          ...(selectedTemplate as IPost),
          template_id: selectedTemplate?._id,
        }),
      );
      setSelectedTemplate(null);
    }
    onClose();
  };
  return (
    <TemplateModal
      className={className}
      onClick={(item: any) => {
        if (item?._id === selectedTemplate?._id) {
          setSelectedTemplate(null);
          return;
        }
        setSelectedTemplate(item as IPost);
      }}
      checked={selectedTemplate?._id || selectedPost?._id || ''}
      title="POST TEMPLATES"
      templates={postTemplate?.items as IPost[]}
      mediaKey="media"
      isLoading={isLoading}
      oK={oK}
      loadMore={loadMore}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default PostTemplateModalWrapper;
