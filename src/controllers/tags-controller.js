const knex = require('../database/knex/index');
const sqliteConnection = require('../database/sqlite');

class TagsController{
  async show(request, response){
    const { note_id, tags } = request.query;

    const filterTags = tags.split(',').map(name => name.trim());

    const allTags = (await knex.select('name').from('tags').where({ note_id })).map(tag => {return tag.name});

    const note = await knex('tags')
    .select([
      'notes.title',
      'notes.description',
      'notes.rating',
      'tags.name'
    ])
    .where('tags.note_id', note_id)
    .whereIn('name', filterTags)
    .innerJoin('notes', 'notes.id', 'tags.note_id')
    .orderBy('notes.title');

    let noteWithTags = {
      title: note[0].title,
      description: note[0].description,
      rating: note[0].rating,
      tags: note[0].name = allTags.join(', ')
    }
    
    return response.json(noteWithTags);
  }
  
  async delete(request, response){
    const { id } = request.query;

    await knex('tags').where({ id }).delete();

    return response.json();
  }
}

module.exports = TagsController;