const { Router } = require('express');
const notesRouter = Router();

const NotesController = require('../controllers/notes-controller');
const notesController = new NotesController;

notesRouter.post('/create', notesController.create);
notesRouter.get('/show', notesController.show);
notesRouter.get('/index', notesController.index);
notesRouter.put('/update', notesController.update);
notesRouter.delete('/delete', notesController.delete);

module.exports = notesRouter;