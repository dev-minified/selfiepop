import { getChatTemplates, getScheduleTemplates } from 'api/PostTemplate';
import TemplateModal from 'components/TemplateModal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { setTemplateMessage } from 'store/reducer/chat';
interface IChatTemplateModalWrapper {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  managedAccountId?: string;
  scheduleMode?: boolean;
}
const ChatTemplateModalWrapper: React.FC<IChatTemplateModalWrapper> = (
  props,
) => {
  const dispatch = useAppDispatch();

  const selectedMessage = useAppSelector((state) => state.chat.templateMessage);

  const { className, isOpen, onClose, managedAccountId, scheduleMode } = props;
  const [MessageTemplate, seMessageTemplate] = useState<any>({
    items: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<ChatMessage | null>(
    null,
  );
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const funcAsync = scheduleMode ? getScheduleTemplates : getChatTemplates;
      funcAsync({
        limit: 50,
        sort: 'createdAt',
        order: -1,
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
  }, [isOpen, managedAccountId, scheduleMode]);
  const loadMore = useCallback(() => {
    if (MessageTemplate.totalCount !== 0) {
      if (MessageTemplate.totalCount === MessageTemplate?.items?.length) {
        return;
      }
    }
    setIsLoading(true);
    const funcAsync = scheduleMode ? getScheduleTemplates : getChatTemplates;
    funcAsync({
      skip: MessageTemplate?.items?.length,
      sellerId: managedAccountId,
      sort: 'createdAt',
      order: -1,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MessageTemplate?.items?.length, managedAccountId, scheduleMode]);
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
        setSelectedTemplate(item as ChatMessage);
      }}
      sumbitTitle={'USE THIS MESSAGE'}
      checked={selectedTemplate?._id || selectedMessage?._id || ''}
      title="MESSAGE TEMPLATES"
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

export default ChatTemplateModalWrapper;
