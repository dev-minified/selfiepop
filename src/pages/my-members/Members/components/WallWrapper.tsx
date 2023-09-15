import MyWall from 'pages/Sales/MyWall';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';

interface Props {
  className?: string;
  buyerId?: string;
  sellerId?: string;
}
// const PAGE_LIMIT = 10;

const WallWrapper = ({ className }: Props) => {
  // const dispatch = useAppDispatch();
  // const cancelToken = useRef<any>();

  // useEffect(() => {
  //   cancelToken.current = axios.CancelToken.source();
  //   const paramsList: any = {
  //     skip: 0 * PAGE_LIMIT,
  //     limit: PAGE_LIMIT,
  //     sort: getSortbyParam('publishAt'),
  //     order: 'desc',
  //     buyerId: buyerId,
  //   };

  //   getPaginatedPosts(paramsList, () => {}, sellerId).catch((e) =>
  //     console.log(e),
  //   );
  //   return () => {
  //     cancelToken.current.cancel('Operation canceled due to Unmount.');
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [buyerId, sellerId]);

  // const getPaginatedPosts = useCallback(
  //   async (
  //     params: Record<string, any> = {},
  //     callback?: (...args: any) => void,
  //     buyerId?: string,
  //   ) => {
  //     console.log({ buyerId });
  //     if (buyerId) {
  //       return dispatch(
  //         userPostsList({
  //           params: { ...params },
  //           userId: buyerId,
  //           callback,
  //           customError: { ignoreStatusCodes: [404] },
  //         }),
  //       );
  //     }
  //   },
  //   [dispatch],
  // );

  return (
    <MyWall
      createPost={false}
      backButton={false}
      className={`memberbuyerWall ${className}`}
      showAttachmentViwe={isMobileOnly}
    />
  );
};

export default styled(WallWrapper)`
  .post-card {
    margin-left: 15px;
    margin-right: 15px;

    padding: 15px;
  }
  &.memberbuyerWall {
    /* padding-top: 0 !important; */
    margin-top: 0 !important;

    .post-scrollerparant {
      /* height: calc(100vh - 160px); */
      height: 100%;
      margin: 0;

      @media (max-width: 767px) {
        height: calc(100vh - 258px);
      }

      .posts-wrap {
        padding-top: 0;
        padding-bottom: 0;
        /* max-width: 687px; */
        margin: 0 auto;
        @media (max-width: 767px) {
          padding-bottom: 15px;
        }
      }
    }
  }
`;
