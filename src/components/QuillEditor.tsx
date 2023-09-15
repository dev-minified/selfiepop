import { getOrdersList } from 'api/Order';
import 'quill-mention';
import 'quill-mention/dist/quill.mention.css';
import { forwardRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
interface props {
  className?: string;
  DraftData?: any;
  value?: any;
  toolbar?: boolean;
  mention?: boolean;
  onKeyUp?: Function;
  defaultMention?: { id: string; value: string; denotationChar?: '@' | '#' };
  mentions?: { id: string; value: string }[];
  bindings?: Record<string, any>;
  placeholder?: string;
}
const modules: any = {
  toolbar: [
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['bold', 'italic'],
    ['clean'],
  ],
};

const formats = ['bold', 'italic', 'list', 'bullet', 'link', 'mention'];
modules.mention = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['@', '#'],
  defaultMention: '@',
  renderLoading: () => {
    return 'Loading...';
  },
  source: async function (searchTerm: string, renderList: any) {
    if (searchTerm.length === 0) {
      renderList(await suggestPeople(searchTerm), searchTerm);
    } else {
      const matches = await suggestPeople(searchTerm);

      renderList(matches, searchTerm);
    }
  },
};
const suggestPeople = async (searchTerm: string) => {
  return getOrdersList({
    name: searchTerm,
    limit: 100,
  })
    .then((data) => {
      return data?.items?.map((i: any) => {
        if (i?.buyerId?.pageTitle) {
          return {
            value: `${i?.buyerId?.pageTitle}`,
            id: i?.buyerId?._id,
          };
        }
        return {
          value: i?.buyerId?.username,
          id: i?.buyerId?._id,
        };
      });
    })
    .catch(() => {
      return [];
    });
};
const QuillDraftEditor = forwardRef(
  (
    {
      className,
      DraftData,
      value,
      toolbar = true,
      mention = false,
      defaultMention,
      onKeyUp,
      bindings = {},
      placeholder = 'Enter your Comment',
    }: props,
    ref: any,
  ) => {
    const [editorState, setEditorState] = useState(value);
    const handleChange = (Quillvalue: any) => {
      setEditorState(() => Quillvalue);
      DraftData({ editorState: Quillvalue });
    };

    useEffect(() => {
      setEditorState(value);
    }, [value]);
    useEffect(() => {
      if (ref && ref?.current) {
        ref?.current.focus();
        if (defaultMention?.id) {
          const mquill = (ref?.current as any)?.editor?.getModule('mention');
          mquill.insertItem(
            {
              ...defaultMention,
              denotationChar: defaultMention?.denotationChar || '@',
            },
            true,
          );
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultMention]);
    if (!mention) {
      delete modules.mention;
    }
    if (!toolbar) {
      modules.toolbar = toolbar;
    }
    if (bindings) {
      const keys = Object.keys(bindings || {});
      keys.forEach((e) => {
        modules[e] = bindings[e];
      });
    }

    return (
      <div
        className={`${className}  pop-card mb-35`}
        suppressContentEditableWarning={true}
      >
        <ReactQuill
          ref={ref}
          value={editorState}
          onKeyUp={onKeyUp}
          onChange={handleChange}
          defaultValue={value}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
    );
  },
);
export default styled(QuillDraftEditor)`
  .ql-editor {
    resize: vertical;
    width: 100%;
    border: none;
    padding: 0px 5px;
    min-height: 150px;
  }
  .ql-mention-list {
    max-height: 300px;
    overflow-y: auto;
  }
  .ql-formats {
    float: right;
  }
  .ql-container {
    padding: 5px;
  }
`;
