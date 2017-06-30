// listeners
let memeListener;

const Fire = {
    /**
     * Initializes firebase.
     *
     * @method initFirebase
     * 
     * @param {object} config - firebase config 
     */
    init (config) {
        firebase.initializeApp(config);
    },

    /**
     * Allows ability to attach callbacks on user sign in/out events.
     *
     * @method createAuthStateListener
     * 
     * @param {callback} onSignInCallback - (OPTIONAL) callback called on user sign in (auth)
     * @param {callback} onSignOutCallback - (OPTIONAL) callback called on user sign out (unauth)
     */
    createAuthStateListener (onSignInCallback, onSignOutCallback) {
        // set auth state changed listener 
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // user is signed in.
                console.log("Fire: User is signed in.");

                // call onSignInCallback if it exists
                if (onSignInCallback) onSignInCallback();
            } else {
                // user is signed out
                console.log("Fire: User is signed out.");

                // call onSignOutCallback if it exists
                if (onSignOutCallback) onSignOutCallback();
            }
        });
    },

    /**
     * Signs a user up via email/password auth.
     *
     * @method signUpEmailPassword
     * 
     * @param {string} email - sign up email
     * @param {string} password - sign up password
     * @param {string} repassword - reentered sign up password
     * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
     */
    signUpEmailPassword (email, password, repassword, showAlert) {
        // check if given signUpEmail credentials are valid
        if (Fire.areEmailPasswordSignUpCredentialsValid(email, password, repassword, showAlert)) {

            // create new user via email/password auth
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .catch(function(error) {
                    // get error message
                    const errorMessage = "Fire: " + error.code + ": " + error.message;

                    // print error message
                    console.log("Fire: Failure to signup via email/password authentication!");
                    console.log(errorMessage);

                    if (showAlert) alert("Failure to sign up!");
                }
            );
        }
    },

    /**
     * Checks to see if email sign up credentials are valid.
     *
     * @method areEmailPasswordSignUpCredentialsValid
     *
     * @param {string} email - sign up email
     * @param {string} password - sign up password
     * @param {string} repassword - reentered sign up password
     * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
     */
    areEmailPasswordSignUpCredentialsValid (email, password, repassword, showAlert) {
        let errorMessage = null;

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
            errorMessage = "Fire: " + errorMessage;

            // print errorMessage to console
            console.log(errorMessage);

            // show alert only is specified
            if (showAlert) alert(errorMessage);

            // credentials invalid
            return false;
        } else {
            // credentials valid
            return true;
        }
    },

    /**
     * Logs in a user via email/password auth.
     *
     * @method loginEmailPassword
     * 
     * @param {string} email - login email
     * @param {string} password - login password
     * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
     */
    loginEmailPassword (email, password, showAlert) {
        // check if given loginEmail credentials are valid
        if (Fire.areEmailPasswordLoginCredentialsValid(email, password, showAlert)) {
            // create new user via email/password auth

            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(function(error) {
                    // get error message
                    const errorMessage = "Fire: " + error.code + ": " + error.message;

                    // print error message
                    console.log("Fire: Failure to login via email/password authentication!");
                    console.log(errorMessage);

                    if (showAlert) alert("Failure to login!");
                }
            );
        }
    },

    /**
     * Checks to see if email login credentials are valid.
     *
     * @method areEmailPasswordLoginCredentialsValid
     *
     * @param {string} email - sign up email
     * @param {string} password - sign up password
     * @param {boolean} showAlert - (OPTIONAL) show errorMessage as alert
     */
    areEmailPasswordLoginCredentialsValid (email, password, showAlert) {
        let errorMessage = null;

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
            errorMessage = "Fire: " + errorMessage;

            // print errorMessage to console
            console.log(errorMessage);

            // show alert only is specified
            if (showAlert) alert(errorMessage);

            // credentials invalid
            return false;
        } else {
            // credentials valid
            return true;
        }
    },

    /**
     * Logs a user out.
     *
     * @method logout
     */
    logout () {

    }
}