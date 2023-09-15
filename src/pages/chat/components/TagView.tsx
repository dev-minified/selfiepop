import { addTag, deleteTag } from 'api/ChatSubscriptions';
import { PlusFilled, Tag as TagIcon } from 'assets/svgs';
import FouseInput from 'components/focus-input';
import Tag from 'components/Tag';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useEffect, useState } from 'react';
import { updateTags } from 'store/reducer/chat';
import { appendTagInSub } from 'store/reducer/salesState';
import styled from 'styled-components';
interface Props {
  className?: string;
  sub: ChatSubsType;
  isBuyer?: boolean;
  user?: ChatUserType;
  managedAccountId?: string;
}

function TagView({
  className,
  sub,
  isBuyer,
  managedAccountId,
}: Props): ReactElement {
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagsUpdate, setTagsUpdate] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTags(sub?.tags || []);
  }, [sub]);

  const handleAddTag = async () => {
    if (tag.trim() !== '') {
      const stags = [...(tags || [])];
      const isAlreadyExist = tags.find(
        (t) => t.toLowerCase().trim() === tag.toLowerCase().trim(),
      );
      if (isAlreadyExist) return;
      const newTags = [...stags, tag];
      setTags(newTags);
      setTag('');
      await addTag(sub._id, {
        value: tag,
        sellerId: managedAccountId,
      })
        .then(() => {
          dispatch(appendTagInSub({ _id: sub._id, tag }));
          dispatch(
            updateTags({
              ...sub,
              tags: newTags,
            }),
          );
        })
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
          }
          // const updatedTags = newTags.filter((t) => t !== tag);
          setTags(stags);
          console.log(e);
        });
    }
  };

  const handleDelete = async (tag: string) => {
    if (sub?._id) {
      setTagsUpdate(false);
      const newTags = [...tags];
      const updatedTags = newTags.filter((t) => t !== tag);
      setTags(updatedTags);
      await deleteTag(sub._id, {
        value: tag,
        sellerId: managedAccountId,
      })
        .then(() => {
          dispatch(
            updateTags({
              ...sub,
              tags: [...updatedTags],
            }),
          );
          setTagsUpdate(true);
        })
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
          }
          setTags([...newTags]);
        });
    }
  };

  return (
    <div className={className}>
      <div className="title">
        <span className="icon">
          <TagIcon />
        </span>
        Tags
      </div>
      <div className="tag_list">
        {tags.map((t) => (
          <Tag
            key={t}
            label={t}
            closeAble={tagsUpdate}
            checked={!isBuyer}
            onClose={handleDelete}
          />
        ))}
      </div>

      {!isBuyer && (
        <div className="input-field">
          <FouseInput
            label="Add a Tag"
            type="text"
            materialDesign
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
            icon={
              <span onClick={handleAddTag}>
                <PlusFilled />
              </span>
            }
          />
        </div>
      )}
    </div>
  );
}

export default styled(TagView)`
  padding: 14px 15px 0;
  background: var(--pallete-background-default);
  border-radius: 5px;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  border: 2px solid var(--pallete-colors-border);
  .tag_list {
    margin: 0 0 20px;
    > label {
      margin: 0 12px 10px 0;
    }
    .label-text {
      background: var(--pallete-primary-main);
      /* padding: 4px 10px; */
    }

    /* .tag_close_icon {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      margin: -2px 0 0 4px;
      transform: none;
      right: auto;
      top: auto;
    } */
  }
  .title {
    font-size: 14px;
    line-height: 17px;
    color: var(--pallete-primary-main);
    position: relative;
    padding: 0 0 0 30px;
    margin: 0 0 15px;
    .icon {
      position: absolute;
      left: 0;
      top: 0;
    }
    path {
      fill: currentColor;
    }
  }
  .input-field {
    .icon {
      width: 18px;
      color: var(--pallete-primary-main);
    }
  }
`;
