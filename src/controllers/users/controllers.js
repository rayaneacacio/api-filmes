const knex = require('../../database/knex/index');
const sqliteConnection = require('../../database/sqlite');
const AppError = require('../../utils/app-error');
const { hash } = require('bcryptjs');

class UsersControllers{
  async create(request, response){
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUser = await database.get('SELECT * FROM users WHERE email = (?)', [email]);
    if(checkUser){
      throw new AppError('esse email já está em uso :p');
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    })

    return response.json();
  }

  async delete(request, response){
    const { id } = request.query;

    await knex('users').where({ id }).delete();

    return response.json();
  }
}

module.exports = UsersControllers;