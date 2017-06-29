// listeners
let memeListener;

/**
 * Initializes firebase.
 *
 * @method initFirebase
 * 
 * @param {object} config - firebase config 
 * @param {callback} onSignInCallback - (OPTIONAL) callback called on user sign in (auth)
 * @param {callback} onSignOutCallback - (OPTIONAL) callback called on user sign out (unauth)
 */
function initFirebase (config, onSignInCallback, onSignOutCallback) {
    // initialize firebase
    firebase.initializeApp(config);

    // set auth state changed listener 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // user is signed in.
            console.log("User is signed in.");

            // call onSignInCallback if it exists
            if (onSignInCallback) {
                onSignInCallback();
            }
        } else {
            // user is signed out
            console.log("User is signed out.");

            // call onSignOutCallback if it exists
            if (onSignOutCallback) {
                onSignOutCallback();
            }
        }
    });
}

/**
 * Signs a user up via email/password auth.
 *
 * @method signUpEmail
 * 
 * @param {string} email - sign up email
 * @param {string} password - sign up password
 * @param {string} repassword - reentered sign up password
 * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
 */
function signUpEmail (email, password, repassword, showAlert) {
    // check if given signUpEmail credentials are valid
    if (areSignUpCredentialsValid(email, password, repassword, showAlert)) {

        // create new user via email/password auth
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                // get error message
                const errorMessage = error.code + ": " + error.message;

                // print error message
                console.exception(errorMessage);
                alert("Failure to sign up!");
            }
        );
    }
}

/**
 * Checks to see if email sign up credentials are valid.
 *
 * @method areEmailSignUpCredentialsValid
 *
 * @param {string} email - sign up email
 * @param {string} password - sign up password
 * @param {string} repassword - reentered sign up password
 * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
 */
function areEmailSignUpCredentialsValid (email, password, repassword, showAlert) {
    let errorMessage;

    // email
    if (!email) {
        errorMessage = "Email is empty!";
    }

    if (email.length == 0) {
        errorMessage = "Email is too short!";
    }

    // password
    if (!password) {
        errorMessage = "Password is empty!";
    }

    if (password.length == 0) {
        errorMessage = "Password is too short!";
    }

    // repassword
    if (!repassword) {
        errorMessage = "Repassword is empty!";
    }

    if (repassword.length == 0) {
        errorMessage = "Repassword is too short!";
    }

    if (password != repassword) {
        errorMesage = "Password doesn't match Repassword!";
    }

    // handle errorMessage
    if (errorMessage) {
        // print errorMessage to console
        console.exception(errorMessage);

        // show alert only is specified
        if (showAlert) {
            alert(errorMessage);
        }

        // credentials invalid
        return false;
    } else {
        // credentials valid
        return true;
    }
}

/**
 * Logs in a user via email/password auth.
 *
 * @method loginEmail
 * 
 * @param {string} email - login email
 * @param {string} password - login password
 * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
 */
function loginEmail (email, password, showAlert) {
    // check if given loginEmail credentials are valid
    if (areEmailLoginCredentialsValid(email, password, showAlert)) {

        // create new user via email/password auth
        //TODO
    }
}

/**
 * Checks to see if email login credentials are valid.
 *
 * @method areEmailLoginCredentialsValid
 *
 * @param {string} email - sign up email
 * @param {string} password - sign up password
 * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
 */
function areEmailLoginCredentialsValid (email, password, showAlert) {
    let errorMessage;

    // email
    if (!email) {
        errorMessage = "Email is empty!";
    }

    if (email.length == 0) {
        errorMessage = "Email is too short!";
    }

    // password
    if (!password) {
        errorMessage = "Password is empty!";
    }

    if (password.length == 0) {
        errorMessage = "Password is too short!";
    }

    // handle errorMessage
    if (errorMessage) {
        // print errorMessage to console
        console.exception(errorMessage);

        // show alert only is specified
        if (showAlert) {
            alert(errorMessage);
        }

        // credentials invalid
        return false;
    } else {
        // credentials valid
        return true;
    }
}

/**
 * Logs out a user.
 *
 * @method logout
 */
function logout () {

}

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