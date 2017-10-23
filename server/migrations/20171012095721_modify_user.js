exports.up = async function up (knex, Promise) {
  await knex.schema.table('user', t => {
    t.string('sms').notNullable()
    t.boolean('is_receiving').notNullable().defaultTo(0)
  })

}
exports.down = function down (knex, Promise) {
  return knex.schema.table('user', t => {
    t.dropColumn('sms')
    t.dropColumn('is_receiving')
  })
}
