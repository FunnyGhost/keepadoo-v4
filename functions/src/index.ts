import * as functions from 'firebase-functions';

exports.aggregateMoviesInList = functions.firestore
  .document('movies/{movieId}')
  .onWrite((snapshot, context) => {
    const movieId = context.params.movieId;
    console.log('Movie written', movieId);
  });
