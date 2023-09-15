import { timezones } from 'appconstants';
import { Calendar } from 'assets/svgs';
import DateRangeSelector from 'components/DateRangeSelector';
import FormItem from 'components/Form/FromItem';
import Select from 'components/Select';
import { CardSection } from 'components/SPCards/SimpleCard';
import { DashedLine } from 'components/Typography';
import styled from 'styled-components';

const timeZOneOption = timezones.map((data: string) => ({
  value: data,
  label: data,
}));
const eventDuration = Array.from(Array(12).keys()).map((_, index) => {
  return {
    value: `${(index + 1) * 5}`,
    label: `${(index + 1) * 5} mins`,
  };
});
const SelectArea = styled.div`
  margin-bottom: 20px;
  + .select-area {
    padding: 20px 0 0;
  }
  .switcher-holder {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: var(--pallete-text-main);
    margin: 0 0 10px;

    .day {
      // padding: 0 0 0 10px;
    }
  }
`;

interface Props {
  value: Partial<IPop>;
  onChange: (v: Partial<IPop>) => void;
}

const PopLiveSection = ({ value, onChange }: Props) => {
  const { timeIntervalBetweenEvents, timeZone } = value;

  const changeHandler = (name: string, value: any) => {
    const newValue = { ...value, [name]: value };
    onChange(newValue);
  };

  return (
    <div className="schedule-block">
      <DashedLine className="dashed" />
      <div className="addition__art mb-30 pt-30">
        <CardSection
          title="Availability Schedule"
          subtitle="Set your schedule of availabilty for video chatting"
          icon={<Calendar />}
        >
          <FormItem label="Your Time Zone"></FormItem>
          <Select
            placeholder="select a timezone"
            options={timeZOneOption}
            value={
              timeZone
                ? {
                    label: timeZone!,
                    value: timeZone!,
                  }
                : undefined
            }
            onChange={(value) => {
              changeHandler('timeZone', value?.value);
            }}
          />
          <hr className="my-30" />
          <DateRangeSelector value={value} onChange={onChange} />
          <div className="pt-40">
            <FormItem label="Set minimum time before and after every event."></FormItem>
            <SelectArea>
              <div className="switcher-holder">
                <span className="day">Event Gap</span>
              </div>
              <div className="select-md">
                <Select
                  options={eventDuration}
                  value={{
                    value: `${timeIntervalBetweenEvents}`,
                    label: `${timeIntervalBetweenEvents} mins`,
                  }}
                  onChange={(value) => {
                    changeHandler(
                      'timeIntervalBetweenEvents',
                      Number(value?.value),
                    );
                  }}
                />
              </div>
            </SelectArea>
            {/* <SelectArea>
              <div className="switcher-holder">
                <span className="day">After Event</span>
              </div>
              <div className="select-md">
                <Select
                  options={eventDuration}
                  value={{
                    value: `${timeBeforeEventEnd}`,
                    label: `${timeBeforeEventEnd} mins`,
                  }}
                  onChange={(value) => {
                    changeHandler('timeBeforeEventEnd', Number(value?.value));
                  }}
                />
              </div>
            </SelectArea> */}
          </div>
        </CardSection>
      </div>
    </div>
  );
};

export default PopLiveSection;
