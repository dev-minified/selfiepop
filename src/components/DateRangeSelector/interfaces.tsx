export interface TimeSlotInterface {
  _id?: string;
  startTime: string;
  endTime: string;
}

export interface DaySlotInterface {
  slots: TimeSlotInterface[];
  day: string;
  active: boolean;
}

export interface TimeComponents {
  hours: string;
  minutes: string;
  ampm: string;
}

export const days: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// tslint:disable-next-line: ter-arrow-parens
