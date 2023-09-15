import { PlusFilled, Remove } from 'assets/svgs';
import Button from 'components/NButton';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const HeadingBlock = styled.div`
  .label-title {
    font-size: 15px;
    line-height: 18px;
    margin: 0 0 5px;
    color: var(--pallete-text-main);
    font-weight: 500;
  }

  .description-text {
    display: block;
    color: var(--pallete-text-main-300);
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main-300);
    font-weight: 400;
  }
`;

const TagList = styled.div`
  background: var(--pallete-background-default);
  border-radius: 6px;
  padding: 13px 10px;
  margin: 0 0 14px;
  border: 1px solid var(--pallete-background-pink);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  align-items: center;

  .tag {
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    color: #fff;
    background: var(--pallete-primary-darker);
    border-radius: 3px;
    display: block;
    margin: 5px;
    padding: 5px 30px 5px 10px;
    text-decoration: none;
    position: relative;
    text-transform: uppercase;
  }

  .tag .icon-close {
    width: 14px;
    height: 14px;
    color: #fff;
    position: absolute;
    right: 8px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 14px;
    line-height: 1;
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
    cursor: pointer;
  }

  .tag .icon-close:hover {
    /* background: #d7b3e3; */
  }

  .form-control {
    border: 0;
    font-size: 13px;
    line-height: 20px;
    padding: 5px 10px;
    height: 30px;
    border-radius: 0;
    border-left: 2px solid #d5d5d5;
    margin: 5px !important;
    width: 200px !important;

    &:focus {
      border-width: 2px !important;
    }
  }

  .form-control::-webkit-input-placeholder {
    color: var(--pallete-text-main-800);
  }

  .form-control:-ms-input-placeholder {
    color: var(--pallete-text-main-800);
  }

  .form-control::placeholder {
    color: var(--pallete-text-main-800);
  }

  @media (max-width: 767px) {
    .tag {
      font-size: 14px;
    }
  }
`;

const InlineTagger = ({
  name,
  value,
  onChange,
  title = 'Edit Your Tags',
  subtitle = 'Add your tags to the field below. Separate them by using commas ( , )',
  showAddButton = false,
  placeholder = 'Add New Tag',
  limit,
}: any) => {
  const [tags, setTags] = useState('');
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (value) setTags(value);
  }, [value]);

  // useEffect(() => {
  //   onChange && onChange({ target: { name, value: tags } });
  // }, [tags]);

  const onKeyPress = (e: React.KeyboardEvent<any>) => {
    const trimed = input.trim();
    if (e.key === 'Enter' || (e.key === ',' && trimed.length > 0)) {
      addTag(trimed);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const addTag = (value: string) => {
    if (value) {
      const found = tags
        .split(',')
        .find(
          (item: string) => item.trim().toLowerCase() === value.toLowerCase(),
        );
      if (found) return;
      if (limit != null) {
        if (tags.split(',').filter(Boolean).length >= limit) return;
      }

      const newtags = [...tags.split(','), value]
        .filter((tag: string) => tag.length !== 0)
        .join(',');
      setTags(newtags);
      onChange && onChange({ target: { name, value: newtags } });
      setInput('');
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<any>) => {
    const val = e.target.value.replaceAll(',', '');
    setInput(val);
  };
  const onDelete = (index: number) => {
    const tgs = tags
      .split(',')
      .filter((e: any, i: number) => i !== index)
      .join(',');

    setTags(tgs);
    onChange && onChange({ target: { name, value: tgs } });
  };

  const tagsArray =
    tags
      ?.split(',')
      ?.map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length !== 0) || [];
  return (
    <div className="tags-area">
      <HeadingBlock className="label-area mb-20">
        <div className="label-title pb-0">{title}</div>
        <span className="description-text">{subtitle}</span>
      </HeadingBlock>
      <TagList className="tagslist mb-35">
        {tagsArray.map((item: string, index: number) => (
          <span key={index} className="tag">
            {item}{' '}
            <span className="icon-close" onClick={() => onDelete(index)}>
              <Remove />
            </span>
          </span>
        ))}

        {tagsArray.length < 10 && (
          <input
            className="form-control"
            type="text"
            placeholder={placeholder}
            value={input}
            name={name}
            onChange={onChangeHandler}
            onKeyPress={onKeyPress}
          />
        )}
        {showAddButton && (
          <Button
            type="text"
            icon={<PlusFilled />}
            onClick={() => addTag(input.trim())}
          />
        )}
      </TagList>
    </div>
  );
};

export default InlineTagger;
