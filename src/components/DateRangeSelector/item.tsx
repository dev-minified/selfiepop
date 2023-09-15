import { Plus } from 'assets/svgs';
import Checkbox from 'components/checkbox';
import NewButton from 'components/NButton';
import React from 'react';
import styled from 'styled-components';
import Rows from './row';

interface ItemProps {
  title: string;
  className?: string;
  value: any;
  dayOfTheWeek: 'Sun' | 'Sat' | 'Fri' | 'Thu' | 'Wed' | 'Tue' | 'Mon';
  onChange: (name: string, v: IPop['weeklyHours']) => void;
  name: string;
  isActive?: boolean;
}
// function giveUtc(start: string) {
//   const t = dayjs().format('YYYY-MM-DD');
//   // tslint:disable-next-line: prefer-template
//   const t1 = t + ' ' + start;
//   return dayjs(t1, 'YYYY-MM-DD h:mm A').format();
// }
const DateRangeSelectorItem: React.FC<ItemProps> = ({
  title,
  value = [],
  onChange,
  className,
  dayOfTheWeek,
  name,
  isActive,
}) => {
  const addTimeBlock = () => {
    const newArray = [...value];
    newArray.push({
      startTime: '09:00 am',
      endTime: '05:00 pm',
      dayOfTheWeek,
    });
    onChange(name, newArray);
  };

  const handleChange = (v: IPop['weeklyHours']) => {
    onChange(name, v);
  };
  const handleToggel = (e: any) => {
    if (value?.length === 0) {
      const newArray = [...value];
      newArray.push({
        startTime: '09:00 am',
        endTime: '05:00 pm',
        dayOfTheWeek,
      });
      onChange(name, newArray);
    }

    const { name: tName, checked } = e.target;
    onChange(tName, checked);
  };

  return (
    <div className={className}>
      <div className="switcher-holder">
        <Checkbox
          name={`${name}Enabled`}
          value={isActive}
          onChange={handleToggel}
        />
        <span className="day">{title}</span>
      </div>
      {!isActive ? (
        <div className="empty-block">Unavailable</div>
      ) : (
        <div className="slot-container">
          <Rows value={value} onChange={handleChange} />
          <NewButton
            outline
            className="btn-add"
            onClick={addTimeBlock}
            size="x-small"
            icon={<Plus />}
          ></NewButton>
        </div>
      )}
    </div>
  );
};
export default styled(DateRangeSelectorItem)`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid var(--pallete-colors-border);
  padding: 24px 50px 24px 0;
  position: relative;

  .checkbox {
    label {
      padding: 0;
    }
  }

  .switcher-holder {
    padding: 8px 10px 0 0;
    width: 107px;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: var(--pallete-text-main);
    .day {
      padding: 0 0 0 10px;
    }
  }

  .slot-container {
    flex-grow: 1;
    flex-basis: 0;
  }

  .btn-add {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .empty-block {
    font-size: 16px;
    padding: 8px 10px 0 10px;
    color: #a2a2a2;
  }
`;
