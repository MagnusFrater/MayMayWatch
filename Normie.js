/**
 * Normie object constructor.
 *
 * @method Normie
 *
 * @param {boolean} loggedIn - specifies if user is logged in
 * @param {boolean} isAdmin - specifies if user has admin priviliges
 * @param {string} username - username
 * @param {object} likes - user's 'liked' memes
 * @param {object} dislikes - user's 'disliked' memes
 * @param {object} favourites - user's 'favourited' memes
 */
function Normie (loggedIn, isAdmin, username, likes, dislikes, favourites) {
    this.loggedIn = loggedIn;
    this.isAdmin = isAdmin;
    this.username = username;
    this.likes = likes;
    this.dislikes = dislikes;
    this.favourites = favourites;
}

/**
 * Adds a new 'liked' meme.
 *
 * @method Normie.like
 * 
 * @param {string} memeName - name of the meme
 */
Normie.prototype.like = function (memeName) {
    this.likes.memeName = memeName;
}

/**
 * Adds a new 'disliked' meme.
 *
 * @method Normie.dislike
 * 
 * @param {string} memeName - name of the meme
 */
Normie.prototype.dislike = function (memeName) {
    this.dislikes.memeName = memeName;
}

/**
 * Adds a new 'favourited' meme.
 *
 * @method Normie.favourite
 * 
 * @param {string} memeName - name of the meme
 */
Normie.prototype.favourite = function (memeName) {
    this.favourites.memeName = memeName;
}

/**
 * Resets a normies data to disallow them certain logged in or admin priviliges.
 *
 * @method Normie.reset
 */
Normie.prototype.reset = function () {
    this.loggedIn = false;
    this.isAdmin = false;
    this.username = "";
    this.likes = {};
    this.dislikes = {};
    this.favourites = {};
}