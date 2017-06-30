// firebase config
var config = {
    apiKey: "AIzaSyCM4jxJnp53OEIxB8OH8M9o4hO16LRve9M",
    authDomain: "maymaywatch-87e73.firebaseapp.com",
    databaseURL: "https://maymaywatch-87e73.firebaseio.com",
    projectId: "maymaywatch-87e73",
    storageBucket: "maymaywatch-87e73.appspot.com",
    messagingSenderId: "649049722518"
};

const app = {
    memeCount: 0,

    /**
     * Initializes the app.
     *
     * @method init
     */
    init () {
        // general
        this.setSelectedMemeCategory("bestof");
        this.setAdminStatus(true);

        // attach listeners
        this.attachAllListeners();

        // initialize firebase
        Fire.init(config);
        Fire.createAuthStateListener(this.signinCallback, this.signoutCallback);
    },

    /**
     * Sets the admin status of the user. Dis/allows a user to add a meme.
     *
     * @method setAdminStatus
     */
    setAdminStatus (status) {
        isAdmin = status;
        this.toggleAddMemeForm(status);
        this.refreshMemeList();
    },

    /**
     * Shows/hides the addMemeForm.
     *
     * @method toggleAddMemeForm
     * 
     * @param {boolean} toggle - if true, shows addMemeForm; if false, hide it
     */
    toggleAddMemeForm (toggle) {
        const addMemeForm = document.getElementById("addMemeForm");

        if (toggle) {
            // form hidden, show it
            addMemeForm.classList.remove("hide");
        } else {
            // form showing, hide it
            addMemeForm.className += "hide";
        }
    },

    /**
     * Shows only top voted memes.
     *
     * @method showBestOfMemes
     */
    showBestOfMemes () {
        // reset the searchbar
        this.resetSearchBar();

        // set chosenMemeHeader
        this.setSelectedMemeCategory("bestof");

        // refresh [memes]
        this.refreshMemeList();
    },

    /**
     * Only shows image memes.
     *
     * @method showImageMemes
     */
    showImageMemes () {
        // reset the searchbar
        this.resetSearchBar();

        // set chosenMemeHeader
        this.setSelectedMemeCategory("image");

        // refresh [memes]
        this.refreshMemeList();
    },

    /**
     * Only shows video memes.
     *
     * @method showVideoMemes
     */
    showVideoMemes () {
        // reset the searchbar
        this.resetSearchBar();

        // set chosenMemeHeader
        this.setSelectedMemeCategory("video");

        // refresh [memes]
        this.refreshMemeList();
    },

    /**
     * Only shows sound memes.
     *
     * @method showSoundMemes
     */
    showSoundMemes () {
        // reset the searchbar
        this.resetSearchBar();

        // set chosenMemeHeader
        this.setSelectedMemeCategory("sound");

        // refresh [memes]
        this.refreshMemeList();
    },

    /**
     * Only shows searched memes.
     *
     * @method showSearchMemes
     */
    showSearchMemes (ev) {
        ev.preventDefault();

        // get searchTerm
        const searchTerm = document.getElementById("searchBar").value;

        // set selectedMeme
        this.setSelectedMemeCategory("search", searchTerm);

        // refresh [memes]
        this.refreshMemeList(searchTerm);
    },

    /**
     * Sets selectedCategory and updates #siteHeader.
     *
     * @method setSelectedMemeCategory
     * 
     * @param {string} category - category to set selectedCategory to
     * @param {string} searchTerm - (ONLY IF CATEGORY="search") term to search for
     */
    setSelectedMemeCategory (category, searchTerm) {
        // set selectedCategory
        selectedCategory = category;

        // change #siteHeader to mimic selectedCategory decision
        if (category == "search") {
            // category is "search"
            if (searchTerm) {
                // only show searchTerm if it exists
                document.getElementById("siteHeader").textContent = "MayMayWatch: Search: \"" + searchTerm +"\"";
            } else {
                document.getElementById("siteHeader").textContent = "MayMayWatch: Search: \"\"";
            }
        } else if (category == "bestof") {
            document.getElementById("siteHeader").textContent = "MayMayWatch: Best Of";
        } else {
            // change #siteHeader the same for the rest (images, videos, sounds)
            document.getElementById("siteHeader").textContent = "MayMayWatch: " + this.getProperString(category) + "s";
        }
    },

    /**
     * Only shows searched memes.
     *
     * @method resetSearchBar
     */
    resetSearchBar () {
        document.getElementById("searchBar").value = "";

        // change category and refresh [memes]
        selectedCategory = "bestOf";
        this.refreshMemeList();
    },

    /**
     * Handles submitting a new meme.
     *
     * @method submitMeme
     *
     * @param {event} ev - event callback
     */
    submitMeme (ev) {
        ev.preventDefault();

        // get the form
        const form = ev.target;

        // check if addMeme input bar is empty
        if (form.memeName.value.length == 0) {
            alert("Add meme bar is empty!");
            this.resetAddMemeForm(form);
            return;
        }

        // make sure at least one meme type is checked
        if (!form.imageCheckbox.checked && !form.videoCheckbox.checked && !form.soundCheckbox.checked) {
            alert("A meme always has a type!");
            this.resetAddMemeForm(form);
            return;
        }

        // check if meme already exists
        // check by 'name'
        const result = memes.filter(meme => meme.name == form.memeName.value);
        if (result.length) {
            alert("Meme already exists!");
            this.resetAddMemeForm(form);
            return;
        }

        // construct meme
        const meme = {
            id: this.memeCount,
            name: form.memeName.value,
            rating: 0,
            favourite: -1,
            category: ""
        };

        // add image category to meme if checked
        if (form.imageCheckbox.checked) {
            meme.category = "image";
        }

        // add video category to meme if checked
        if (form.videoCheckbox.checked) {
            meme.category += " video";
        }

        // add sound category to meme if checked
        if (form.soundCheckbox.checked) {
            meme.category += " sound";
        }

        // update the amount of memes
        this.memeCount++;

        // add meme to app.memes
        memes.push(meme);

        // refresh #memeList
        this.refreshMemeList();

        // reset form
        this.resetAddMemeForm(form);
    },

    /**
     * Resets the input fields of addMemeForm.
     *
     * @method resetAddMemeForm
     */
    resetAddMemeForm (form) {
        form.memeName.value = "";
        form.imageCheckbox.checked = false;
        form.videoCheckbox.checked = false;
        form.soundCheckbox.checked = false;
    },

    /**
     * Uses app.memes to populate #memeList.
     *
     * @method refreshMemeList
     */
    refreshMemeList (searchTerm) {
        // get #memeList
        const memeList = document.querySelector("#memeList");

        // clear #memeList of old memes
        while(memeList.firstChild) {
            memeList.removeChild(memeList.firstChild);
        }

        // get chosen category of memes
        let memeArray;

        if (selectedCategory == "bestof") {
            // filter memes by rating
            memeArray = memes;
        } else if (selectedCategory == "search") {
            // make sure searchTerm exists and isn't blank
            if (searchTerm && searchTerm.length != 0 && searchTerm != ""){
                memeArray = memes.filter(meme => meme.name.toLowerCase().includes(searchTerm.toLowerCase()));
            } else {
                memeArray = [];
            }
        } else {
            // filter memes by category
            memeArray = memes.filter(meme => meme.category.includes(selectedCategory));
        }

        // check if memArray has memes
        if (memeArray.length == 0) {
            // show "no memes :("
            memeList.appendChild(this.createNoMemesExistListItem());
        } else {
            // sort the memes based on their 'location' property
            // cycle through sorted memes, append them to #memeList as <li>
            memeArray
                .sort((a,b) => (a.rating < b.rating)? 1 : -1)
                .forEach(meme => memeList.appendChild(this.createMemeListItem(meme)));
        }
    },

    /**
     * Creates the createNoMemesExistListItem and places it into #memeList
     *
     * @method createNoMemesExistListItem
     */
    createNoMemesExistListItem () {
        // create new div
        const noMemesExistListItem = document.createElement("div");

        // configure
        noMemesExistListItem.id = "noMemesExistListItem";
        noMemesExistListItem.className = "text-center";
        noMemesExistListItem.textContent = "No Memes :(";

        // return newly created noMemesExistListItem
        return noMemesExistListItem;
    },

    /**
     * Creates a meme list item.
     *
     * @method createMemeListItem
     *
     * @param {string} name - name of the meme
     *
     * @return {li} returns a meme list item
     */
    createMemeListItem (meme) {
        // create the <li>
        const memeListItem = document.createElement("li");

        // configure
        memeListItem.id = meme.name;
        memeListItem.className = "grid-x text-center";

        memeListItem.appendChild(this.createMemeRatingLabel(meme));
        memeListItem.appendChild(this.createMemeNameLabel(meme));
        memeListItem.appendChild(this.createUpdootMemeButton(meme));
        memeListItem.appendChild(this.createDowndootMemeButton(meme));
        memeListItem.appendChild(this.createFavouriteMemeButton(meme));
        if (isAdmin) memeListItem.appendChild(this.createRemoveMemeButton(meme));

        // return finished <li>
        return memeListItem;
    },

    /**
     * Creates new memeRatingLabel.
     *
     * @method createMemeRatingLabel
     *
     * @param {object} meme - meme object
     */
    createMemeRatingLabel (meme) {
        // create the memeRatingLabel
        const memeRatingLabel = document.createElement("div");

        // configure
        memeRatingLabel.innerHTML = meme.rating;
        memeRatingLabel.className = "memeRatingLabel medium-1 cell";
        memeRatingLabel.dataset.meme = meme.name;

        // return finished memeRatingLabel
        return memeRatingLabel;
    },

    /**
     * Creates new memeNameLabel.
     *
     * @method createMemeNameLabel
     *
     * @param {object} meme - meme object
     */
    createMemeNameLabel (meme) {
        // create the memeNameLabel
        const memeNameLabel = document.createElement("div");

        // configure
        memeNameLabel.innerHTML = meme.name;
        memeNameLabel.className = "memeNameLabel auto cell text-left";
        memeNameLabel.dataset.meme = meme.name;

        // return finished memeNameLabel
        return memeNameLabel;
    },

    /**
     * Creates new favouriteMemeButton.
     *
     * @method createFavouriteMemeButton
     *
     * @param {object} meme - meme object
     */
    createFavouriteMemeButton (meme) {
        // create the favouriteMemeButton
        const favouriteMemeButton = document.createElement("button");

        // configure
        favouriteMemeButton.innerHTML = "💕";
        favouriteMemeButton.className = "medium-1 cell memeButton";
        favouriteMemeButton.dataset.meme = meme.name;

        if (meme.favourite == 1) {
            favouriteMemeButton.className += " favouriteMemeButton-selected";
        } else {
            favouriteMemeButton.className += " favouriteMemeButton-unselected";
        }

        // set event listener
        favouriteMemeButton.addEventListener("click", this.favouriteMeme);

        // return finished favouriteMemeButton
        return favouriteMemeButton;
    },

    /**
     * Creates new removeMemeButton.
     *
     * @method createRemoveMemeButton
     *
     * @param {object} meme - meme object
     */
    createRemoveMemeButton (meme) {
        // create new removeMemeButton
        const removeMemeButton = document.createElement("button");

        // configure
        removeMemeButton.innerHTML = "🗑️";
        removeMemeButton.className = "removeMemeButton medium-1 cell memeButton";
        removeMemeButton.dataset.meme = meme.name;

        // set event listener
        removeMemeButton.addEventListener("click", this.removeMeme);

        // return finished removeMemeButton
        return removeMemeButton;
    },

    /**
     * Creates new updootMemeButton.
     *
     * @method createUpdootMemeButton
     *
     * @param {object} meme - meme object
     */
    createUpdootMemeButton (meme) {
        // create new updootMemeButton
        const updootMemeButton = document.createElement("button");

        // configure
        updootMemeButton.innerHTML = "👍";
        updootMemeButton.className = "updootMemeButton medium-1 cell memeButton";
        updootMemeButton.dataset.meme = meme.name;

        // set event listener
        updootMemeButton.addEventListener("click", this.updootMeme);

        // return finished updootMemeButton
        return updootMemeButton;
    },

    /**
     * Creates new downdootMemeButton.
     *
     * @method createDowndootMemeButton
     *
     * @param {object} meme - meme object
     */
    createDowndootMemeButton (meme) {
        // create new downdootMemeButton
        const downdootMemeButton = document.createElement("button");

        // configure
        downdootMemeButton.innerHTML = "👎";
        downdootMemeButton.className = "downdootMemeButton medium-1 cell memeButton";
        downdootMemeButton.dataset.meme = meme.name;

        // set event listener
        downdootMemeButton.addEventListener("click", this.downdootMeme);

        // return finished downdootMemeButton
        return downdootMemeButton;
    },

    /**
     * Updoots a specified meme.
     *
     * @method updootMeme
     */
    updootMeme () {
        // get meme data
        const memeName = this.dataset.meme;
        const meme = memes.filter(meme => meme.name == memeName);
        
        // updoot meme
        const memeIndex = memes.indexOf(meme[0]);
        if (memeIndex > -1) {
            memes[memeIndex].rating++;
        }

        // refresh the meme list to mimic changes
        app.refreshMemeList();
    },

    /**
     * Downdoots a specified meme.
     *
     * @method downdootMeme
     */
    downdootMeme () {
        // get meme data
        const memeName = this.dataset.meme;
        const meme = memes.filter(meme => meme.name == memeName);
        
        // remove meme from memes
        const memeIndex = memes.indexOf(meme[0]);
        if (memeIndex > -1) {
            memes[memeIndex].rating--;
        }

        // refresh the meme list to mimic changes
        app.refreshMemeList();
    },

    /**
     * Favourites a specified meme.
     *
     * @method favouriteMeme
     */
    favouriteMeme () {
        // get meme data
        const memeName = this.dataset.meme;
        const meme = memes.filter(meme => meme.name == memeName);
        
        // remove meme from memes
        const memeIndex = memes.indexOf(meme[0]);
        if (memeIndex > -1) {
            memes[memeIndex].favourite *= -1;
        }

        // refresh the meme list to mimic changes
        app.refreshMemeList();
    },

    /**
     * Removes a specified meme from memes.
     *
     * @method removeMeme
     */
    removeMeme () {
        // get meme data
        const memeName = this.dataset.meme;
        const meme = memes.filter(meme => meme.name == memeName);
        
        // remove meme from memes
        const memeIndex = memes.indexOf(meme[0]);
        if (memeIndex > -1) {
            memes.splice(memeIndex, 1);
        }

        // refresh the meme list to mimic changes
        app.refreshMemeList();
    },

    /**
     * Brings up the signup modal.
     *
     * @method toggleSignupModal
     */
    toggleSignupModal (toggle) {
        // get necessary elements
        const modal = document.getElementById("signupModalBackground");

        if (this.id == "signupButton") {
            // show signupModal
            modal.style.display = "block";
        } else {
            // hide signupModal
            modal.style.display = "none";
        }

        if (toggle) {
            // show signupModal
            modal.style.display = "block";
        } else {
            // hide signupModal
            modal.style.display = "none";
        }

        console.log("modal this");
    },

    /**
     * Checks if a given string is only whitespace
     *
     * @method isTextOnlySpaces
     * 
     * @param {string} str - string to check
     * 
     * @return {boolean} returns true if str is only whitespace; false if otherwise
     */
    isTextOnlySpaces (str) {
        for (i=0; i<str.length; i++) {
            if (str.charAt(i) != " ") {
                return false;
            }
        }

        return true;
    },

    /**
     * Turns a string into a proper noun.
     *
     * @method getProperNoun
     * 
     * @param {string} str - the string to 'proper noun'-ify
     */
    getProperString (str) {
        // make sure str exists
        if (str) {
            str = str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            // Certain minor words should be left lowercase unless 
            // they are the first or last words in the string
            const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
            'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];

            for (i = 0, j = lowers.length; i < j; i++)
                str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
                function(txt) {
                    return txt.toLowerCase();
                });

            // Certain words such as initialisms or acronyms should be left uppercase
            const uppers = ['Id', 'Tv'];

            for (i = 0, j = uppers.length; i < j; i++)
                str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
                uppers[i].toUpperCase());

            // return proper string
            return str;
        } else {
            // str parameter doesn't exist, return null
            return null;
        }
    },

    /**
     * Handles what happens when a user signs in.
     *
     * @method signinCallback
     */
    signinCallback () {
        // set normie to logged in
        normie.loggedIn = true;
    },

    /**
     * Handles what happens when a user signs out.
     *
     * @method signoutCallback
     */
    signoutCallback () {
        // set normie to logged out
        normie.loggedIn = false;
    },

    /**
     * Signs user up in firebase.
     *
     * @method signup
     */
    signup (ev) {
        ev.preventDefault();

        // get the form
        const form = ev.target;

        // sign up credentials
        const email = form.email.value;
        const password = form.password.value;
        const repassword = form.repassword.value;

        console.log(email + " " + password + " " + repassword);

        // attempt signup
        Fire.signUpEmailPassword(email, password, repassword, true);

        // close the signupModal
        this.toggleSignupModal(false);
    },

    /**
     * Logs user into firebase.
     *
     * @method login
     */
    login (ev) {
        ev.preventDefault();

        // get the form
        const form = ev.target;

        // login credentials
        const email = form.email.value;
        const password = form.password.value;

        // attempt login
        Fire.loginEmailPassword(email, password, true);

        // close the signupModal
        this.toggleSignupModal(false);
    },

    /**
     * Attaches all listeners needed for app to function.
     *
     * @method attachAllListeners
     */
    attachAllListeners () {
        // attach addMemeForm listeners
        this.attachAddMemeFormListeners();

        // attach searchBar listeners
        this.attachSearchBarListeners();

        // attach memeCategoryButtons listeners
        this.attachMemeCategoryButtonListeners();

        // attach signupModal listeners
        this.attachSignupModalListeners();
    },

    /**
     * Attaches all listeners needed for the addMemeForm.
     *
     * @method attachAddMemeFormListeners
     */
    attachAddMemeFormListeners () {
        document.getElementById("addMemeForm").addEventListener("submit", this.submitMeme.bind(this));
    },

    /**
     * Attaches all listeners needed for the searchBar.
     *
     * @method attachSearchBarListeners
     */
    attachSearchBarListeners () {
        document.getElementById("searchForm").addEventListener("submit", this.showSearchMemes.bind(this));
        document.getElementById("searchForm").addEventListener("change", this.showSearchMemes.bind(this));
        document.getElementById("searchForm").addEventListener("keyup", this.showSearchMemes.bind(this));
    },

    /**
     * Attaches all listeners needed for the meme category buttons.
     *
     * @method attachMemeCategoryButtonListeners
     */
    attachMemeCategoryButtonListeners () {
        document.getElementById("category-bestOf").addEventListener("click", this.showBestOfMemes.bind(this));
        document.getElementById("category-images").addEventListener("click", this.showImageMemes.bind(this));
        document.getElementById("category-videos").addEventListener("click", this.showVideoMemes.bind(this));
        document.getElementById("category-sounds").addEventListener("click", this.showSoundMemes.bind(this));
    },

    /**
     * Attaches all listeners needed for the signupModal.
     *
     * @method attachSignupModalListeners
     */
    attachSignupModalListeners () {
        document.getElementById("signupModalButton").addEventListener("click", this.toggleSignupModal);
        document.getElementById("signupModalCloseButton").addEventListener("click", this.toggleSignupModal);
        document.getElementById("signupForm").addEventListener("submit", this.signup.bind(this));
        document.getElementById("loginForm").addEventListener("submit", this.login.bind(this));
    }
}

window.onload = function () {
    // initialize the app
    app.init();
};