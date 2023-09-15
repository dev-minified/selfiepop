import dayjs from 'dayjs';
import { useState } from 'react';
import { Collapse as ReactCollapse } from 'react-collapse';
import styled from 'styled-components';
import 'styles/list-date.css';
const ListDate = styled.ul`
  margin: 0;
  padding: 10px 15px 0;
  list-style: none;
  font-size: 14px;
  line-height: 18px;

  li {
    border: 1px solid #d8d8d8;
    background-color: var(--pallete-background-gray-lighter);
    padding: 10px 11px;
    border-radius: 30px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 0 0 6px;
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
  }

  li:last-child {
    margin: 0;
  }

  li:hover {
    background: none;
  }

  .btn {
    -webkit-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
    font-size: 14px;
    line-height: 18px;
    padding: 5px 10px 3px 10px;
    text-transform: uppercase;
    border-radius: 20px;
    min-width: inherit;
    box-shadow: none;
  }

  .time-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    padding-left: 11px;
  }

  .time-wrap:first-child {
    padding-left: 0;
    padding-right: 11px;
  }

  .time-wrap .field,
  .time-wrap .time-format {
    padding: 0 7px;
  }

  .time-wrap .time-format {
    width: 100px;
  }

  .time-wrap .field {
    width: 82px;
  }

  .time-wrap {
    padding: 0;
  }

  .title {
    margin: 0 10px 0 0;
    color: #adadad;
    font-weight: 400;
  }

  .icon {
    font-size: 30px;
    line-height: 24px;
    color: #f17fb5;
  }

  @media (max-width: 991px) {
    padding: 10px 0 0;
  }

  @media (max-width: 1199px) {
    div.time-wrap .time-format {
      width: 90px;
    }
  }

  @media (max-width: 991px) {
    div.time-wrap .time-format {
      width: 90px;
    }
  }

  @media (max-width: 767px) {
    font-size: 14px;

    .btn {
      font-size: 13px;
      min-width: inherit;
    }
  }

  @media (max-width: 374px) {
    font-size: 13px;
    line-height: 17px;

    li {
      padding: 10px 8px;
    }

    .btn {
      font-size: 14px;
      line-height: 15px;
      padding: 4px 8px;
    }

    .title {
      margin: 0 5px 0 0;
    }

    .icon {
      font-size: 18px;
    }
  }
`;

const DateAccordion = styled.div`
  .date-accordion {
    font-weight: 400;
    margin: 0 0 12px;
    padding: 0 25px;
  }

  .date-accordion.active .opener {
    color: #fff;
  }

  .date-accordion.active .opener:after {
    border-left-color: #fff;
    border-top-color: #fff;
    -webkit-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    transform: rotate(-135deg);
    top: 14px;
  }

  .date-accordion .opener {
    line-height: 22px;
    display: block;
    color: var(--pallete-text-main);
    text-decoration: none;
    text-align: center;
    position: relative;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 10px 40px;
  }

  .date-accordion .opener:hover {
    color: #fff;
  }

  .date-accordion .opener:hover:after {
    border-left-color: #fff;
    border-top-color: #fff;
  }

  .date-accordion .opener:after {
    right: 20px;
    top: 16px;
    width: 8px;
    height: 8px;
    content: '';
    border-left: 1px solid #000;
    border-top: 1px solid #000;
    position: absolute;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
  }

  .date-accordion .list-date {
    padding: 10px 15px 0;
  }

  @media (max-width: 991px) {
    .date-accordion .list-date {
      padding: 10px 0 0;
    }
  }

  @media (max-width: 767px) {
    .date-accordion {
      padding: 0 10px;
    }
  }
`;
interface ItemProps {
  title: string;
  open?: boolean;
  slot: Availability[];
  onSelect: (date: Date) => void;
}
const Item: React.FC<ItemProps> = ({
  title,
  open = false,
  slot = [],
  onSelect,
}: ItemProps) => {
  const [isOpened, setOpen] = useState<boolean>(open);
  return (
    <DateAccordion
      className={isOpened ? 'active date-accordion' : ' date-accordion'}
      onClick={() => {
        setOpen(!isOpened);
      }}
    >
      <span className="opener">
        <time dateTime="2020-07-20">{title}</time>
      </span>
      <ReactCollapse isOpened={isOpened}>
        <div className={isOpened ? 'slide' : 'slide js-acc-hidden'}>
          <ListDate className="list-date">
            {slot.map((data, index) => {
              const startTime = dayjs(`${data.date} ${data.startTime}`).format(
                'hh:mm A',
              );
              const endTime = dayjs(`${data.date} ${data.endTime}`).format(
                'hh:mm A',
              );
              return (
                <li key={index}>
                  <span className="icon icon-time"></span>
                  <span className="time-wrap">
                    <span className="title">Time:</span>
                    {startTime} - {endTime}
                  </span>
                  <span
                    className="btn btn-primary"
                    onClick={() =>
                      onSelect(dayjs(`${data.date} ${data.endTime}`).toDate())
                    }
                  >
                    Select
                  </span>
                </li>
              );
            })}
          </ListDate>
        </div>
      </ReactCollapse>
    </DateAccordion>
  );
};
export default Item;
