import dayjs from 'dayjs';


export const sortDate = (filmA, filmB) => (
  dayjs(filmB.release).diff(dayjs(filmA.release))
);

export const sortRating = (filmA, filmB) => {
  const ratingA = parseFloat(filmA.rating);
  const ratingB = parseFloat(filmB.rating);

  if (ratingA < ratingB) {
    return 1;
  }

  if (ratingA > ratingB) {
    return -1;
  }

  return 0;
};
