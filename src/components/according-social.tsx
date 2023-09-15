import { FC, ReactElement, ReactNode } from 'react';
import { Collapse as ReactCollapse } from 'react-collapse';
import 'styles/rc-accordion.css';
import useOpenClose from '../hooks/useOpenClose';
interface Props {
  title: string;
  icon?: string | ReactElement;
  percent?: number | string;
  children?: ReactNode;
}

const According: FC<Props> = ({ title, icon, percent = 0, children }) => {
  // tslint:disable-next-line: react-hooks-nesting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, onOpen, OnClose, onToggel] = useOpenClose();

  return (
    <div className={`rc-according-social  ${isOpen && 'open'}`}>
      <div className="rc-header" onClick={onToggel}>
        <span className="social--icon">
          {icon ? (
            typeof icon === 'string' ? (
              <img src={icon} alt={icon} />
            ) : (
              icon
            )
          ) : (
            <span className="icon-star1"></span>
          )}
        </span>
        <div className="wrap">
          <div className="title-wrap">
            <strong className="title">{title}</strong>
          </div>
        </div>
        <div className="left-part">{percent}%</div>
      </div>
      <ReactCollapse isOpened={isOpen}>
        <div className="content">{children}</div>
      </ReactCollapse>
    </div>
  );
};

export default According;
