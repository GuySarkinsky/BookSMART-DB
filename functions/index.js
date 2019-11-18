const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// if bookmark name && author are not exists creates new book
exports.createBook = functions.firestore
  .document("bookmarks/{id}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    const newValue = snap.data();

    // if book name && author name are not exists in books create new book
    let booksRef = admin.firestore().collection("books");
    booksRef
      .where("name", "==", newValue.name)
      .where("author", "==", newValue.author)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          booksRef.add({
            name: newValue.name,
            author: newValue.author,
            gener: newValue.gener,
            series: newValue.series,
            total: newValue.total
          });
        }
        return true;
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });

// getting user bookmarks data
exports.getingUserBookmarks = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .document("bookmarks/{id}")
    .where("useruid", "==", request.params.uid)
    .get()
    .then(snapshot => {
      if (snapshot) {
        response.send(snapshot.data());
      }
      return true;
    })
    .catch(() => {
      console.log(err);
      response.status(500).send(err);
    });
});

// getting user bookmarks data
exports.getingUserBookmarksTest = functions.https.onRequest(
  (request, response) => {
    let bkmrks = [];

    return (
      admin
        .firestore()
        .collection("bookmarks")
        // .where("useruid", "==", request.params.uid)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              var newDoc = doc.data();
              bkmrks = bkmrks.concat(newDoc);
            });
          } else {
            bkmrks = "No docs found!";
          }

          response.send(bkmrks);
          return bkmrks;
        })
        .catch(error => {
          response.status(500).send(error);
          return error;
        })
    );
  }
);
