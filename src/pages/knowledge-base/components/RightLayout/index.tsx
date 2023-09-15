import { ChevronLeft, ChevronRight } from 'assets/svgs';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useQuery from 'hooks/useQuery';
import HtmlReactParser from 'html-react-parser';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getSingleTopic } from 'store/reducer/topic';
import styled from 'styled-components';

interface MyComponentProps {
  className?: string;
}

const RightLayout: React.FC<MyComponentProps> = ({ className }) => {
  const { topicId: topic } = useQuery();
  const { knowledgeId } = useParams<{ knowledgeId: string }>();
  const history = useHistory();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentTopic = useAppSelector((state) => state.topic.currentTopic);
  const totalTopic = useAppSelector((state) => state.topic.totalTopic);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (topic) {
      setIsLoading(true);

      dispatch(getSingleTopic({ topicId: topic as string }))
        .catch(console.error)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [topic]);
  useEffect(() => {
    if (!!totalTopic?.length && topic) {
      const index = totalTopic.findIndex((i: any) => {
        return i === topic;
      });
      setCurrentIndex(index);
    }
  }, [totalTopic?.length, topic]);

  const parsedHtml = HtmlReactParser(currentTopic?.description || '<div/>');

  const addCustomClassToElements = (
    element: React.ReactNode,
  ): React.ReactNode => {
    if (React.isValidElement(element)) {
      const tag = element.type as string;
      const props = element.props;
      const children = props.children;
      if (
        tag === 'p' ||
        tag === 'h1' ||
        tag === 'h2' ||
        tag === 'a' ||
        tag === 'li'
      ) {
        return React.cloneElement(element, {
          className: `my-custom-style-${tag}`,
        } as React.HTMLAttributes<HTMLElement>);
      } else if (tag === 'ul') {
        const modifiedChildren = React.Children.map(children, (child) =>
          addCustomClassToElements(child),
        );
        return React.cloneElement(element, {
          className: `my-custom-style-${tag}`,
          children: modifiedChildren,
        } as React.HTMLAttributes<HTMLElement>);
      } else if (children) {
        return React.cloneElement(element, {
          children: React.Children.map(children, (child) =>
            addCustomClassToElements(child),
          ),
        } as React.HTMLAttributes<HTMLElement>);
      }
    }
    return element;
  };

  const modifiedHtml = React.Children.map(parsedHtml, (child) =>
    addCustomClassToElements(child),
  );
  return (
    <div className={`${className} right-panel`}>
      <Scrollbar>
        {currentTopic && (
          <div className="panel-head">
            <span className="title">
              <span className="heading-light">{currentTopic.title} - </span>
              <span className="page-num">Page {currentIndex + 1}</span>
            </span>
            <div className="arrows-holder">
              {totalTopic?.[currentIndex - 1] && (
                <div className="arrow">
                  <ChevronLeft
                    onClick={() => {
                      history.push(
                        `/knowledge-base/${knowledgeId}?${stringify({
                          topicId: totalTopic[currentIndex - 1],
                        })}`,
                      );
                    }}
                  />
                </div>
              )}
              {totalTopic?.[currentIndex + 1] && (
                <div className="arrow">
                  <ChevronRight
                    onClick={() =>
                      history.push(
                        `/knowledge-base/${knowledgeId}?${stringify({
                          topicId: totalTopic[currentIndex + 1],
                        })}`,
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="rich-text-holder">{modifiedHtml}</div>
        {isLoading && (
          <RequestLoader
            isLoading={true}
            width="28px"
            height="28px"
            color="var(--pallete-primary-main)"
          />
        )}
      </Scrollbar>
    </div>
  );
};

export default styled(RightLayout)`
  font-weight: 400;
  height: 100%;
  background-color: var(--pallete-background-default) !important;

  color: var(--pallete-text-main);
  .rich-text-holder p {
    background-color: var(--pallete-background-default) !important;

    color: var(--pallete-text-main);
  }
  .panel-head {
    padding: 10px 16px;
    border-bottom: 1px solid rgb(230, 235, 245);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 57px;
    font-weight: 400;

    .sp_dark & {
      border-bottom: 1px solid #353535;
    }
  }

  .heading-light {
    opacity: 0.6;
  }

  .arrows-holder {
    display: flex;
    align-items: center;

    .arrow {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pallete-text-main);
      opacity: 0.2;
      cursor: pointer;
      transition: all 0.4s ease;

      &:hover {
        opacity: 0.6;
      }

      path {
        fill: currentColor;
      }
    }
  }

  .rich-text-holder {
    padding: 39px 60px;
    font-size: 22px;
    line-height: 1.818;

    @media (max-width: 767px) {
      padding: 15px;
    }
  }

  .my-custom-style-p {
    opacity: 0.8;
    font-weight: 400;
    a {
      color: rgb(37, 91, 135);
      font-weight: 600;
      text-decoration: underline;
      transition: all 0.4s ease;

      .sp_dark & {
        color: #e51075;
      }

      &:hover {
        text-decoration: none;
      }
    }
  }

  .my-custom-style-h1 {
    font-size: 60px;
    line-height: 1.167;
    font-weight: 700;
  }

  .my-custom-style-h2 {
    font-size: 30px;
    line-height: 1.167;
    font-weight: 400;
  }

  ul.my-custom-style-ul {
    margin: 0;
    padding: 0 0 0 30px;
    list-style: none;

    li {
      padding: 0 0 0 40px;
      position: relative;
      list-style: none;

      &:hover {
        color: rgb(37, 91, 135);

        .sp_dark & {
          color: #e51075;
        }
      }

      &:before {
        position: absolute;
        left: 10px;
        top: 15px;
        content: '';
        border-width: 5px 0 5px 5px;
        border-color: transparent transparent transparent currentColor;
        border-style: solid;
      }
    }
  }

  .my-custom-style-a {
    color: rgb(37, 91, 135);
    font-weight: 600;
    text-decoration: underline;
    transition: all 0.4s ease;

    .sp_dark & {
      color: #e51075;
    }

    &:hover {
      text-decoration: none;
    }
  }
`;
