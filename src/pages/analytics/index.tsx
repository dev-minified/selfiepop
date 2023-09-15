import { getEvents } from 'api/analytics';
import { GetPopIcon } from 'appconstants';
import { Calendar, InfoIcon } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import According from 'components/according-social';
import ToolTip from 'components/tooltip';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useRequestLoader from 'hooks/useRequestLoader';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/datepicker-area.css';
import 'styles/datepicker.css';
import { capitalizeFirstLetter, parseQuery } from 'util/index';
import AnalyticsModel from './model/AnalyticsModal';

const Index: React.FC<any> = ({ className }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(new Date());
  const [isOpenModal, onOpenModal, onCloseModal] = useOpenClose();
  const [data, setdata] = useState<any>({});
  const history = useHistory();
  const { links = [], totalCount, totalHomePageView } = data;
  const query = useLocation().search;
  const { withLoader, setLoading } = useRequestLoader();

  useEffect(() => {
    if (user?._id) {
      const pareseQuery = parseQuery(query);
      const startDate = pareseQuery?.st
        ? dayjs(pareseQuery?.st as any).format('ddd MMM D YYYY')
        : dayjs().format('ddd MMM D YYYY');
      const sDate = pareseQuery?.st
        ? dayjs(pareseQuery?.st as any)
            .utc()
            .format()
        : dayjs().utc().format();

      withLoader(
        getEvents(user?._id, {
          date: dayjs(sDate).format('YYYY-M'),
        }),
      )
        .then((res: any) => {
          setLoading(true);
          const newLinks: any = {};
          let totalCount = 0;
          res?.data?.data?.links?.forEach((l: any) => {
            totalCount += l?.clicks;
            if (l?.linktype === 'link') {
              let link: any = newLinks[l?.linkId];
              if (!newLinks[l?.linkId]) {
                const socLink = user.socialMediaLinks?.find(
                  (f: any) => f?._id === l?.linkId,
                );
                if (socLink) {
                  link = {
                    ...socLink,
                    platfrom: socLink?.type,
                  };
                } else {
                  link = user?.links?.find((ll: any) => ll?._id === l?.linkId);
                }
              }
              if (link) {
                newLinks[l?.linkId] = {
                  ...link,
                  count: (link?.count || 0) + l?.clicks,
                };
              }
            } else if (l?.linktype === 'pop') {
              const link = !newLinks[l?.linkId]
                ? user?.links?.find(
                    (ll: any) => ll?.popLinksId?._id === l?.linkId,
                  )
                : newLinks[l?.linkId];
              if (link) {
                newLinks[l?.linkId] = {
                  ...(link?.popLinksId ? link?.popLinksId : link),
                  count: (link?.count || 0) + l?.clicks,
                };
              }
            }
          });
          setdata({
            totalHomePageView: res?.data?.data?.profile?.visits ?? 0,
            links: Object.keys(newLinks || {})?.map((lk) => newLinks[lk]),
            totalCount,
          });
          setDateRange(new Date(startDate));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user?._id]);

  const CustomInputStart = ({ value, onClick }: any) => (
    <span className="datepicker-area__start" onClick={onClick}>
      {value}
    </span>
  );

  const handleChange = (date: any) => {
    setDateRange(() => {
      const n = date;
      const start = dayjs(n);
      const md: string = stringify({
        st: dayjs(start).format('YYYY-MM'),
      });
      history.push(`?${md}`);
      return n;
    });
  };
  return (
    <div className={className}>
      <div className={'head-btn'}>
        <Button onClick={onOpenModal} block type="primary" shape="circle">
          Add Custom Analytics
        </Button>
        <ToolTip
          overlay={
            <span>
              Track your profile statistics with Google Analytics by clicking
              the button below and <br />
              adding the ID G-7397392-1.
            </span>
          }
          placement="topRight"
        >
          <span className="link-info">
            <InfoIcon />
          </span>
        </ToolTip>
      </div>

      <div className="calendar-area mb-35">
        <div className="visitors-details">
          <div className="visitors-info">
            Total Visits:{' '}
            <strong className="visitors-num">{totalHomePageView}</strong>
          </div>
          <div className="datepicker-area">
            <i className="icon">
              {/* <ImageModifications
                src="/assets/images/svg/icon-calendar-b.svg"
                alt="img description"
              /> */}
              <Calendar />
            </i>
            <span className="starting-date">
              <DatePicker
                showMonthYearPicker
                selected={dateRange}
                dateFormat="MMM yyy"
                onChange={(date) => handleChange(date)}
                customInput={<CustomInputStart />}
                className="rc-date__picker"
              />
            </span>
          </div>
        </div>
      </div>
      {links?.map((link: any, index: number) => {
        const url =
          link.url ||
          `${window.location.host}/${user.username}/${link.popName}`;
        const percetage = Math.ceil((link.count / totalCount) * 100);
        const PS = !isNaN(percetage) && percetage !== Infinity ? percetage : 0;
        return (
          <According
            key={index}
            title={link.title || capitalizeFirstLetter(link.type || '')}
            percent={PS}
            icon={
              link.imageURL ? (
                <GetPopIcon type={link?.platfrom || link?.popType} />
              ) : link.popThumbnail ? (
                <ImageModifications
                  src={link.popThumbnail}
                  imgeSizesProps={{
                    onlyMobile: true,
                  }}
                />
              ) : (
                <GetPopIcon type={link?.popType || link?.type} />
              )
            }
          >
            <div>
              <h6>{url}</h6>
              <h6>
                # CLICK:
                <span className="click-count"> {link.count || 0}</span>
              </h6>
            </div>
          </According>
        );
      })}
      <AnalyticsModel isOpen={isOpenModal} onClose={onCloseModal} />
    </div>
  );
};

export default styled(Index)`
  padding: 24px 18px 2px;
  .visitors-details .ending-date .react-datepicker-popper {
    margin-left: -161px;
  }
  .head-btn {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    a {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }
    .link-info {
      width: 40px;
      height: 40px;
      border: 1px solid var(--pallete-primary-main);
      border-radius: 5px;
      min-width: 40px;
      margin: 0 0 0 20px;
      background: var(--pallete-background-default);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
      &:hover {
        border-color: var(--colors-indigo-200);
        background: var(--colors-indigo-200);
        svg {
          path {
            fill: #fff;
          }
        }
      }
      svg {
        width: 20px;
        height: auto;
        display: block;
        path {
          fill: var(--pallete-primary-main);
          fill-opacity: 1;
          transition: all 0.4s ease;
        }
      }
    }
  }
`;
