import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomArbitrary = (min, max, float) => {
  if (min >= 0 && max >= min) {
    const randomNumber = Math.random() * (max - min) + min;
    return randomNumber.toFixed(float);
  }
};

const shuffleArray = (data) => {
  const array = data.slice();
  for (let itt = array.length - 1; itt > 0; itt--) {
    const jtt = Math.floor(Math.random() * (itt + 1));
    const temp = array[itt];
    array[itt] = array[jtt];
    array[jtt] = temp;
  }
  return array;
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

const generateFilmTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other'
  ];

  return titles[getRandomInt(0, titles.length - 1)];
};

const generateFilmPoster = () => {
  const images = [
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png',
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-dance-of-life.jpg',
    'images/posters/the-great-flamarion.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg'
  ];
  return images[getRandomInt(0, images.length - 1)];
};

const generateFilmDescription = () => {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptions = lorem.split('. ');
  return descriptions.slice(0, getRandomInt(0, descriptions.length)).join('. ');
};

const generateRandomEmoji = () => {
  const emojis = [
    'smile',
    'puke',
    'sleeping',
    'angry'
  ];
  return emojis[getRandomInt(0, emojis.length - 1)];
};

const people = ['Lee Aaker',
  'Willie Aames',
  'Quinton Aaron',
  'Victor Aaron',
  'Abbott and Costello',
  'Bruce Abbott',
  'Bud Abbott',
  'Christopher Abbott',
  'Philip Abbott',
  'Jake Abel',
  'Walter Abel',
  'Zachary Abel',
  'F.Murray Abraham',
  'Jon Abrahams',
  'Omid Abtahi',
  'Yousef Abu - Taleb',
  'Kirk Acevedo'
];

const generatePeople = (n) => {
  const randomPeople = shuffleArray(people);
  return randomPeople.slice(0, n);
};

const generateCountry = () => {
  const countries = [
    'Portugal',
    'Great Britain',
    'Estonia',
    'Ukraine',
    'France',
    'Netherlands',
    'Norway'
  ];
  return countries[getRandomInt(0, countries.length - 1)];
};

const generateGenre = () => {
  const genres = [
    'Comedy',
    'Thriller',
    'Drama',
    'Western',
    'Documentary'
  ];
  return shuffleArray(genres).slice(0, 2);
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomIntInclusive(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, 'day').toDate();
};

const generateFlag = () => Boolean(getRandomIntInclusive(0, 1));

const generateAllComments = () => {
  const MIN_COMMENT_COUNT = 0;
  const MAX_COMMENT_COUNT = 5;
  const commentCount = getRandomIntInclusive(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
  return Array.from({length: commentCount}, () => nanoid());
};


const generateFilmData = () => ({
  id: nanoid(),
  title: generateFilmTitle(),
  poster: generateFilmPoster(),
  description: generateFilmDescription(),
  comments: generateAllComments(),
  rating: getRandomArbitrary(0, 10, 1),
  director: generatePeople(1),
  screenwriters: generatePeople(2),
  actors: generatePeople(3),
  release: generateDate(),
  length: getRandomIntInclusive(60, 155),
  country: generateCountry(),
  genres: generateGenre(),
  ageRating: getRandomInt(0, 18),
  isInWatchlist: generateFlag(),
  isWatched: generateFlag(),
  isInFavorites: generateFlag(),
  watchingDate: new Date(),
});

export const getFilmsData = () => new Array(getRandomInt(3, 5) * 5).fill({}).map(generateFilmData);

export const generateComment = (commentId, filmId) => ({
  id: commentId,
  filmId: filmId,
  emoji: generateRandomEmoji(),
  data: '2019/12/31 23:59',
  author: 'user',
  text: generateFilmDescription(),
});

export const generateComments = (films) => {
  const comments = [];
  films.forEach((film) => {
    film.comments.forEach((comment) => {
      comments.push(generateComment(comment, film.id));
    });
  });

  return comments;
};


