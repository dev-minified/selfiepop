import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { parseQuery } from 'util/index';

export default function useQuery(): ParsedUrlQuery {
  const query = useLocation().search;
  const [pQuery, setpQuery] = useState(parseQuery(query) || {});

  useEffect(() => {
    setpQuery(parseQuery(query));
  }, [query]);

  return pQuery;
}
