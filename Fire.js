const Fire = {
    /**
     * Initializes Firebase.
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
     * Signs the user up via email/password auth.
     *
     * @method signUpEmailPassword
     * 
     * @param {string} email - sign up email
     * @param {string} password - sign up password
     * @param {string} repassword - reentered sign up password
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for signup success; returns Firebase user as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for signup error; returns error as parameter
     */
    signUpEmailPassword (email, password, repassword, onSuccessCallback, onErrorCallback) {
        // check if given signUpEmail credentials are valid
        if (Fire.areEmailPasswordSignUpCredentialsValid(email, password, repassword)) {

            // create new user via email/password auth
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    if (onSuccessCallback) onSuccessCallback(user);
                })
                .catch(function (error) {
                    if (onErrorCallback) onErrorCallback(error);
                });
        } else {
            // sign up credentials invalid
            const error = {
                code: "Bad credentials",
                message: "Sign up credentials were invalid."
            }

            if (onErrorCallback) onErrorCallback(error);
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
     * Logs the user in via email/password auth.
     *
     * @method loginEmailPassword
     * 
     * @param {string} email - login email
     * @param {string} password - login password
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for login success; returns Firebase user as parameter
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
                    if (onErrorCallback) onErrorCallback(error);
                });
        } else {
            // login credentials invalid
            const error = {
                code: "Bad credentials",
                message: "Login credentials were invalid."
            }

            if (onErrorCallback) onErrorCallback(error);
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
     * Logs the user out.
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
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Reauthenticates the user so they may set primary email address, change password, or delete their account.
     *
     * @method reauthenticate
     * 
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful reauthentication
     * @param {callback} onErrorCallback - (OPTIONAL) callback for reauthentication error; returns error as parameter
     */
    reauthenticate (credential, onSuccessCallback, onErrorCallback) {
        firebase.auth().currentUser.reauthenticate(credential)
            .then(function() {
                if (onSuccessCallback) onSuccessCallback();
            }, function(error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Updates the user's email address.
     *
     * @method updateEmailAddress
     * 
     * @param {string} email - new email to update with
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful email update
     * @param {callback} onErrorCallback - (OPTIONAL) callback for email update error; returns error as parameter
     */
    updateEmailAddress (email, onSuccessCallback, onErrorCallback) {
        firebase.auth().currentUser.updateEmail(email)
            .then(function() {
                if (onSuccessCallback) onSuccessCallback();
            }, function(error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Sends the user an email address verification email.
     *
     * @method sendEmailVerification
     * 
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful email sent
     * @param {callback} onErrorCallback - (OPTIONAL) callback for send email error; returns error as parameter
     */
    sendEmailVerification (onSuccessCallback, onErrorCallback) {
        firebase.auth().currentUser.sendEmailVerification()
            .then(function() {
                if (onSuccessCallback) onSuccessCallback();
            }, function(error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Updates the user's password.
     *
     * @method updatePassword
     * 
     * @param {string} password - new password to update with
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful password update
     * @param {callback} onErrorCallback - (OPTIONAL) callback for password update error; returns error as parameter
     */
    updatePassword (password, onSuccessCallback, onErrorCallback) {
        firebase.auth().currentUser.updatePassword(newPassword)
            .then(function() {
                if (onSuccessCallback) onSuccessCallback();
            }, function(error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Sends the user a password reset email.
     *
     * @method sendPasswordResetEmail
     * 
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful password reset email sent
     * @param {callback} onErrorCallback - (OPTIONAL) callback for password reset email error; returns error as parameter
     */
    sendPasswordResetEmail (email, onSuccessCallback, onErrorCallback) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(function() {
                if (onSuccessCallback) onSuccessCallback();
            }, function(error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Deletes a user account.
     *
     * @method deleteUser
     * 
     * @param {callback} onSuccessCallback - (OPTIONAL) callback for successful user account deletion
     * @param {callback} onErrorCallback - (OPTIONAL) callback for user account deletion error; returns error as parameter
     */
    deleteUser (onSuccessCallback, onErrorCallback) {
        const currentUser = firebase.auth().currentUser;
        if(currentUser) currentUser.delete()
                            .then(function() {
                                if (onSuccessCallback) onSuccessCallback();
                            }, function(error) {
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
     * Reads data from realtime database (once).
     *
     * @method read
     * 
     * @param {DatabaseReference} reference - realtime database reference
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
     * Checks if a key exists as a direct child of a specified realtime database reference.
     *
     * @method exists
     * 
     * @param {DatabaseReference} reference - realtime database reference
     * @param {string} childKey - key to check for as a direct child of the specified realtime database reference
     * @param {callback} onSuccessCallback - callback for childKey exists; returns childKey's data as parameter
     * @param {callback} onErrorCallback - (OPTIONAL) callback for childKey nonexistent; returns error as parameter
     */
    exists (reference, childKey, onSuccessCallback, onErrorCallback) {
        this.read(reference, function (snapshot) {
            // get data at reference
            const data = snapshot.val();

            // get childKey exists status
            var exists = data.hasOwnProperty(childKey);
            
            // handle childKey's exist state
            if (exists) {
                onSuccessCallback(data[childKey]);
            } else {
                const error = {
                    code: "childKey nonexistent",
                    message: "childKey does not exist at the specified reference."
                };

                if (onErrorCallback) onErrorCallback(error);
            }

        }, onErrorCallback);
    },

    /**
     * Removes data at specified realtime database reference.
     *
     * @method listen
     * 
     * @param {DatabaseReference} reference - realtime database reference
     * @param {callback} onSuccessCallback - (OPTIONAL) callback on successful reference removal
     * @param {callback} onErrorCallback - (OPTIONAL) callback on reference removal error; returns error as parameter
     */
    remove (reference, onSuccessCallback, onErrorCallback) {
        reference.remove()
            .then (function () {
                if (onSuccessCallback) onSuccessCallback();
            })
            .catch (function (error) {
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
     * 
     * @return {DatabaseListener} - database listener at specified database reference
     */
    listen (reference, onChangeCallback, onErrorCallback) {
        return reference.on("value", 
            function (snapshot) {
                onChangeCallback(snapshot);
            }, function (error) {
                if (onErrorCallback) onErrorCallback(error);
            });
    },

    /**
     * Removes all listeners at specified realtime database reference.
     *
     * @method listen
     * 
     * @param {DatabaseReference} reference - realtime database reference
     * @param {callback} onSuccessCallback - (OPTIONAL) callback on successful database listener removal
     * @param {callback} onErrorCallback - (OPTIONAL) callback on database listener removal error; returns error as parameter
     */
    stop (reference, onSuccessCallback, onErrorCallback) {
        const off = reference.off();
        if (off) off
                    .then (function () {
                        if (onSuccessCallback) onSuccessCallback();
                    })
                    .catch (function (error) {
                        if (onErrorCallback) onErrorCallback(error);
                    });
    },

    /**
     * Returns current user's uid.
     *
     * @method getUserId
     * 
     * @return {string} - current user's uid
     */
    getUserId () {
        const currentUser = firebase.auth().currentUser;
        return (currentUser)? currentUser.uid : null;
        //return firebase.auth().currentUser.uid;
    },

    /**
     * Returns realtime database reference.
     *
     * @method getDatabase
     * 
     * @return {DatabaseReference} - realtime database reference
     */
    getDatabase () {
        return firebase.database().ref();
    }
}