import { CLOUD_FRONT_S3_IMAGES_BUCKET } from 'config';
import jwt_decode from 'jwt-decode';
/* eslint-disable no-useless-escape */
import { getAllThemes } from 'api/theme';
import { createGuestUser } from 'api/User';
import attrAccept from 'attr-accept';
import axios from 'axios';
import { IMAGE_UPLOAD_URL } from 'config';
import dayjs from 'dayjs';
import { Time } from 'enums';
import { v4 as uuid } from 'uuid';

import { FILE_MIME_TYPE, initialPallet } from 'appconstants';
import { useAppDispatch } from 'hooks/useAppDispatch';
import qs from 'querystring';
import { Cookies } from 'react-cookie';
import { isDesktop, isMobile } from 'react-device-detect';
import { addPreviewPop } from 'store/reducer/popSlice';
const cookies = new Cookies();
export async function getDuration(file: any) {
  return new Promise((resolve, reject) => {
    if (!file?.url?.length && !file?.path?.length) {
      return reject('Url must be provided...');
    }
    let duration = undefined;
    var video = document.createElement('video');
    const sour = document.createElement('source');
    sour.setAttribute('type', 'video/mp4');
    sour.setAttribute('src', file.url || file?.path);
    video.appendChild(sour);
    video.load();
    video.addEventListener('error', (ex) => {
      return reject('error when loading video file');
    });

    video.addEventListener('loadedmetadata', () => {
      duration = secondsToHms(video.duration);

      return resolve({
        timeDuration: duration,
        duration: video.duration,

        width: video.videoWidth || video.width || 450,
        height: video.videoHeight || video.height || 450,
      });
    });
  });
}

export async function getAudioDuration(file: any) {
  const isVidAud = /(audio)\/(.*)/gm;
  // Create a non-dom allocated Audio element
  return new Promise((resolve, reject) => {
    if (!isVidAud.test(file.type)) {
      return reject('File is not audio type');
    }
    var audio = document.createElement('audio');
    audio.src = file.url || file?.path;
    if (file) {
      audio.addEventListener(
        'loadedmetadata',
        function () {
          // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
          const duration = audio.duration;
          // example 12.3234 seconds
          console.log(
            'The duration of the song is of: ' + duration + ' seconds',
            audio,
          );
          // Alternatively, just display the integer value with
          // parseInt(duration)
          // 12 seconds
          return resolve({ timeDuration: secondsToHms(duration), duration });
        },
        false,
      );
      audio.addEventListener('error', (ex) => {
        return reject('error when loading audio file');
      });
    }
  });
}

export function secondsToHms(d: any, displayalphabets = false) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h : '';
  var mDisplay = m > 0 ? m : '00';
  var sDisplay = s > 0 ? s : '00';
  // var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  // var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  // var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  if (displayalphabets) {
    hDisplay = !!hDisplay ? `${hDisplay}h` : hDisplay;
    mDisplay = !!mDisplay ? `${mDisplay}m` : mDisplay;
    sDisplay = !!sDisplay ? `${sDisplay}s` : sDisplay;
  }

  if (!!hDisplay) {
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }

  return `${mDisplay}:${sDisplay}`;
}
export async function getAudioFileDuration(file: File) {
  return new Promise((resolve, reject) => {
    var audio = document.createElement('audio');
    // audio.src = (file as any).result;
    const src = URL.createObjectURL(file);
    audio.setAttribute('src', src);
    audio.load();
    audio.addEventListener(
      'loadedmetadata',
      function () {
        // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
        var duration = audio.duration;

        // example 12.3234 seconds
        console.log('The duration of the song is: ' + duration + ' seconds');
        // Alternatively, just display the integer value with
        // parseInt(duration)
        // 12 seconds
        return resolve({
          timeDuration: secondsToHms(duration),
          duration,
          src,
        });
      },
      false,
    );
    audio.addEventListener('error', (ex) => {
      return reject('error when loading audio file');
    });
  });
}
export async function getVideoCover(file: File, seekTo = 0.1) {
  console.log('getting video cover for file: ', file);
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    const src = URL.createObjectURL(file);
    videoPlayer.setAttribute('src', src);
    videoPlayer.load();
    videoPlayer.addEventListener('error', (ex) => {
      return reject('error when loading video file');
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', (meta) => {
      // seek to user defined timestamp (in seconds) if possible
      const duration = secondsToHms(videoPlayer.duration);
      if (videoPlayer.duration < seekTo) {
        return reject('video is too short.');
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 300);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        console.log('video is now paused at %ss.', seekTo);
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx?.canvas.toBlob(
          (blob) => {
            return resolve({
              blob,
              timeDuration: duration,
              duration: videoPlayer.duration,
              src: src,
              width: videoPlayer.videoWidth || 450,
              height: videoPlayer.videoHeight || 450,
            });
          },
          'image/jpeg',
          0.75 /* quality */,
        );
      });
    });
  });
}

export function dataURLtoFile(
  dataurl: string | any,
  filename: string = 'file',
) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  // TODO: Fix it Next Time n-- is wrong condition
  // tslint:disable-next-line: no-increment-decrement
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
type IChatLayoutHeightProps = {
  className?: string;
  id?: string;
  both?: boolean;
};
export function setChatLayoutHeight(props: IChatLayoutHeightProps) {
  const {
    id = 'chat-layout',
    className,
    both = false,
  } = props as IChatLayoutHeightProps;
  setTimeout(() => {
    let el = document.getElementById(id);
    let el2 = null;
    if (className) {
      if (both) {
        el2 = document.querySelector(`.${className}`);
      } else {
        el = document.querySelector(`.${className}`);
      }
    }
    let elY = el?.getBoundingClientRect().y || 0;
    if (el2 !== null) {
      elY = elY + el2?.clientHeight || 0;
    }

    el?.setAttribute(
      'style',
      `
      height: calc(${window.innerHeight}px - ${Math.abs(elY)}px)
    `,
    );
  }, 0);
}

export function arrayMoveMutate<T>(array: T[], from: number, to: number) {
  const startIndex = from < 0 ? array.length + from : from;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to;

    const [item] = array.splice(from, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  arrayMoveMutate(newArray, from, to);
  return newArray;
}

export function validURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+$@]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function CopyToClipBoard(text: string) {
  let textArea: any;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text: string) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    textArea.readOnly = true;
    textArea.style = '{display:none}';
    document.body.appendChild(textArea);
  }

  function selectText() {
    let range;
    let selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  createTextArea(text);
  selectText();
  copyToClipboard();
}

export function getSortbyParam(sortby: any) {
  switch (sortby) {
    case 'publishAt':
      return 'publishAt';
    case 'type':
      return 'popType';
    case 'status':
      return 'orderStatus';
    case 'date':
      return 'createdAt';
    case 'updatedAt':
      return 'updatedAt';
    default:
      return 'createdAt';
  }
}
export function getLocation(href: string) {
  let url = href;
  const p = new RegExp('^(http|https)://'); // fragment locator
  if (!!!p.test(url)) {
    url = `http://${url}`;
  }
  const l = document.createElement('a');
  l.href = url;
  return l;
}
export function capitalizeFirstLetter(strng: string) {
  if (strng.length < 1) return strng;
  return strng.charAt(0).toUpperCase() + strng.slice(1);
}

export function arrayFilter<T>(array: T[], option: Partial<T>): T[] {
  if (!array?.length) return array;

  return array.filter((item: T) => {
    for (const key in option) {
      if (option[key] !== item[key]) {
        return false;
      }
    }
    return true;
  });
}
export function arrayFind<T>(array: T[], option: Partial<T>): T | undefined {
  if (!array.length) return undefined;

  return array.find((item: T) => {
    for (const key in option) {
      if (option[key] !== item[key]) {
        return false;
      }
    }
    return true;
  });
}

export function slugify(input: string) {
  return (
    input &&
    input
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  );
}

export function setGuestTokens(name: string, value: any, strigify = true) {
  if (strigify) {
    const localguest = localStorage.setItem(name, JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
    return localguest;
  } else {
    const localguest = localStorage.setItem(name, value);
    window.dispatchEvent(new Event('storage'));
    return localguest;
  }
}
export function setLocalStorage(name: string, value: any, strigify = true) {
  if (strigify) {
    return localStorage.setItem(name, JSON.stringify(value));
  } else {
    return localStorage.setItem(name, value);
  }
}
export function setSessionStorage(name: string, value: any, strigify = true) {
  if (strigify) {
    return sessionStorage.setItem(name, JSON.stringify(value));
  } else {
    return sessionStorage.setItem(name, value);
  }
}
export function getSessionStorage(name: string, parse = true) {
  try {
    if (parse) {
      return JSON.parse(sessionStorage.getItem(name) || '{}');
    } else {
      return sessionStorage.getItem(name);
    }
  } catch (e) {
    return undefined;
  }
}
export function getLocalStorage(name: string, parse = true) {
  try {
    if (parse) {
      return JSON.parse(localStorage.getItem(name) || '{}');
    } else {
      return localStorage.getItem(name);
    }
  } catch (e) {
    return undefined;
  }
}

export function removeLocalStorage(name: string) {
  localStorage.removeItem(name);
}
export function removeSessiontorage(name: string) {
  sessionStorage.removeItem(name);
}

export function getCSSFontURL(font: Font) {
  if (!font) return '';
  const apiUrl = [];
  apiUrl.push('https://fonts.googleapis.com/css?family=');
  apiUrl.push(font.family.replace(/ /g, '+'));
  if (font.variants.includes('italic')) {
    apiUrl.push(':');
    apiUrl.push('italic');
  }
  if (font?.subsets.includes('greek')) {
    apiUrl.push('&subset=');
    apiUrl.push('greek');
  }
  return apiUrl.join('');
}

export function parseQuery(search: string): qs.ParsedUrlQuery {
  return qs?.parse(search.substring(1));
}
type LogsUserType = {
  allowLog?: boolean;
  publicUser?: any;
  loggedUser?: IUser;
};
export async function checkifGuestOrloggedIn(props: LogsUserType) {
  const { allowLog = true, publicUser, loggedUser = {} } = props;
  if (allowLog && publicUser?._id !== (loggedUser as IUser)?._id) {
    const gtokens = getLocalStorage('guestTokens');
    const user = (loggedUser as IUser)?._id
      ? { data: loggedUser }
      : getLocalStorage('guestUser');
    if (!isEmpty(user?.data)) {
      return {
        user: { ...user, ...(gtokens || {}) },
        isLoggedIn: !!(loggedUser as IUser)?._id,
      };
    } else {
      return await createGuestUser({})
        .then((response: any) => {
          return { user: response, isLoggedIn: !!(loggedUser as IUser)?._id };
        })
        .catch(console.log);
    }
  }
}

export const onboardingSequency = [
  '/onboarding/profile-photo',
  // '/onboarding/interests-setup',
  '/onboarding/private-pop-setup',
  '/onboarding/theme-selection',
  '/onboarding/set-password',
];

export const onboardingSequencyV2 = [
  '/onboarding/profile-photo',
  // '/onboarding/interests-setup',
  '/onboarding/private-pop-setup',
  '/onboarding/theme-selection',
  '/onboarding/set-password',
];

export function getUserSetupUri(userSetupStatus: number) {
  // we will change this letter to v1
  return onboardingSequency[userSetupStatus] || '/my-profile';
}

export async function fileChanges(fls: any[] = [], type: string) {
  const newFiles: MediaType[] = [];
  for (let index = 0; index < fls?.length; index++) {
    const file = fls[index];
    let url = undefined;
    let thumb = undefined;
    let duratonInSeconds = 0;
    let duration = undefined;
    if (attrAccept(file, 'video/*')) {
      await getVideoCover(file)
        .then((payload: any) => {
          duration = payload.timeDuration;
          duratonInSeconds = payload.duration;
          url = payload.src;
          thumb = URL.createObjectURL(payload.blob);
          if (payload.width && payload.height) {
            Object.defineProperty(file, 'width', {
              value: payload.width,
              writable: true,
            });
            Object.defineProperty(file, 'height', {
              value: payload.height,
              writable: true,
            });
          }
        })
        .catch((e) => {
          console.log(e, 'error');
        });
    } else if (attrAccept(file, 'image/*')) {
      url = URL.createObjectURL(file);
    } else if (attrAccept(file, 'audio/*')) {
      await getAudioFileDuration(file)
        .then((payload: any) => {
          duration = payload.timeDuration;
          duratonInSeconds = payload.duration;
          url = payload.src;
        })
        .catch((e) => {
          console.log(e, 'error');
        });
    }
    newFiles.push({
      ...file,
      name: file.name,
      type: file.type,
      id: uuid(),
      size: file.size,
      orignalFile: file,
      path: url,
      thumbnail: thumb,
      videoDuration: duration,
      duration: duratonInSeconds,
      isPaidType: type === 'paid',
      islocK: type === 'paid',
      updatedAt: file.updatedAt || new Date().getTime() + '',
    });
  }
  return newFiles;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  fields: K[],
): Omit<T, K> {
  const clone = { ...obj };

  if (Array.isArray(fields)) {
    fields.forEach((key) => {
      delete clone[key];
    });
  }

  return clone;
}
export function isEmpty(obj: Record<string, any>) {
  return Object.keys(obj || {})?.length === 0;
}
export function isValidUrl(url?: string) {
  const regex = new RegExp(
    /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
  );
  return regex.test(url || '');
}

export function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'http://' + url;
  }
  return url;
}

export function getUrlParts(url: string | undefined) {
  if (url && isValidUrl(url)) {
    const vidUrl = new URL(addProtocol(url));
    const hostName = vidUrl.hostname;
    const protocol = vidUrl.protocol;
    const search = vidUrl.search;
    const pathname = vidUrl.pathname;
    let companyName = '';
    if (hostName) {
      if (hostName.includes('www')) {
        companyName = hostName.split('.')[1];
      } else {
        companyName = hostName.split('.')[0];
      }
    }
    return { hostName, companyName, protocol, search, pathname };
  }
  return {
    hostName: '',
    companyName: '',
    protocol: '',
    search: '',
    pathname: '',
  };
}

export function rgbToRgba(rgb: any, a = 1) {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`);
}

export function getGradient(
  subtype: 'solid' | 'gradient',
  gradient?: IGradient,
  solidColor?: string,
) {
  switch (subtype) {
    case 'gradient':
      const gradientAngle = gradient?.angle || 0;
      const gradientColors = (gradient?.pallette || initialPallet)
        .slice()
        ?.sort((a, b) => (a.id < b.id ? 1 : 0))
        ?.reduce((p, c, i) => {
          return `${p},${rgbToRgba(c.color, c.opacity)} ${
            parseFloat(c.offset) * 100
          }%`;
        }, '');
      return `linear-gradient(${gradientAngle}deg${gradientColors})`;
    default:
      return `linear-gradient(${solidColor},${solidColor})`;
  }
}

export function isObject(item: { [key: string]: any }) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default function mergeDeep(
  target: { [key: string]: any },
  source: { [key: string]: any },
): { [key: string]: any } {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
type IThemesProps = {
  callBack: (props: ThemeProps) => void;
  systemThemePoll?: boolean;
  query?: Record<string, any>;
};
export async function getThemes(
  cb: (props: ThemeProps) => void,
  query?: Record<string, any>,
) {
  return getAllThemes(query)
    .then((response) => {
      const themes = response.userTheme.items;
      cb({
        userThemes: themes,
        systemThemes: response.systemTheme.items,
        totalThemesCount: {
          systemthemeCount: response.systemTheme.totalCount,
          userThemeCount: response.userTheme.totalCount,
        },
      });
      return themes;
    })
    .catch((e) => {
      console.log(e);
      return [];
    });
}

let pollCounter = 0;
export function startThemePolling(propss: IThemesProps) {
  const { callBack, systemThemePoll = false, query } = propss;
  return getThemes((props: ThemeProps) => {
    callBack(props);
    const themes = systemThemePoll
      ? [...props.userThemes, ...props.systemThemes]
      : props.userThemes;
    if (themes?.some((theme: any) => theme.isRendering)) {
      pollCounter = 0;
      pollThemes(30 * Time.SECONDS, callBack, systemThemePoll);
    }
  }, query);
}
function pollThemes(
  timeout: number,
  cb: (props: ThemeProps) => void,
  systemThemePoll: boolean = false,
) {
  setTimeout(() => {
    pollCounter += 1;
    if (pollCounter <= 12) {
      getThemes((props: ThemeProps) => {
        cb(props);
        const themes = systemThemePoll
          ? [...props.userThemes, ...props.systemThemes]
          : props.userThemes;
        if (themes?.some((theme: any) => theme.isRendering)) {
          pollThemes(10 * Time.SECONDS, cb, systemThemePoll);
        }
      });
    }
  }, timeout);
}

export function stopThemePolling() {
  pollCounter = 13;
}
export async function getblobFromOctatStram(path: string) {
  const res = await fetch(path);
  const blob = await res.blob();
  console.log({ blob });
  const img = new Image();
  img.src = URL.createObjectURL(blob);

  // newer promise based version of img.onload
  // try {
  //   await img.decode();
  // } catch (error) {
  //   console.log({ error });
  // }
  img.onload = () => {
    console.log('loaded');
    document.body.appendChild(img);
  };
  // return img;

  document.body.appendChild(img);

  // // Don't forget to revoke the blob url when
  // // you no longer need it (to release memory)
  URL.revokeObjectURL(img.src);
}
function getBase64StringFromDataURL(dataURL: any) {
  return dataURL.replace('data:', '').replace(/^.+,/, '');
}
export async function getImageDimension(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!attrAccept({ name: file.name, type: file.type }, 'image/*')) {
      return resolve(file);
    }
    if (attrAccept({ name: file.name, type: file.type }, 'audio/*')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const image = new Image();
      image.src = event.target.result;
      if (
        event.target.result.includes('application/octet-stream;') ||
        FILE_MIME_TYPE.includes(file.type)
      ) {
        return resolve(file);
      }
      image.onload = () => {
        Object.defineProperty(file, 'width', {
          value: image.width,
          writable: false,
        });
        Object.defineProperty(file, 'height', {
          value: image.height,
          writable: false,
        });
        resolve(file);
      };
      reader.onerror = (err) => {
        console.log('err: ', err);
        return reject(err);
      };
    };
  });
}
export async function getImageURLDimentions(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      // alert(this.width + ' ' + this.height);
      return resolve({ width: img.width, height: img.height, success: true });
    };
    img.onerror = (err) => {
      return reject({ width: 0, height: 0, success: false });
    };
    img.src = url;
  });
}

export function getCookieByName(tokenName: string) {
  return cookies.get(tokenName);
}
export function setCookie(tokenName: string, token: any) {
  cookies.set(tokenName, token, {
    path: '/',
    maxAge: 68 * Time.YEARS,
    sameSite: false,
  });
}

export function createPendingMessage(
  data: Partial<ChatMessage> & { [key: string]: any },
) {
  return {
    createdAt: dayjs().format(),
    emojis: [],
    isPaidType: false,
    isRead: false,
    messageType: 'SIMPLE',
    messageValue: '',
    paymentComplete: false,
    isSent: false,
    ...data,
  };
}
export function addPopToState(
  id?: string,
  user?: Partial<IUser>,
  dispatch?: ReturnType<typeof useAppDispatch>,
  pop?: IPop,
) {
  if (id && !pop?._id) {
    const links = user?.links;
    const selectedLink = (links || [])?.find((l: any) => l._id === id);
    if (selectedLink) {
      dispatch?.(addPreviewPop({ ...selectedLink }));
    } else {
      const links = user?.links || [];
      const selectedLink = (links || [])?.find((l: any) => l._id === id);
      dispatch?.(addPreviewPop({ ...selectedLink }));
    }
  }
}
export function removeQueryString(url?: string): {
  url: string;
  queryString: string;
} {
  if (!url) {
    return { url: '', queryString: '' };
  }
  const spl = url?.split(/[?#]/);
  return { url: spl[0], queryString: spl?.length > 1 ? spl[1] : '' };
}
export function checkUrlForImages(url?: string, removequeryStrings?: boolean) {
  let newUrl = url;
  if (removequeryStrings && newUrl) {
    newUrl = removeQueryString(newUrl).url;
  }

  if (newUrl && !newUrl?.includes(IMAGE_UPLOAD_URL as string)) {
    const newImageUrl = newUrl?.split('.com');
    if (newImageUrl?.length > 1) {
      newUrl = `${IMAGE_UPLOAD_URL}${newImageUrl[1]}`;
    }
  }
  return newUrl;
}
export function URLParts(url?: string) {
  let obj: {
    url: string;
    isImgix: boolean;
    hostName: string;
    protocol: string;
    search: string;
    pathname: string;
  } = {
    url: '',
    isImgix: false,
    hostName: '',
    protocol: '',
    search: '',
    pathname: '',
  };
  if (url) {
    const { hostName, protocol, search, pathname } = getUrlParts(url);
    const isImgix = hostName ? !!IMAGE_UPLOAD_URL?.includes(hostName) : false;
    obj = {
      url: `${protocol}//${hostName}${pathname}`,
      isImgix,
      hostName,
      protocol,
      search,
      pathname,
    };
  }
  return obj;
}
function checkIfExist(path: string) {
  const checksizes = ['mobile', 'desktop', 'smobile', 'xsmobile'];
  // const;
  let obj = { path, isExist: false };
  if (path) {
    const isExist = checksizes.find((s) => path.includes(`/${s}`));
    if (isExist) {
      const sp = path.split('/');
      sp.splice(1, 1);
      let newUrl = [...(sp || [])];
      obj.path = newUrl.join('/');
      obj.isExist = true;
    }
  }
  return obj;
}
export function downloadMediaLocal(downloadUrl: string) {
  axios({
    url: `${downloadUrl}`, //your url
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${downloadUrl?.split('/').pop()}`); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
export function getImageURL(props: ImageSizesProps) {
  const { settings: sizes, url: imgurl } = props;
  const transformToClientSide = sizes?.transform ?? true;
  let url = imgurl;
  let defaultUrl = sizes?.defaultUrl || url;
  let defaultUrlParts = URLParts(defaultUrl);
  const parts = URLParts(url || sizes?.defaultUrl);
  let isSelfiePop = parts?.hostName?.startsWith('selfiepop-');
  if (sizes?.checkspexist && !isSelfiePop) {
    return {
      url,
      fallbackUrl: defaultUrl,
      isImgix: parts.isImgix,
    };
  }
  if (transformToClientSide) {
    if (parts?.hostName) {
      url = `${CLOUD_FRONT_S3_IMAGES_BUCKET}${parts.pathname}${parts?.search}`;
    }
    if (defaultUrlParts?.hostName) {
      defaultUrl = `${CLOUD_FRONT_S3_IMAGES_BUCKET}${defaultUrlParts.pathname}${defaultUrlParts?.search}`;
    }
  }
  let obj: {
    url: any;
    isImgix: boolean;
    fallbackUrl?: string;
    hostName?: string;
    protocol?: string;
    search?: string;
    pathname?: string;
  } = {
    url,
    fallbackUrl: defaultUrl,
    isImgix: false,
  };

  if (url) {
    obj = {
      ...obj,
      fallbackUrl: defaultUrl,
      ...URLParts(url),
    };

    if (obj?.isImgix && sizes?.imgix) {
      if (sizes?.imgix?.all && obj.url) {
        obj.url = obj.search
          ? `${obj.url}${obj.search}&${sizes.imgix?.all}`
          : `${obj.url}?${sizes.imgix?.all}`;
      } else if (isMobile && sizes?.imgix?.mobile && obj.url) {
        obj.url = obj.search
          ? `${obj.url}${obj.search}&${sizes.imgix?.mobile}`
          : `${obj.url}?${sizes.imgix?.mobile}`;
      } else if (isDesktop && sizes?.imgix?.desktop && obj.url) {
        obj.url = obj.search
          ? `${obj.url}${obj.search}&${sizes.imgix?.desktop}`
          : `${obj.url}?${sizes.imgix?.desktop}`;
      }
    } else {
      if (obj?.pathname && !obj?.isImgix) {
        const { isExist, path } = checkIfExist(obj.pathname);

        const imgparts = isExist ? path?.split('/') : obj?.pathname?.split('/');

        if (imgparts?.length) {
          const imag = imgparts[imgparts.length - 1];
          const issp = imag.startsWith('sp_');
          if (issp) {
            const newPath = imgparts?.slice(0, imgparts?.length - 1);
            const split = imag.split('_');
            if (split.length) {
              const id = split?.pop();
              let isOnlyScreen = false;
              if (sizes?.onlyMobile) {
                isOnlyScreen = true;
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/mobile${newPath.join('/')}${id ? `/${id}` : ''}${obj.search}`;
              }
              if (sizes?.onlyDesktop) {
                isOnlyScreen = true;
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/desktop${newPath.join('/')}${id ? `/${id}` : ''}${
                  obj.search
                }`;
              }
              if (sizes?.onlyxsmobile) {
                isOnlyScreen = true;
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/xsmobile${newPath.join('/')}${id ? `/${id}` : ''}${
                  obj.search
                }`;
              }

              if (sizes?.bdesktop) {
                isOnlyScreen = true;
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/bdesktop${newPath.join('/')}${id ? `/${id}` : ''}${
                  obj.search
                }`;
              }
              if (sizes?.onlysMobile) {
                isOnlyScreen = true;

                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/smobile${newPath.join('/')}${id ? `/${id}` : ''}${
                  obj.search
                }`;
              }
              if (isDesktop && !isOnlyScreen) {
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/desktop${newPath.join('/')}${id ? `/${id}` : ''}${
                  obj.search
                }`;
              }
              if (isMobile && !isOnlyScreen) {
                obj.url = `${obj.protocol}//${
                  obj.hostName
                }/mobile${newPath.join('/')}${id ? `/${id}` : ''}${obj.search}`;
              }
            } else {
              obj.url = obj.fallbackUrl;
            }
          } else {
            if (sizes?.isThumbBdesktop) {
              obj.url = `${obj.protocol}//${obj.hostName}/blur${obj?.pathname}`;
            } else {
              obj.url = obj.url || obj.fallbackUrl;
            }
          }
        }
      }
    }
  }
  return obj;
}
export function getChangeUrlsOnly(
  imgurl?: string,
  sizes?: {
    defaultUrl?: string;
    checkspexist?: boolean;
  },
) {
  let url = imgurl;
  let defaultUrl = sizes?.defaultUrl || url;
  let defaultUrlParts = URLParts(defaultUrl);
  const parts = URLParts(url || sizes?.defaultUrl);
  let isSelfiePop = parts?.hostName?.startsWith('selfiepop-');
  if (sizes?.checkspexist && !isSelfiePop) {
    return {
      url,
      fallbackUrl: defaultUrl,
      isImgix: parts.isImgix,
    };
  }
  if (parts?.hostName) {
    url = `${CLOUD_FRONT_S3_IMAGES_BUCKET}${parts.pathname}${parts?.search}`;
  }
  if (defaultUrlParts?.hostName) {
    defaultUrl = `${CLOUD_FRONT_S3_IMAGES_BUCKET}${defaultUrlParts.pathname}${defaultUrlParts?.search}`;
  }

  let obj: {
    url: any;
    isImgix: boolean;
    fallbackUrl?: string;
    hostName?: string;
    protocol?: string;
    search?: string;
    pathname?: string;
  } = {
    url,
    fallbackUrl: defaultUrl,
    isImgix: false,
  };

  if (url) {
    obj = {
      ...obj,
      fallbackUrl: defaultUrl,
      ...URLParts(url),
    };
  }
  return obj;
}
export function appendScreenSizesToId(data: {
  id?: string;

  sizes?: string[];
  userId?: string;
  file?: File;
  rotateAll?: number | string;
  createpathagain?: boolean;
  allblur?: string;
}) {
  const {
    id,
    sizes,
    file,
    rotateAll = '',
    createpathagain,
    allblur = 'X0',
  } = data;
  let obj = {
    id: id,
    file: file,
  };
  if (file && attrAccept({ type: file?.type }, 'image/*')) {
    let newSizes = '';
    if (sizes?.length) {
      sizes.forEach((s) => {
        const isBlurexists = s?.split('X');

        const numbers = isBlurexists?.filter((n) => !isNaN(Number(n)));
        if (numbers?.length > 1) {
          newSizes += `${s}${rotateAll !== '' ? `X${rotateAll}` : ''}_`;
        } else {
          newSizes += `${s}${allblur}${
            rotateAll !== '' ? `X${rotateAll}` : ''
          }_`;
        }
      });
      newSizes = newSizes.replaceAll('XX', 'X');
    }
    if (id && sizes?.length) {
      let prefix = sizes ? `sp_${newSizes}` : '';
      const imageId = `${prefix}${id}`;
      if (!id?.includes(`sp_${newSizes}`) || createpathagain) {
        if (file?.name) {
          const n = imageId + '.' + file.name.split('.').pop();
          Object.defineProperty(obj.file, 'fileName', {
            writable: true,
            value: n,
          });
        }
        obj.id = imageId;
      }
    }
  }

  return obj;
}
export function appendScreenSizesToIdForUploadedFiles(data: {
  id?: string;

  sizes?: string[];
  userId?: string;
  rotateAll?: number | string;
  createpathagain?: boolean;
  allblur?: string;
  file?: Record<string, any>;
}) {
  const { id, sizes, rotateAll = '', allblur = 'X0', file } = data;
  let obj = {
    id: id,
    file,
  };
  if (file && attrAccept({ type: file?.type }, 'image/*')) {
    let newSizes = '';
    if (sizes?.length) {
      sizes.forEach((s) => {
        const isBlurexists = s?.split('X');
        const numbers = isBlurexists?.filter((n) => !isNaN(Number(n)));
        if (numbers?.length > 1) {
          newSizes += `${s}${rotateAll !== '' ? `X${rotateAll}` : ''}_`;
        } else {
          newSizes += `${s}${allblur}${
            rotateAll !== '' ? `X${rotateAll}` : ''
          }_`;
        }
      });
      newSizes = newSizes.replaceAll('XX', 'X');
    }
    if (id && sizes?.length) {
      let prefix = sizes ? `sp_${newSizes}` : '';
      const imageId = `${prefix}${id}`;
      if (file?.name) {
        const n = imageId + '.' + file.name.split('.').pop();

        obj.id = n;
      }
    }
  }

  return obj;
}

export function processFilesForRotation(files: any[], screenSizes: string[]) {
  if (files.length < 1) {
    return { files, screenSizes };
  }
  let filesWithoutRotation = [...files].map((nmedia: any) => {
    const { rotate, ...rest } = nmedia;
    return rest;
  });
  const filesTobeUpdated = [];
  for (let index = 0; index < files.length; index++) {
    const element = files[index];

    if (element.rotate !== undefined) {
      const isRotateable = (((element.rotate || 0) % 360) + 360) % 360 !== 0;
      if (isRotateable) {
        filesTobeUpdated.push(element);
      }
    }
  }
  let newFiles: any = [];

  for (let i = 0; i < filesTobeUpdated.length; i++) {
    newFiles[i] = filesTobeUpdated[i];
  }

  if (!!newFiles?.length) {
    newFiles = newFiles.map((fil: any) => {
      const { rotate, ...rest } = fil;
      const { id } = appendScreenSizesToIdForUploadedFiles({
        id: rest?.id,
        sizes: screenSizes,
        rotateAll: rotate || 0,
        file: rest,
        createpathagain: true,
      });
      let hostprotocol = getUrlParts(rest?.url ?? rest?.path);
      const pathname = hostprotocol.pathname.split('/');
      pathname.pop();
      let createUrl = `${hostprotocol.protocol}//${
        hostprotocol.hostName
      }${pathname.join('/')}/${id}`;
      return {
        ...rest,
        imageURL: createUrl,
        path: createUrl,
        url: createUrl,
        oldUrl: rest.url || rest.imageURL || rest.path,
      };
    });
  }
  filesWithoutRotation = filesWithoutRotation.map((nmedia: any) => {
    let founditem = newFiles.find((f: any) => f.id === nmedia.id);
    const isVideo = attrAccept({ type: nmedia.type }, 'video/*');
    const type = isVideo ? 'video/mp4' : nmedia.type;
    if (founditem) {
      return {
        ...nmedia,
        type,
      };
    }
    return { ...nmedia, type };
  });
  return { filesWithoutRotation, newFiles };
}
export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  if (base64Url) {
    try {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      return {};
    }
  }
  return {};
}
export function addBlurtoURL(url: string, blurValue = 0) {
  const obj = {
    defaultUrl: url,
    ...URLParts(url),
  };

  const imgparts = obj?.pathname?.split('/');

  if (imgparts?.length) {
    const imag = imgparts[imgparts.length - 1];
    const issp = imag.startsWith('sp_');
    if (issp) {
      const firstParts = imgparts.slice(0, -1).join('/');

      const split = imag.split('_');
      if (split.length) {
        const id = split?.pop();

        const newSplit = split.map((p, index) => {
          if (index === split.length - 1) {
            const partSplit = p.split('X');
            if (!!partSplit.length) {
              partSplit[partSplit.length - 1] = `${blurValue}`;
            }
            return partSplit.join('X');
          }
          return p;
        });
        const newUrl = newSplit.join('_') + `_${id}`;

        obj.url = `${obj.protocol}//${obj.hostName}${firstParts}/${newUrl} ${obj.search}`;
      }
    }
  }
  return obj;
}

export async function getImageURLDimension(fileUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = fileUrl;

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      reject({ width: 0, height: 0 });
    };
  });
}
// eslint-disable-next-line
export async function getFilemetaData(file: any): Promise<any> {
  const f = file;

  let timeDuration = f.videoDuration;
  let duration = f.duration;
  const isVideo = attrAccept({ type: f.type }, 'video/*');
  const isAudio = attrAccept({ type: f.type }, 'audio/*');
  const isImage = attrAccept({ type: f.type }, 'image/*');
  let width = f.width || 0;
  let height = f.height || 0;
  const isheightWidth = !width || !height;
  try {
    let data: any;
    if ((!duration || isheightWidth) && isVideo) {
      if (isValidUrl(f.path || f.url)) {
        data = await getDuration(f);
      } else {
        data = await getVideoCover(f);
      }
      timeDuration = data?.timeDuration || undefined;
      duration = data?.duration || undefined;
      width = !!width ? width : data?.width || 0;
      height = !!height ? height : data?.height || 0;
    }
    if (!duration && isAudio) {
      if (!isValidUrl(f.path || f.url)) {
        data = await getAudioFileDuration(f);
      } else {
        data = await getAudioDuration(f);
      }
      // const data: any = await getAudioDuration({ ...f, url: f.path });
      timeDuration = data?.timeDuration || undefined;
      duration = data.duration || undefined;
    }

    if ((!width || !height) && isImage) {
      if (!isValidUrl(f.path || f.url)) {
        data = await getImageDimension(f);
      } else {
        const getUrl = getChangeUrlsOnly(f.path ? f.path : f.url);
        data = await getImageURLDimension(getUrl.url);
      }
      width = data.width;
      height = data.height;
    }
    return { ...file, duration, timeDuration, width, height };
  } catch (error) {
    return { ...file, duration, timeDuration, width, height };
  }
}

export function decodeJWT(token: string) {
  return jwt_decode(token);
}
export function addBlurtoLastPiece(url: string, blurValue = 0) {
  let obj = {
    defaultUrl: url,
    ...URLParts(url),
    imgnewUrl: url.split('/').pop(),
  };

  const imgparts = obj?.pathname?.split('/');

  if (imgparts?.length) {
    const imag = imgparts[imgparts.length - 1];
    const issp = imag.startsWith('sp_');
    if (issp) {
      const firstParts = imgparts.slice(0, -1).join('/');

      const split = imag.split('_');
      if (split.length) {
        const id = split?.pop();

        const newSplit = split.map((p, index) => {
          if (index === split.length - 1) {
            const partSplit = p.split('X');
            if (!!partSplit.length) {
              partSplit[partSplit.length - 1] = `${blurValue}`;
            }
            return partSplit.join('X');
          }
          return p;
        });
        const newUrl = newSplit.join('_') + `_${id}`;
        const newUrlstr =
          `${obj.protocol}//${obj.hostName}${firstParts}/${newUrl} ${obj.search}`.trim();
        obj = {
          ...obj,
          ...URLParts(newUrlstr),
          url: newUrlstr,
          imgnewUrl: newUrlstr.split('/')?.pop()?.trim(),
        };
      }
    }
  }
  return obj;
}
export function toogleBodyThemeClass() {
  const thememode = getLocalStorage('sp_theme', false) as string;
  const bodyel = document.querySelector('.sp_body');
  const isDark = thememode === 'dark';
  setLocalStorage('sp_theme', isDark ? 'light' : 'dark', false);
  if (bodyel) {
    if (thememode === 'dark') {
      bodyel.classList.add('sp_light');
      bodyel.classList.remove('sp_dark');
    } else {
      bodyel.classList.add('sp_dark');
      bodyel.classList.remove('sp_light');
    }
  }
}
export function setBodyThemeClass(mode: 'dark' | 'light') {
  const bodyel = document.querySelector('.sp_body');
  setLocalStorage('sp_theme', mode, false);
  if (bodyel) {
    if (mode === 'dark') {
      bodyel.classList.remove('sp_light');
      bodyel.classList.add('sp_dark');
    } else {
      bodyel.classList.add('sp_light');
      bodyel.classList.remove('sp_dark');
    }
  }
}

export function setAppTheme() {
  const thememode = (getLocalStorage('sp_theme', false) as string) || 'dark';
  const bodyel = document.querySelector('.sp_body');

  setLocalStorage('sp_theme', thememode, false);
  if (bodyel) {
    if (thememode === 'dark') {
      bodyel.classList.add('sp_dark');
      bodyel.classList.remove('sp_light');
    } else {
      bodyel.classList.add('sp_light');
      bodyel.classList.remove('sp_dark');
    }
  }
}

export function getOperatingSystem() {
  let operatingSystem = 'Not known';
  const opsSystem = {
    isWindow: true,
    isMac: false,
    isLinux: false,
    isUnix: false,
  };
  if (window.navigator.appVersion.indexOf('Win') !== -1) {
    operatingSystem = 'Windows OS';
    opsSystem.isWindow = true;
  }
  if (window.navigator.appVersion.indexOf('Mac') !== -1) {
    operatingSystem = 'MacOS';
    opsSystem.isMac = true;
  }
  if (window.navigator.appVersion.indexOf('X11') !== -1) {
    operatingSystem = 'UNIX OS';
    opsSystem.isUnix = true;
  }
  if (window.navigator.appVersion.indexOf('Linux') !== -1) {
    operatingSystem = 'Linux OS';
    opsSystem.isLinux = true;
  }

  // return operatingSystem;
  return opsSystem;
}
