import useControlledState from 'hooks/useControlledState';
import styled from 'styled-components';
import DateRangeSelectorItem from './item';

const TimeArea = styled.div`
  h4 {
    font-weight: 500;
    margin: 0 0 20px;
  }
`;

const slots = (slots: IPop['weeklyHours']) => {
  return {
    mon: slots?.filter((item) => item.dayOfTheWeek === 'Mon') || [],
    tue: slots?.filter((item) => item.dayOfTheWeek === 'Tue') || [],
    wed: slots?.filter((item) => item.dayOfTheWeek === 'Wed') || [],
    thu: slots?.filter((item) => item.dayOfTheWeek === 'Thu') || [],
    fri: slots?.filter((item) => item.dayOfTheWeek === 'Fri') || [],
    sat: slots?.filter((item) => item.dayOfTheWeek === 'Sat') || [],
    sun: slots?.filter((item) => item.dayOfTheWeek === 'Sun') || [],
  };
};

interface IState extends Partial<IPop> {
  mon: IPop['weeklyHours'];
  tue: IPop['weeklyHours'];
  wed: IPop['weeklyHours'];
  thu: IPop['weeklyHours'];
  fri: IPop['weeklyHours'];
  sat: IPop['weeklyHours'];
  sun: IPop['weeklyHours'];
}
const DateRangeSelector = ({
  value,
  onChange,
}: {
  value: Partial<IPop>;
  onChange: (a: any) => void;
}) => {
  const [state, setState] = useControlledState<IState>(
    { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
    {
      value: value as any,
      postState: (v) => ({ ...v, ...slots(v.weeklyHours) }),
      onChange: (v) => {
        const newValue = {
          ...v,
          weeklyHours: [
            ...v.mon!,
            ...v.tue!,
            ...v.wed!,
            ...v.thu!,
            ...v.fri!,
            ...v.sat!,
            ...v.sun!,
          ],
        };
        onChange(newValue);
      },
    },
  );

  const changeHandler = (name: string, value: any) => {
    setState((v) => {
      return { ...v, [name]: value };
    });
  };

  const {
    monEnabled,
    tueEnabled,
    thuEnabled,
    friEnabled,
    sunEnabled,
    wedEnabled,
    satEnabled,
    mon,
    tue,
    wed,
    thu,
    fri,
    sat,
    sun,
  } = state;
  return (
    <TimeArea className="time-area">
      <h4>Set your weekly hours</h4>
      <DateRangeSelectorItem
        title="SUN"
        name="sun"
        dayOfTheWeek="Sun"
        value={sun}
        onChange={changeHandler}
        isActive={sunEnabled}
      />
      <DateRangeSelectorItem
        title="MON"
        name="mon"
        dayOfTheWeek="Mon"
        value={mon}
        onChange={changeHandler}
        isActive={monEnabled}
      />
      <DateRangeSelectorItem
        title="TUE"
        name="tue"
        dayOfTheWeek="Tue"
        value={tue}
        onChange={changeHandler}
        isActive={tueEnabled}
      />
      <DateRangeSelectorItem
        title="WED"
        name="wed"
        dayOfTheWeek="Wed"
        value={wed}
        onChange={changeHandler}
        isActive={wedEnabled}
      />
      <DateRangeSelectorItem
        title="THU"
        name="thu"
        value={thu}
        dayOfTheWeek="Thu"
        onChange={changeHandler}
        isActive={thuEnabled}
      />
      <DateRangeSelectorItem
        title="FRI"
        dayOfTheWeek="Fri"
        name="fri"
        value={fri}
        onChange={changeHandler}
        isActive={friEnabled}
      />
      <DateRangeSelectorItem
        title="SAT"
        name="sat"
        value={sat}
        dayOfTheWeek="Sat"
        onChange={changeHandler}
        isActive={satEnabled}
      />
    </TimeArea>
  );
};

export default DateRangeSelector;
