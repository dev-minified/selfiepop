import { getChatTemplates } from 'api/PostTemplate';
import TemplateModal from 'components/TemplateModal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useCallback, useEffect, useState } from 'react';
import { setTemplateMessage } from 'store/reducer/chat';
import styled from 'styled-components';
import { getSortbyParam } from 'util/index';

interface IScheduleTemplateWrapper {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  managedAccountId?: string;
}

const ScheduleTemplateWrapper: React.FC<IScheduleTemplateWrapper> = (props) => {
  const dispatch = useAppDispatch();

  const selectedMessage = useAppSelector((state) => state.chat.templateMessage);

  const { className, isOpen, onClose, managedAccountId } = props;
  const [MessageTemplate, seMessageTemplate] = useState<any>({
    items: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Message | null>(
    null,
  );
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getChatTemplates({
        limit: 50,
        sort: getSortbyParam('createdAt'),
        sellerId: managedAccountId,
      })
        .then((res) => {
          seMessageTemplate({
            items: res?.items,
            totalCount: res?.totalCount,
          });
        })
        .catch(console.log)
        .finally(() => setIsLoading(false));
      return () => {
        seMessageTemplate({
          items: [],
          totalCount: 0,
        });
      };
    }
  }, [isOpen, managedAccountId]);
  const loadMore = useCallback(() => {
    setIsLoading(true);
    getChatTemplates({
      skip: MessageTemplate?.items?.length,
      sellerId: managedAccountId,
    })
      .then((res) => {
        seMessageTemplate((val: any) => {
          return {
            items: [...val.items, ...res?.items],
            totalCount: res?.totalCount,
          };
        });
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, [MessageTemplate?.items?.length, managedAccountId]);
  const oK = () => {
    if (selectedTemplate) {
      dispatch(setTemplateMessage({ ...(selectedTemplate as any) }));
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
        setSelectedTemplate(item as Message);
      }}
      checked={selectedTemplate?._id || selectedMessage?._id || ''}
      title="POST TEMPLATES"
      templates={MessageTemplate?.items}
      mediaKey="messageMedia"
      isLoading={isLoading}
      oK={oK}
      loadMore={loadMore}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default styled(ScheduleTemplateWrapper)``;
