const { Router } = require('express');
const usersRouter = Router();

const UsersControllers = require('../controllers/users/controllers');
const usersControllers = new UsersControllers;
const UpdateControllers = require('../controllers/users/update-controllers');
const updateControllers = new UpdateControllers;

usersRouter.post('/', usersControllers.create);
usersRouter.patch('/path-avatar', updateControllers.avatar);
usersRouter.patch('/path-password', updateControllers.password);
usersRouter.patch('/path-email', updateControllers.email);
usersRouter.patch('/path-name', updateControllers.name);
usersRouter.delete('/', usersControllers.delete);

module.exports = usersRouter;