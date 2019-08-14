import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

exports.aggregateMoviesInListOnCreate = functions.firestore
  .document('movies/{movieId}')
  .onCreate(async (snapshot, context) => {
    const listId = (snapshot.data() as any).listId;

    return await aggregateMoviesInList(listId);
  });

exports.aggregateMoviesInListOnDelete = functions.firestore
  .document('movies/{movieId}')
  .onDelete(async (snapshot, context) => {
    const listId = (snapshot.data() as any).listId;

    return await aggregateMoviesInList(listId);
  });

async function aggregateMoviesInList(listId: string) {
  console.log('listId', listId);
  const movies = await admin
    .firestore()
    .collection('movies')
    .where('listId', '==', listId)
    .orderBy('added_on', 'desc')
    .get();

  // get the total comment count
  const moviesCount = movies.size;
  console.log('moviesCount', moviesCount);

  const recentMovies: any[] = [];
  // add data from the 5 most recent movies to the array
  movies.forEach(doc => {
    recentMovies.push(doc.data());
  });
  recentMovies.splice(5);
  console.log('recent movies', recentMovies);

  // run update
  const list = admin
    .firestore()
    .collection('movies-lists')
    .doc(listId);
  return list.update({ moviesCount, recentMovies });
}
