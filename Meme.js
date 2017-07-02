/**
 * Meme object constructor.
 *
 * @method Meme
 *
 * @param {string} name - name
 * @param {string} category - category (image, video, sound)
 * @param {integer} rating - rating (by up/down doots)
 * @param {string} reference - link to knowyourmeme.com meme reference page
 * @param {string} resource - link to image/video/sound file that exemplifies given meme
 */
function Meme (name, category, rating, reference, resource) {
    this.name = name;
    this.category = category;
    this.rating = rating;
    this.reference = reference;
    this.resource = resource;

    this.updooted = false;
    this.downdooted = false;
    this.favourited = false;
}