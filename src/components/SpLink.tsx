import { ReactNode } from 'react';
import { Link, LinkProps, matchPath, useHistory } from 'react-router-dom';
type ILinkCompoennt = LinkProps & {
  children: ReactNode;
  className?: string;
  exact?: boolean;
  [key: string]: any;
};
const SPLink = (props: ILinkCompoennt) => {
  const { children, to, className, exact = true, ...rest } = props;
  const history = useHistory();
  const ismatched = matchPath(history.location.pathname, {
    path: to as string,
    exact: exact,
    strict: false,
  });
  return (
    <Link
      to={to}
      className={className + `${ismatched ? ' active' : ''}`}
      {...rest}
    >
      {children}
    </Link>
  );
};
export default SPLink;
