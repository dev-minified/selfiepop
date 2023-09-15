import styled from 'styled-components';
interface IPostCaption {
  className?: string;
  postText?: string;
}

const PostCaption: React.FunctionComponent<IPostCaption> = ({
  className,
  postText,
}) => {
  return (
    <div className={className}>
      <div>
        <pre>{postText}</pre>
      </div>
    </div>
  );
};

export default styled(PostCaption)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: var(--pallete-text-main-100);
  padding: 0 0 10px;

  div {
    margin: 0 0 10px;
  }

  pre {
    font-family: 'Roboto', sans-serif;
    font-size: 100%;
    overflow: hidden;
    white-space: pre-wrap;
    margin: 0;
  }
`;
