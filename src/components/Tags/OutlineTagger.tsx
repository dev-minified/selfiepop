import { defaultTags } from 'appconstants';
import { Cancel, PlusFilled } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import useKeyPressListener from 'hooks/useKeyPressListener';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const AddTag = styled.div`
  overflow: hidden;

  .tags-row {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row wrap;
    flex-flow: row wrap;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: flex-start;
    -ms-flex-pack: flex-start;
    justify-content: flex-start;
    margin: 0 -5px 21px;
  }

  .tag {
    margin: 0 5px 10px;

    .text {
      background: #e0e1e2;
      border: none !important;
      color: var(--pallete-text-main-450);
      font-size: 13px;
      line-height: 18px;
      padding: 5px 16px;
      font-weight: 500;
      -webkit-transition: all 0.25s ease-in-out;
      transition: all 0.25s ease-in-out;
      border-radius: 35px;
      display: block;
      cursor: pointer;
      text-transform: uppercase;
      &:hover {
        background: var(--pallete-primary-main);
        color: #fff;
      }
    }

    svg {
      display: inline-block;
      vertical-align: middle;
      width: 16px;
      height: auto;
      margin: 0 -10px 0 10px;

      @media (max-width: 767px) {
        margin: 1px -5px 0 5px;
        vertical-align: top;
      }
    }
    input[type='checkbox'] {
      opacity: 0;
      visibility: hidden;
      position: absolute;

      &:checked + .text {
        color: #fff;
        background: var(--pallete-primary-main);
      }
    }
  }

  .input-wrap .btn.btn-primary {
    font-size: 16px;
    line-height: 20px;
    position: absolute;
    right: 6px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    min-width: 125px;
    border-radius: 3px;
  }

  .input-wrap .btn.btn-primary .icon-plus {
    font-size: 14px;
    line-height: 1;
    font-weight: 400;
    margin: 0 5px 0 0;
  }

  @media (max-width: 767px) {
    .tags-row {
      margin: 0 -3px 20px;
    }

    .tag {
      margin: 0 3px 6px;
      font-size: 13px;
      line-height: 18px;
    }

    .tag .text {
      padding: 5px 10px;
    }

    .input-wrap .btn.btn-primary {
      font-size: 14px;
    }
  }

  .button-icon-only {
    background: none;

    &:hover {
      background: none;
    }
  }
`;

type Props = {
  selectedTags?: string;
  onChange?(tags: string): void;
  selectionLimit?: number | null;
  defaultTags?: { label: string; value: string; selected: boolean }[];
  alwaysShowInput?: boolean;
  placeholder?: string;
  disableSelection?: boolean;
};

const OutlineTagger: React.FC<Props> = (props) => {
  const {
    selectedTags,
    onChange,
    selectionLimit = 3,
    alwaysShowInput,
    placeholder,
    disableSelection,
  } = props;
  const [tags, setTags] = useState(props.defaultTags || defaultTags);
  const [input, setInput] = useState('');

  useEffect(() => {
    const tagsList = selectedTags?.split(',') || [];
    const newTags = [...tags];
    tagsList.forEach((t) => {
      const tag = t.trim();
      const tagIndex = newTags.findIndex((t) => t.value === tag);
      if (tagIndex > -1) {
        newTags[tagIndex].selected = true;
      } else if (tag) {
        newTags.push({ label: tag, value: tag, selected: true });
      }
    });
    setTags(newTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  const onSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disableSelection) {
      return;
    }
    if (
      e.target.value.toLocaleLowerCase() !== 'other' &&
      e.target.checked &&
      selectionLimit !== null &&
      tags.filter((tag) => {
        if (tag.value.toLocaleLowerCase() !== 'other' && tag.selected) {
          return true;
        }
        return false;
      }).length >= selectionLimit
    ) {
      toast.error('Maximum 3 tags can be selected');
      return;
    }

    const newTags = tags.map((tag) =>
      tag.value === e.target.value
        ? { ...tag, selected: e.target.checked }
        : tag,
    );
    setTags(newTags);

    onChange?.(
      newTags
        .filter((tag) => tag.selected)
        .map((tag) => tag.value)
        .join(),
    );
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const addTag = () => {
    if (input.trim()) {
      const mselectedTags = tags.filter((tag) => {
        if (tag.value.toLocaleLowerCase() !== 'other' && tag.selected) {
          return true;
        }
        return false;
      });
      const newTags = [...tags];
      const tag = newTags.find((t) => t.value === input.trim().toLowerCase());
      !tag &&
        newTags.push({
          label: input,
          value: input.trim(),
          selected:
            selectionLimit === null ||
            (mselectedTags?.length || 0) < selectionLimit - 1
              ? true
              : false,
        });
      setTags(newTags);
      setInput('');

      onChange?.(
        newTags
          .filter((tag) => tag.selected)
          .map((tag) => tag.value)
          .join(),
      );
    }
  };

  const isOtherSelected = tags.find(
    (tag) => tag.value.toLowerCase() === 'other',
  )?.selected;

  useKeyPressListener(addTag);

  return (
    <AddTag className="addtags">
      <div className="tags-row">
        {tags?.map((tag) => (
          <label key={tag.value} className="tag">
            <input
              onChange={onSelectionChange}
              name="tags"
              type="checkbox"
              value={tag.value}
              checked={tag.selected}
            />
            <span className="text">
              {tag.label}
              {tag.selected && (
                <span>
                  <Cancel />
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      <div className="input-wrap mb-30 mb-md-50">
        {(isOtherSelected || alwaysShowInput) && (
          <FocusInput
            id="tag"
            materialDesign
            name="tag"
            label={placeholder ?? 'Other'}
            value={input}
            onChange={onInputChange}
            icon={
              <Button
                type="text"
                shape="circle"
                icon={<PlusFilled />}
                onClick={addTag}
              />
            }
            hasIcon
          />
        )}
      </div>
    </AddTag>
  );
};

export default OutlineTagger;
