import { RecycleBin } from 'assets/svgs';
import NewButton from 'components/NButton';
import styled from 'styled-components';
import Select from '../Select';

const options: { value: string; label: string }[] = [];
['am', 'pm'].forEach((ap) => {
  [...Array(12)].forEach((_, hours) => {
    [...Array(12)].forEach((_, minutes) => {
      const m = ((minutes + 1) * 5) % 60;
      const h = hours + 1;
      options.push({
        value: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m} ${ap}`,
        label: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m} ${ap}`,
      });
    });
  });
});

const SlotItem = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;

  &:only-child {
    .button {
      display: none;
    }
  }

  + .time-box {
    padding-top: 10px;
  }

  .time-wrap {
    display: flex;
    flex-direction: row;
    position: relative;
    margin: 0 10px 0 0;

    &:after {
      position: absolute;
      left: calc(50% - 2px);
      top: 50%;
      width: 5px;
      height: 1px;
      background: #000;
      content: '';
      transform: translate(-50% -50%);
    }

    .react-select__menu {
      min-width: 123px;
      font-size: 15px;
    }

    .react-select__control {
      .react-select__value-container {
        @media (max-width: 479px) {
          padding-left: 3px;
        }
      }
    }
  }

  .time-format {
    width: 116px;
    padding: 0 12px;

    @media (max-width: 479px) {
      width: 90px;
      padding: 0 8px;
    }
  }

  .react-select__control {
    border-color: var(--pallete-background-pink);
    border-radius: 5px;

    &:hover,
    &:focus {
      border-color: var(--pallete-background-pink);
    }
    .react-select__indicators {
      display: none;
    }

    .react-select__value-container {
      padding-left: 15px;
    }
  }
`;

function Rows({
  value,
  onChange,
}: {
  value: IPop['weeklyHours'];
  className?: string;
  onChange?: (i?: IPop['weeklyHours']) => void;
}) {
  const changeHanlder = (index: number, name: string, v: string) => {
    const newv = [...value!];
    newv[index] = { ...newv[index], [name]: v };
    onChange && onChange(newv);
  };

  const deleteHanlder = (index: number) => {
    const newv = [...value!];
    newv?.splice(index, 1);
    onChange && onChange(newv);
  };
  return (
    <div className={`className`}>
      {value?.map(({ startTime, endTime, isError }: any, index: number) => {
        return (
          <SlotItem className="time-box" key={index}>
            <div className="time-detail">
              <div className="time-wrap">
                <div className="time-format select-holder">
                  <Select
                    options={options}
                    size="x-small"
                    onChange={(value) =>
                      changeHanlder(index, 'startTime', value?.value!)
                    }
                    styles={{
                      control: (s) =>
                        isError ? { ...s, borderColor: 'red !important' } : s,
                    }}
                    isSearchable
                    value={{
                      label: startTime,
                      value: startTime,
                    }}
                  />
                </div>
                <div className="time-format select-holder">
                  <Select
                    options={options}
                    size="x-small"
                    onChange={(value) =>
                      changeHanlder(index, 'endTime', value?.value!)
                    }
                    styles={{
                      control: (s) =>
                        isError ? { ...s, borderColor: 'red !important' } : s,
                    }}
                    isSearchable
                    value={{
                      label: endTime,
                      value: endTime,
                    }}
                  />
                </div>
              </div>
            </div>
            {value.length > 1 ? (
              <NewButton
                outline
                onClick={() => deleteHanlder(index)}
                size="x-small"
                icon={<RecycleBin />}
              ></NewButton>
            ) : null}
          </SlotItem>
        );
      })}
    </div>
  );
}

export default styled(Rows)``;
