exports.up = knex => knex.schema.table('notes', table => {
  table.renameColumn('notes_id', 'id');
});

exports.down = knex => knex.schema.table('notes', table => {
  table.renameColumn('id', 'notes_id');
});