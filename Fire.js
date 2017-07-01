const Fire = {
    /**
     * Initializes firebase.
     *
     * @method initFirebase
     * 
     * @param {object} config - Firebase config 
     */
    init (config) {
        firebase.initializeApp(config);
    },

    /**
     * Allows ability to attach callbacks on user sign in/out events.
     *
     * @method createAuthStateListener
     * 
     * @param {callback} onSignInCallback - (OPTIONAL) callback for user authenticated; returns Firebase user as parameter
     * @param {callback} onSignOutCallback - (OPTIONAL) callback for user un-authenticated
     */
    createAuthStateListener (onSignInCallback, onSignOutCallback) {
        // set auth state changed listener 
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // user authenticated
                if (onSignInCallback) onSignInCallback(user);
            } else {
                // user un-authenticated
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
     * @param {callback} onSuccessCallback - callback for signup success; returns Firebase user as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for signup error; returns error as parameter
     */
    signUpEmailPassword (email, password, repassword, onSuccessCallback, onErrorCallback) {
        // check if given signUpEmail credentials are valid
        if (Fire.areEmailPasswordSignUpCredentialsValid(email, password, repassword)) {

            // create new user via email/password auth
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    // successful sign up
                    if (onSuccessCallback) onSuccessCallback(user);
                })
                .catch(function (error) {
                    // get error message
                    const errorMessage = "Fire: " + error.code + ": " + error.message;

                    // print error message
                    console.log("Fire: Failure to signup via email/password authentication!");
                    console.log(errorMessage);

                    if (onErrorCallback) onErrorCallback(error);
                });
        } else {
            // sign up credentials invalid
            if (onErrorCallback) onErrorCallback();
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
     */
    areEmailPasswordSignUpCredentialsValid (email, password, repassword) {
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
     * @param {callback} onSuccessCallback - callback for login success; returns Firebase user as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for login error; returns error as parameter
     */
    loginEmailPassword (email, password, onSuccessCallback, onErrorCallback) {
        // check if given loginEmail credentials are valid
        if (Fire.areEmailPasswordLoginCredentialsValid(email, password)) {
            
            // create new user via email/password auth
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    // successful login
                    if (onSuccessCallback) onSuccessCallback(user);
                })
                .catch(function (error) {
                    // get error message
                    const errorMessage = "Fire: " + error.code + ": " + error.message;

                    // print error message
                    console.log("Fire: Failure to login via email/password authentication!");
                    console.log(errorMessage);

                    if (onErrorCallback) onErrorCallback(error);
                });
        } else {
            // login credentials invalid
            if (onErrorCallback) onErrorCallback();
        }
    },

    /**
     * Checks to see if email login credentials are valid.
     *
     * @method areEmailPasswordLoginCredentialsValid
     *
     * @param {string} email - sign up email
     * @param {string} password - sign up password
     */
    areEmailPasswordLoginCredentialsValid (email, password) {
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
     * 
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for logout success
     * @param {callback} onErrorCallback - (OPTIONAL) callback for logout error; returns error as parameter
     */
    logout (onSuccessCallback, onErrorCallback) {
        firebase.auth().signOut()
            .then(function () {
                // successful logout
                if (onSuccessCallback) onSuccessCallback();
            })
            .catch(function (error) {
                // get error message
                const errorMessage = "Fire: " + error.code + ": " + error.message;

                // print error message
                console.log("Fire: Failure to logout");
                console.log(errorMessage);

                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Writes data to a database reference.
     *
     * @method write
     * 
     * @param {DatabaseReference} reference - realtime database reference
     * @param {object} data - information to write to reference
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for write success; returns new reference as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for write error; returns error as parameter
     */
    write (reference, data, onSuccessCallback, onErrorCallback) {
        reference.set(data)
            .then(function (ref) {
                // successful write
                if (onSuccessCallback) onSuccessCallback(ref);
            })
            .catch(function (error) {
                // write error
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Reads data from Firebase realtime database (once).
     *
     * @method read
     * 
     * @param {DatabaseReference} reference - Firebase realtime database reference
     * @param {callback} onReadCallback - callback for read success; returns snapshot as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for read error; returns error as parameter
     */
    read (reference, onReadCallback, onErrorCallback) {
        return reference.once("value")
            .then(function(snapshot) {
                //successful read
                onReadCallback(snapshot);
            })
            .catch(function (error) {
                // read error
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Listens for data changes at specified realtime database reference.
     *
     * @method listen
     * 
     * @param {DatabaseReference} reference - realtime database reference
     * @param {callback} onChangeCallback - callback for data change at reference; returns reference snapshot as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for listen error; returns error as parameter
     */
    listen (reference, onChangeCallback, onErrorCallback) {
        reference.on("value", function(snapshot) {
            onChangeCallback(snapshot);
        })
        .catch(function (error) {
            if (onErrorCallback) onErrorCallback(error);
        });
    },

    /**
     * Returns Firebase realtime database reference.
     *
     * @method getDatabase
     * 
     * @return {DatabaseReference} - Firebase realtime database reference
     */
    getDatabase () {
        return firebase.database();
    }
}