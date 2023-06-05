const sqliteConnection = require('../../database/sqlite/index');
const AppError = require('../../utils/app-error');
const { hash, compare } = require('bcryptjs');
const knex = require('../../database/knex/index');

class UpdateControllers{
  async avatar(request, response){
    const { email, avatar } = request.body;

    const database = await sqliteConnection();
    await database.get('UPDATE users SET avatar = (?) WHERE email = (?)', [avatar, email]);

    await knex('users').where({ email }).update({updated_at: knex.fn.now()});

    return response.json();
  }

  async password(request, response){
    const { email, password, newPassword } = request.body;

    const database = await sqliteConnection();

    const user = await database.get('SELECT * FROM users WHERE email = (?)', [email]);
    const checkPassword = await compare(password, user.password);
    if(!checkPassword){
      throw new AppError('senha incorreta');
    }

    if(password === newPassword){
      throw new AppError('por favor crie uma nova senha');
    }

    const updatedPassword = await hash(newPassword, 8);
    await database.get('UPDATE users SET password = (?) WHERE email = (?)', [updatedPassword, email]);

    await knex('users').where({ email }).update({updated_at: knex.fn.now()});

    return response.json();
  }

  async email(request, response){
    const { name, email, newEmail, password } = request.body;

    const database = await sqliteConnection();

    const checkEmail = await database.get('SELECT * FROM users WHERE email = (?) AND name != (?)', [email, name]);
    if(checkEmail){
      throw new AppError('esse email já está em uso');
    }

    if(newEmail === email){
      throw new AppError('o novo email deve ser diferente do atual');
    }

    const checkUser = await database.get('SELECT * FROM users WHERE email = (?)', [email]);
    if(!checkUser){
      throw new AppError('por favor digite um email válido');
    }

    const checkPassword = await compare(password, checkUser.password);
    if(!checkPassword){
      throw new AppError('senha incorreta');
    }

    await knex('users').where({ email }).update({updated_at: knex.fn.now()});

    await database.get('UPDATE users SET email = (?) WHERE email = (?)', [newEmail, email]);

    return response.json();
  }

  async name(request, response){
    const { name, newName } = request.body;

    const database = await sqliteConnection();
    await knex('users').where({ name }).update({updated_at: knex.fn.now()});
    await database.get('UPDATE users SET name = (?) WHERE name = (?)', [newName, name]);

    return response.json();
  }
}

module.exports = UpdateControllers;