import { getAttendeeBytID, getInviteBytID } from 'api/event';
import { ImagesScreenSizes } from 'appconstants';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import UploadWedigt from 'components/UploadWidget';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { addAttende } from 'store/reducer/eventslice';
import styled from 'styled-components';
import Logo from 'theme/logo';

// dayjs.extend(utc);
type PunchedTicket = {
  className?: string;
};

function PunchTicket(props: PunchedTicket) {
  const { className } = props;
  const { inviteid } = useQuery();
  const { user, loggedIn } = useAuth();
  const history = useHistory();
  const [isPunchedStatus, setIsPunchedStatus] = useState(`loading`);

  const [progressFiles, setProgressfiles] = useState<any[]>([]);
  const [isdisabled, setIsdisabled] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { setLoading } = useRequestLoader();
  const dispatch = useAppDispatch();
  const [info, setInfo] = useState({
    attendeeName: '',
    isVIP: '',
    phoneNumber: '',
    instagramUsername: '',
    idPath: '',
  });
  const [isPurchased, setIsPuchsed] = useState(false);
  const getData = () => {
    if (loggedIn) {
      if (user?.allowTicketPunch) {
        if (inviteid) {
          setIsloading(true);
          getInviteBytID(
            inviteid as string,
            {
              method: 'GET',
            },
            {
              ignoreStatusCodes: [500],
            },
          )
            .then((data) => {
              if (data?.isPunched) {
                setIsloading(false);
                const date = dayjs(data?.createdAt)
                  .local()
                  .format('MM/DD/YYYY');
                setIsPunchedStatus(
                  `This ticket for ${data.name} was already punched on ${date}`,
                );

                setIsPuchsed(true);
              } else {
                getAttendeeBytID(data?.phone as string, {
                  ignoreStatusCodes: [404],
                })
                  .then((data) => {
                    setInfo(data);
                    dispatch(addAttende(data));
                  })
                  .catch((e) => {
                    setIsPuchsed(true);
                    if (e?.message) {
                      setIsPunchedStatus(e.message + '');
                    }
                  })
                  .finally(() => {
                    setIsloading(false);
                  });
              }
            })
            .catch((e) => {
              console.log(e);
              setIsloading(false);
              setIsPuchsed(true);
              if (e && e?.message) {
                // Cast to ObjectId failed for value
                if (e?.message?.includes('Cast to ObjectId failed for value')) {
                  // setIsPunchedStatus(`You're not allowed to punch this ticket.`);
                  setIsPunchedStatus(`Invalid InviteID`);
                  return;
                }
              }
              setIsPunchedStatus(e?.message || 'Something went wrong');
            });
        } else {
          setIsPuchsed(true);
          // setIsPunchedStatus(`You're not allowed to punch this ticket.`);
          setIsPunchedStatus(`Invalid InviteID`);
        }
      } else {
        setIsPuchsed(true);
        // setIsPunchedStatus(`You're not allowed to punch this ticket.`);
        setIsPunchedStatus("You're not allowed to punch this ticket!");
      }
    }
  };
  useEffect(() => {
    getData();

    return () => {
      dispatch(addAttende(undefined));
    };
  }, [user?._id]);

  const onHandleFileUpload = (files: any[]) => {
    if (files.length > 0) {
      onPunchInvite({
        idPath: files[0].url,
        phoneNumber: info.phoneNumber,
      });
      setProgressfiles([]);
    }
  };
  const onPunchInvite = (data?: any) => {
    setLoading(true);
    getInviteBytID(
      inviteid as string,
      {
        method: 'PUT',
        data,
      },
      {
        ignoreStatusCodes: [500],
      },
    )
      .then(() => {
        // setIsPunchedStatus(
        //   `You have successfully punched this ticked`,
        // );
        dispatch(addAttende(undefined));
        sessionStorage.setItem(
          'message',
          `You have successfully punched this ticket for ${info.attendeeName}`,
        );
        history.replace('/punched-success');
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const addProgressFile = (file: any) => {
    setProgressfiles((prevFiles) => {
      if (!!prevFiles.find((f) => f.name === file.name)) {
        return prevFiles.map((f) =>
          f.name === file.name ? { ...f, ...file } : f,
        );
      }

      return [...prevFiles, file];
    });
  };
  const isallowed = user?.allowTicketPunch;

  return (
    <div className={`landing-page-area ${className}`}>
      {<RequestLoader isLoading={isLoading} />}
      <div className="container d-flex">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          <div className="text-detail">
            {isPunchedStatus !== 'loading' ? isPunchedStatus : ''}
          </div>
          <div className="punch-detail-area">
            {/* {isPunchedStatus === 'loading' ? loader : isPunchedStatus} */}
            {info?.idPath ? (
              <div className="punch-detail-info">
                <ImageModifications
                  imgeSizesProps={{
                    desktop: ImagesScreenSizes.profile[1],
                    mobile: ImagesScreenSizes.profile[2],
                  }}
                  src={info.idPath}
                  fallbackUrl="/assets/images/default-profile-img.svg"
                />
              </div>
            ) : null}
            {info?.attendeeName ? (
              <div className="punch-detail-info">
                <strong className="title">Name: </strong>
                <strong className="info-text text-primary d-block text-center">
                  {info?.attendeeName}
                </strong>
              </div>
            ) : null}
            {info?.phoneNumber ? (
              <div className="punch-detail-info">
                <strong className="title">Phone: </strong>
                <strong className="info-text text-primary d-block text-center">
                  {info?.phoneNumber}
                </strong>
              </div>
            ) : null}
            {info?.instagramUsername ? (
              <div className="punch-detail-info">
                <strong className="title">Instagram Handle: </strong>
                <strong className="info-text text-primary d-block text-center">
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(info?.instagramUsername, '_blank');
                    }}
                    to={info?.instagramUsername}
                    className="text-primary"
                    target="_blank"
                  >
                    {info?.instagramUsername}
                  </Link>
                </strong>{' '}
              </div>
            ) : null}
          </div>
          {!isPurchased && loggedIn && isallowed ? (
            <div>
              <div
                style={{
                  width: `${progressFiles[0]?.uploadingProgress || 0}%`,
                  height: '2px',
                  background: 'var(--pallete-primary-main)',
                }}
              ></div>
              <div className="mb-10">
                {!info.idPath ? (
                  <div>
                    <UploadWedigt
                      onStartUploading={() => {
                        setIsdisabled(true);
                      }}
                      onProgress={addProgressFile}
                      imageSizes={ImagesScreenSizes.profile}
                      withProgress={true}
                      options={{ delete: false }}
                      value={[]}
                      onChange={(array: any) => {
                        onHandleFileUpload(
                          array.map((item: any) => ({
                            ...item,
                            url: item.imageURL,
                          })),
                        );
                      }}
                      title="Upload ID"
                      url={'/image/upload'}
                      limit={1}
                    />
                  </div>
                ) : null}
                <Button
                  type="primary"
                  disabled={isdisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPunchInvite();
                  }}
                >
                  Punch
                </Button>
              </div>
            </div>
          ) : null}
          {loggedIn ? (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                history.push('/my-profile');
              }}
            >
              Go to Dashboard
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default styled(PunchTicket)`
  height: calc(100vh - 62px);
  text-align: center;

  @media (max-width: 767px) {
    height: auto;
    align-items: flex-start !important;
  }

  .container {
    margin: auto;

    @media (max-width: 767px) {
      margin: 0 auto;
      padding-top: 40px;
      padding-bottom: 40px;
    }
  }

  .text-detail {
    font-weight: 400;
    margin: 0 0 10px;
  }

  .punch-detail-info {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
  }

  .punch-detail-info {
    margin: 0 0 15px;
    position: relative;
    overflow: hidden;

    .image-comp {
      width: 180px;
      height: 180px;
      border-radius: 100%;
      margin: 0 auto;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .form-signup-area {
    margin: auto;
    width: 100%;
    max-width: 525px;
    padding-bottom: 20px;

    .logo {
      margin-bottom: 10px;
    }

    .title {
      font-size: 18px;
      line-height: 22px;
      margin: 0 5px 0 0;
    }

    .info-text {
      margin: 0;
    }
  }

  .widget-fileupload {
    margin-bottom: 0px !important;

    .button-fileupload {
      background: var(--pallete-primary-main);
      color: white;

      .img img.img-white {
        opacity: 1;
      }
    }
  }
`;
