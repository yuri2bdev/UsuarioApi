exports.up = function(knex) {
    return knex.schema.createTable("user", table => {
      table.increments("user_id").primary()
      table.string("name").notNull()
      table.string("email").notNull()
      table.string("password").notNull()
      table.dateTime("created_at").notNull()
      table.dateTime("updated_at")
      table.dateTime("deleted_at")
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("user")
};