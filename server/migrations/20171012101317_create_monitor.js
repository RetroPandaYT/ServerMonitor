exports.up = function (knex, Promise) {
  return knex.schema.createTable('monitor', function (t) {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.string('server').notNullable()
    t.string('msg', 1000).notNullable().defaultTo('')
    t.boolean('is_suppressed').notNullable().defaultTo(0)
    t.boolean('is_resolved').notNullable().defaultTo(0)
    t.integer('sent_cnt').notNullable().defaultTo(0)
    t.timestamps(false, true)
  })
}
exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('monitor')
}
