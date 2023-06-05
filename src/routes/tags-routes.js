const { Router } = require('express');
const tagsRouter = Router();

const TagsController = require('../controllers/tags-controller');
const tagsController = new TagsController;

tagsRouter.get('/', tagsController.show);
tagsRouter.delete('/', tagsController.delete);

module.exports = tagsRouter;