type Availability = {
  date: string;
  startTime: string;
  endTime: string;
};
type IDateSelector = {
  availability: Availability[];
  onSelect: (date: Date) => void;
};
