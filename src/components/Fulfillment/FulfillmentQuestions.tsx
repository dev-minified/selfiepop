import { ImageThumbnail, VideoThumbnail } from 'assets/svgs';
import React from 'react';
import styled from 'styled-components';
import UploadItem from './UploadItem';

interface Props {
  title?: string;
  questions?: any[];
}

const Questions = styled.div`
  h4 {
    font-weight: 500;
    margin: 0 0 34px;
  }

  h5 {
    font-weight: 500;
    margin: 0 0 7px;
  }

  .question-item {
    position: relative;
    overflow: hidden;
    margin: 0 0 12px;

    p {
      color: var(--pallete-text-main-300);
      margin: 0 0 8px;
    }
  }
`;

const FulfillmentQuestions: React.FC<Props> = (props) => {
  const { title, questions = [] } = props;
  return (
    <Questions>
      <h4>{title}</h4>
      {questions?.map((question: any, idx: number) => {
        let ans;
        switch (question?.responseType) {
          case 'text':
          case 'long-text':
            ans = <p>{question.responseValue}</p>;
            break;
          case 'selectList':
            ans = (
              <p>
                {question?.responseOptions
                  .filter((ro: any) => ro.value)
                  .map((v: any) => v.text)
                  .join(',')}
              </p>
            );
            break;
          case 'file':
            ans = (
              <>
                {question.attachements?.map(
                  (attachment: any, index: number) => (
                    <UploadItem
                      key={index}
                      title={attachment.name}
                      url={attachment.url}
                      tag={
                        attachment.size
                          ? `${(attachment.size / 1000 / 1000).toFixed(3)} MB`
                          : undefined
                      }
                      icon={
                        attachment.type === 'video' ? (
                          <VideoThumbnail />
                        ) : (
                          <ImageThumbnail />
                        )
                      }
                    />
                  ),
                )}
              </>
            );
            break;
          default:
            ans = <></>;
        }
        return (
          <div className="question-item" key={idx}>
            <h5>{question.title}</h5>
            {ans}
          </div>
        );
      })}
    </Questions>
  );
};

export default FulfillmentQuestions;
