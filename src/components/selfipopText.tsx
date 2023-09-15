import styled from 'styled-components';

const SelfiepopText = ({
  className,
  text = 'selfiepop™',
  platform = ' app',
}: {
  className?: string;
  text?: string;
  platform?: string;
}) => {
  return (
    <>
      <span className={`${className} app-text`}>{text}</span> {platform}
    </>
  );
};

export default styled(SelfiepopText)`
  &.app-text {
    margin: 0 !important;
    padding: 0;
    font-style: italic;
    display: inline-block;
  }
`;
