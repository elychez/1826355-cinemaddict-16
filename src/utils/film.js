import dayjs from 'dayjs';


export const sortDate = (filmA, filmB) => (
  dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date))
);

export const sortRating = (filmA, filmB) => {
  const ratingA = parseFloat(filmA.filmInfo.totalRating);
  const ratingB = parseFloat(filmB.filmInfo.totalRating);
  if (ratingA < ratingB) {
    return 1;
  }

  if (ratingA > ratingB) {
    return -1;
  }

  return 0;
};
