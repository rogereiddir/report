module.exports = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username:process.env.DB_USER,
      password:  process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: ['src/entities/*.*.ts' ],
      migrations: ['src/migrations/*.ts'],
      migrationsTableName:"migrations",
      cli:{
        migrationsDir:"src/migrations"
      }
 }