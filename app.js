const app = {
    init (formName) {
        document
            .querySelector(formName)
            .addEventListener('submit', this.handleSubmit.bind(this));
    },

    memeCount: 0,

    handleSubmit (ev) {
        ev.preventDefault();

        // get the form
        const form = ev.target;

        // construct meme
        const meme = {
            id: this.memeCount++,
            name: form.memeName.value
        };
    }
}

app.init("form#addMemeForm");