import { Link } from 'react-router-dom';

export interface IAppProps {
  breadCrumbs: any[];
}

export default function BreadCrumbs(props: IAppProps) {
  if (!(props.breadCrumbs?.length > 0)) return null;

  return (
    <ul className="breadcrumbs">
      {props.breadCrumbs.map((item: any, index: number) => {
        if (props.breadCrumbs.length === index + 1) {
          return <li key={index}>{item.title}</li>;
        }
        if (item.auto) {
          return (
            <li key={index}>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  window.history.go(index + 1 - props.breadCrumbs.length);
                }}
              >
                {item.title}
              </span>
            </li>
          );
        }
        return (
          <li key={index}>
            <Link to={item.path}>
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
