import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'styles/datepicker-area.css';
import 'styles/datepicker.css';

export type DateRangeType = [Date, Date];
interface Props {
  dateRange: DateRangeType;
  onChange: (dateRange: DateRangeType) => void;
}

const CustomInputStart = ({ value, onClick }: any) => (
  <span className="datepicker-area__start" onClick={onClick}>
    {value}
  </span>
);
const CustomInputEnd = ({ value, onClick }: any) => (
  <span className="datepicker-area__end" onClick={onClick}>
    {value}
  </span>
);

const DatePicker: React.FC<Props> = (props) => {
  const { dateRange, onChange } = props;

  return (
    <div className="datepicker-area">
      <i className="icon">
        <img src="/assets/images/svg/icon-calendar.svg" alt="img description" />
      </i>
      <span className="starting-date">
        <ReactDatePicker
          selected={dateRange[0]}
          dateFormat="MMM dd, yyy"
          onChange={(date) => {
            onChange([date as Date, dateRange[1]]);
          }}
          customInput={<CustomInputStart />}
          className="rc-date__picker"
        />
      </span>
      <span className="datepicker-area__separator">-</span>
      <span className="ending-date">
        <ReactDatePicker
          selected={dateRange[1]}
          dateFormat="MMM dd, yyy"
          onChange={(date) => {
            onChange([dateRange[0], date as Date]);
            // setDateRange((s: any) => {
            //   const n = { ...s, endDate: date };
            //   const md: string = stringify({
            //     st: dayjs(n.startDate).format('MM/DD/YYYY'),
            //     sd: dayjs(n.endDate).format('MM/DD/YYYY'),
            //   });
            //   history.push(`?${md}`);
            //   return n;
            // });
          }}
          customInput={<CustomInputEnd />}
          className="rc-date__picker"
        />
      </span>
    </div>
  );
};

export default DatePicker;
