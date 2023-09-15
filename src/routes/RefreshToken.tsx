import { useAppDispatch } from 'hooks/useAppDispatch';
import { useEffect } from 'react';
// import { Cookies } from 'react-cookie';
import { setGuestUser, setGuestUserTokens } from 'store/reducer/checkout';
import { getLocalStorage } from 'util/index';
// import { totalRequestSending } from 'util/request';

// let refreshInterval: ReturnType<typeof setInterval>;
// const cookies = new Cookies();
const RefreshToken = () => {
  const dispatch = useAppDispatch();
  //   const refreshAuthToken = () => {
  //     try {
  //       const token = user?._id ? cookies.get('token') : gstUser.token;
  //       const refreshToken = user?._id
  //         ? cookies.get('refreshToken')
  //         : gstUser.refreshToken;
  //       const allowTosend =
  //         token && !!(user?._id || gstUser?.data?._id) && !totalRequestSending;
  //       if (allowTosend) {
  //         const jwtToken = decodeJWT(token) as any;
  //         const jwtExpires = dayjs(jwtToken.exp * 1000).diff(
  //           dayjs(),
  //           // 'hours',
  //           'minutes',
  //         );
  //         if (jwtExpires < 5) {
  //           (window as any).isRefreshRequestSending = true;
  //           spRefreshToken({
  //             token,
  //             refreshToken,
  //             onSuccessCallbak: (response) => {
  //               const isGuestUser = !user?._id;
  //               if (isGuestUser) {
  //                 dispatch(
  //                   setGuestUser({
  //                     ...gstUser,
  //                     token: response.data?.token,
  //                     refreshToken: response.data?.refreshToken,
  //                   }),
  //                 );
  //                 setTimeout(() => {
  //                   (window as any).isRefreshRequestSending = false;
  //                 }, 500);

  //                 return;
  //               }
  //               // !isGuestUser &&
  //               //   setToken(response?.data?.token, response?.data?.refreshToken);
  //               setTimeout(() => {
  //                 (window as any).isRefreshRequestSending = false;
  //               }, 700);
  //             },
  //             onErrorCallback: () => {},
  //             options: {
  //               loggedIn: !!user?._id,
  //             },
  //           });
  //         }
  //       }
  //       // const expiration =
  //       //   jwtToken.exp < (new Date().getTime() + 1) / 1000;
  //     } catch (error) {}
  //   };
  //   useEffect(() => {
  //     clearInterval(refreshInterval);
  //     refreshInterval = setInterval(() => {
  //       refreshAuthToken();
  //     }, 5000);
  //     return () => {
  //       clearInterval(refreshInterval);
  //     };
  //   }, [user._id || gstUser?.data?._id]);
  const sotreageList = () => {
    const guestUser = getLocalStorage('guestUser');
    const gtokens = getLocalStorage('guestTokens');
    if (guestUser?.data?._id) {
      dispatch(setGuestUser(guestUser));
      dispatch(setGuestUserTokens(gtokens));
    }
  };
  useEffect(() => {
    window.addEventListener('storage', sotreageList);
    return () => {
      window.removeEventListener('storage', sotreageList);
    };
  }, []);

  return null;
};

export default RefreshToken;
