//Fait par Gabriel Laframboise et Léo Asselin-Sparks

const Repository = require('../models/Repository');
const CollectionFilter = require('../models/collectionFilter');
const { decomposePath } = require('../utilities');

module.exports =
    class WordsController extends require('./Controller') {
        constructor(req, res) {
            super(req, res, false /* needAuthorization */);
            this.wordsRepository = new Repository('Words', true /* cached */);
        }
        error(params, message) {
            params["error"] = message;
            this.response.JSON(params);
            return false;
        }

        // GET: api/words
        // GET: api/bookmarks?limit=value&offset=value&sort=key&word=value....
        get() {
            let params = this.getQueryStringParams();
            // if we have no parameter, expose the list of possible query strings
            if (params === null) {
                this.response.JSON(this.wordsRepository.getAll());
            }
            else {
                let collectionFilter = new CollectionFilter(this.wordsRepository.getAll(), params);
                //Nous passons en paramêtre le boolean qui déterminera si oui ou non une cache est mise en place.
                this.response.JSON(collectionFilter.get(), this.wordsRepository.ETag, this.wordsRepository.cached);
            }
        }
    }

