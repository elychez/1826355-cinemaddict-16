import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import duration from 'dayjs/plugin/duration';

dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(duration);

export const getDuration = (minutes) => {
  const time = dayjs.duration(minutes, 'minutes');
  return {
    hours: time.format('H'),
    minutes: time.format('m')
  };
};

export const getRunTime = (minutes) => {
  const time = dayjs.duration(minutes, 'minutes');
  return {
    hours: time.hours(),
    minutes: time.minutes()
  };
};
