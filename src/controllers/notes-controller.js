const knex = require('../database/knex/index');
const sqliteConnection = require('../database/sqlite/index');

class NotesController{
  async create(request, response){
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.query;

    const [ note_id ] = await knex("notes").insert({
      user_id,
      title,
      description,
      rating
    })

    const tagsInsert = tags.map(name => {
      return {
        user_id,
        note_id,
        name
      }
    })

    await knex('tags').insert(tagsInsert);

    return response.json();
  }

  async show(request, response){
    const { user_id, title } = request.query;

    let notesResponse = [];
    const allNotes = await knex('notes').whereLike("title", `%${title}%`).where({ user_id });

    for(const note of allNotes){
      const tags = await knex.select('name').from('tags').where({ note_id: note.id });

      if(tags.length === 0){
        notesResponse.push(note);
      }
    }

    const notes = await knex('tags')
    .select([
      'notes.user_id',
      'notes.id',
      'notes.title',
      'notes.description',
      'notes.rating',
      'tags.name'
    ])
    .whereLike("title", `%${title}%`)
    .where('notes.user_id', `${user_id}`)
    .orderBy('title')
    .innerJoin('notes', 'notes.id', 'tags.note_id');

    for(const note of notes){
      const tagNames = ((await knex.select('name').from('tags').where({ note_id: note.id })).map(tag => tag.name)).join(', ');

      let newNote = {
        ...note,
        name: tagNames
      }

      const index = notesResponse.findIndex(noteResponse => noteResponse.id === newNote.id);

      if(index !== -1){
        notesResponse[index] = newNote;
      } else{
        notesResponse.push(newNote);
      }
    };

    return response.json(notesResponse);
  }

  async index(request, response){
    const { user_id } = request.query;

    const notesResponse = [];
    const allNotes = await knex('notes').where({ user_id });

    for(const note of allNotes){
      const tags = await knex.select('name').from('tags').where({ note_id: note.id });

      if(tags.length === 0){
        notesResponse.push(note);
      }
    }

    const notes = await knex('tags')
    .select([
      'notes.id',
      'notes.title',
      'notes.description',
      'notes.rating',
      'tags.name'
    ])
    .where('notes.user_id', user_id)
    .innerJoin('notes', 'notes.id', 'tags.note_id')
    .orderBy('notes.title');

    for(const note of notes){
      const tagNames = ((await knex.select('name').from('tags').where({ note_id: note.id })).map(tag => tag.name)).join(',');
      
      const newNote = {
        ...note,
        name: tagNames
      }

      const index = notesResponse.findIndex(noteResponse => noteResponse.id === newNote.id);
      if(index != -1){
        notesResponse[index] = newNote;
      } else{
        notesResponse.push(newNote);
      }
    }

    // const notesResponse = [];
    // notes.forEach((note) => {
    //   if(notesResponse.length === 0){
    //     notesResponse.push(note);
    //   } else{
    //     const equalNotes = notesResponse.filter(noteResponse => noteResponse.id === note.id);

    //     if(equalNotes.length === 0){
    //       notesResponse.push(note);

    //     } else{
    //       notesResponse.forEach(noteResponse => {
    //         if(noteResponse.id === note.id){
    //           noteResponse.name = `${noteResponse.name},${note.name}`;
    //         }
    //       });
    //     }
    //   }
    // });

    return response.json(notesResponse);

    // const userTags = await knex('tags').where({ user_id });
    // const notesWithTags = notes.map(note => {
    //   const noteTags = userTags.filter(tag => tag.note_id === note.id);

    //   return{
    //     ...note,
    //     tags: noteTags
    //   }
    // })

    // return response.json(notesWithTags);
  }

  async update(request, response){
    const { title, description, rating, tags } = request.body;
    const { id } = request.query;

    const database = await sqliteConnection();
    const note = await database.get('SELECT * FROM notes WHERE id = (?)', [id]);

    note.title = title ?? note.title;
    note.description = description ?? note.description;
    note.rating = rating ?? note.rating;

    if(tags){
      const tagsInsert = tags.map(name => {
        return {
          user_id: note.user_id,
          note_id: id,
          name
        }
      })

      await knex('tags').insert(tagsInsert);
    }
    
    await database.run('UPDATE notes SET (title, description, rating) = (?, ?, ?) WHERE id = (?)', [note.title, note.description, note.rating, id]);

    await knex('notes').where({ id }).update({updated_at: knex.fn.now()});

    return response.json();
  }

  async delete(request, response){
    const { id } = request.query;

    await knex('notes').where({ id }).delete();

    return response.json();
  }
}

module.exports = NotesController;