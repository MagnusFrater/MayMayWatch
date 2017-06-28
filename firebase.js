// GLOBAL DATA
memes = {};
// GLOBAL DATA

// firebase data
let memeListener;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCM4jxJnp53OEIxB8OH8M9o4hO16LRve9M",
    authDomain: "maymaywatch-87e73.firebaseapp.com",
    databaseURL: "https://maymaywatch-87e73.firebaseio.com",
    projectId: "maymaywatch-87e73",
    storageBucket: "maymaywatch-87e73.appspot.com",
    messagingSenderId: "649049722518"
};
firebase.initializeApp(config);

// sign in anonymously
firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    console.error(error.code);
    console.error(error.message);
});

// check authentication state changes
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //var isAnonymous = user.isAnonymous;
    //var uid = user.uid;
    console.log("User is signed in anonymously.");

    // get memes from online database
    getMemes();

  } else {
    console.log("User is signed out.");
  }
});

// add a new meme to the database
function addNewMeme (category, meme) {
    const memeRef = firebase.database().ref('memes/' + category + "/" + meme.name);

    memeRef.set({
        rating: meme.rating
    });
}

// sets the meme listener to a specific category
function setMemeListener (category) {
    const categoryRef = firebase.database().ref('memes/' + category);

    categoryRef.on('value', function(snapshot) {
        getMemes();
    });
}

// get memes from firebase realtime database
function getMemes (snapshot) {
    
}