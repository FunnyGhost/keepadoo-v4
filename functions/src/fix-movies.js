// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const axios = require('axios');
const firebase = require('firebase/app');

// Add the Firebase products that you want to use
require('firebase/auth');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyCmdoGjhIkg5Xz2okqrX4dEZZZlCOPGAjA',
  authDomain: 'keepadoo.firebaseapp.com',
  databaseURL: 'https://keepadoo.firebaseio.com',
  projectId: 'keepadoo',
  storageBucket: 'keepadoo.appspot.com',
  messagingSenderId: '516267612124',
  appId: '1:516267612124:web:6dcff203983d3260'
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

async function getMovies() {
  const movies = await db.collection('movies').get();
  return movies;
}

async function getMoviesLists() {
  const moviesLists = await db.collection('movies-lists').get();
  return moviesLists;
}

async function getNewMovie(movieId) {
  var tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=d7c178b732e89a3e82d70f43186af535`;
  return axios.get(tmdbUrl);
}

async function updateMovies() {
  const movies = await getMovies();

  movies.forEach(async movie => {
    const tmdbId = movie.data().id;
    console.log('Processing movie', tmdbId);
    const newMovie = await getNewMovie(tmdbId);

    console.log('Updating movie', movie.id);
    await db
      .collection('movies')
      .doc(movie.id)
      .set(newMovie.data, { merge: true });
  });
  console.log('DONE');
}

async function updateMoviesLists() {
  const moviesLists = await getMoviesLists();
  moviesLists.forEach(async moviesList => {
    console.log('Processing list', moviesList.id);
    const newMoviesList = moviesList.data();
    const recentMovies = moviesList.data().recentMovies;
    const newRecentMovies = [];

    for (let index = 0; index < recentMovies.length; index++) {
      console.log('Processing movie', recentMovies[index].id);
      const tmdbId = recentMovies[index].id;
      const newMovie = (await getNewMovie(tmdbId)).data;
      newMovie.added_on = recentMovies[index].added_on;

      newRecentMovies.push(newMovie);
    }

    newMoviesList.recentMovies = newRecentMovies;
    console.log('Updating list', moviesList.id);
    await db
      .collection('movies-lists')
      .doc(moviesList.id)
      .set(newMoviesList, { merge: true });
  });
}

// updateMovies();
// updateMoviesLists();
