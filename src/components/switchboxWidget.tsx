import { HorizontalDotsForVerification } from 'assets/svgs';
import classNames from 'classnames';
import Switchbox from './switchbox';

export default function SwitchboxWidget(props: any) {
  const classes = props.classes || 'mb-20';
  const {
    icon = true,
    rightTitle = '',
    showSwitchBox = true,
    processing = false,
  } = props;
  return (
    <div
      className={classNames(
        'toggle-widget',
        { inactive: !props.enabled },
        classes,
      )}
    >
      <strong className="title">
        {props.label ? `Activate this ${props.label}?` : props.title}
      </strong>
      {showSwitchBox ? (
        <Switchbox size="small" value={props.enabled} {...props} />
      ) : null}
      {icon ? (
        <span className="icon">
          {props.enabled ? (
            <span className={`show ${props.showicon || 'icon-tick'}`}></span>
          ) : processing ? (
            <HorizontalDotsForVerification
              className={`show ${props.showicon}`}
            />
          ) : (
            <span className={`hide ${props.hideicon || 'icon-close'}`}></span>
          )}
        </span>
      ) : null}
      {rightTitle ? (
        <strong className="title rightTitle">{rightTitle}</strong>
      ) : null}
    </div>
  );
}
