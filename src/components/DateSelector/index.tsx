import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import { useCallback, useEffect, useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import Item from './Item';
import month from './month';
dayjs.extend(isoWeek);
dayjs.extend(weekday);
const MAP_TERM: any = {
  1: 'st',
  2: 'nd',
  3: 'rd',
};
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DateWidget = styled.div`
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--pallete-colors-border);
  padding: 0 0 12px;
  margin: 0 0 14px;

  .date-head {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: var(--pallete-text-main);
    position: relative;
    padding: 18px 60px;
    background-color: var(--pallete-background-gray-darker);
    border-radius: 5px 5px 0 0;
    text-align: center;
    margin: 0 0 15px;
    border-bottom: 1px solid var(--pallete-colors-border);
  }

  .btn-prev,
  .btn-next {
    -webkit-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    color: #fff;
    position: absolute;
    top: -47px;
    opacity: 0.8;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-decoration: none;
  }

  .btn-prev:hover,
  .btn-next:hover {
    opacity: 1;
    background: #000;
  }

  .btn-prev {
    left: 15px;
  }

  .btn-next {
    right: 15px;
  }

  @media (max-width: 767px) {
    margin: 0 -5px 14px;
  }
`;

const Collapse: React.FC<IDateSelector> = ({
  availability = [],
  onSelect,
}: IDateSelector) => {
  const [slot, setSlots] = useState<any>([]);
  const [week, setWeek] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const changeWeek = useCallback((date: Date) => {
    const start = dayjs(date).startOf('week').add(1, 'd').format('YYYY-MM-DD');
    const end = dayjs(date).endOf('week').add(1, 'd').format('YYYY-MM-DD');
    setWeek({ start, end });
  }, []);
  const PrevArrow = ({ onClick }: any) => (
    <button
      className="btn-prev slick-prev slick-arrow"
      onClick={(e: any) => {
        changeWeek(dayjs(week.start).subtract(2, 'd').toDate());
        return onClick(e);
      }}
    >
      <span className="icon-keyboard_arrow_left"></span>
    </button>
  );
  const NextArrow = ({ onClick }: any) => (
    <button
      className="btn-next slick-next slick-arrow"
      onClick={(e: any) => {
        changeWeek(new Date(week.end));
        return onClick(e);
      }}
    >
      <span className="icon-keyboard_arrow_right"></span>
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const items: any = [];
    const tempIndex: string[] = [];
    availability.forEach((data) => {
      const index = tempIndex.findIndex((value: string) => value === data.date);
      if (index !== -1) {
        items[index].push(data);
      } else {
        tempIndex.push(data.date);
        items.push([data]);
      }
    });
    changeWeek(new Date());
    setSlots(items);
  }, []);
  return (
    <DateWidget className="date-widget mb-65">
      <header className="date-head">
        <time dateTime="2020-07-20">{`${
          month[new Date(week.start).getMonth()]?.abbreviation
        } ${new Date(week.start).getDate()}${
          MAP_TERM[new Date(week.start).getDate()] || 'th'
        } - ${month[new Date(week.end).getMonth()]?.abbreviation} ${new Date(
          week.end,
        ).getDate()}${MAP_TERM[new Date(week.end).getDate()] || 'th'}`}</time>
      </header>
      <div className="date-slider">
        <Slider key={`${+new Date()}`} {...settings} className="slideshow">
          {[0, 1].map((value: number) => (
            <div className="slide" key={`${value}`}>
              <div className="accordion-area">
                {[1, 2, 3, 4, 5, 6, 0].map((i: number, index: number) => {
                  const currentDate = dayjs(week.start)
                    .add(index, 'd')
                    .get('date');
                  const now = dayjs(week.start)
                    .add(index, 'd')
                    .format('YYYY-MM-DD');
                  const indexOfRemainingArray = slot.findIndex(
                    (sub: Availability[]) => {
                      return (
                        sub.findIndex(({ date }) => {
                          return date === now;
                        }) !== -1
                      );
                    },
                  );
                  return (
                    <Item
                      key={`${i}`}
                      title={`${days[i]} - ${
                        month[dayjs(week.start).add(index, 'd').get('M')]
                          ?.abbreviation
                      } ${currentDate}${MAP_TERM[currentDate] || 'th'}`}
                      open={false}
                      slot={slot[indexOfRemainingArray]}
                      onSelect={onSelect}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </DateWidget>
  );
};
export default Collapse;
