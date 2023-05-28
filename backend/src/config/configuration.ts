export default () => ({
  port: process.env['PORT'] || '3000',
  app_secret: process.env['APP_SECRET'] || 'SECRET_HERE',
  db: {
    database_name: process.env['TYPEORM_DATABASE'] || 'taskapp',
    host: process.env['TYPEORM_HOST'] || 'localhost',
    port: parseInt(process.env['TYPEORM_PORT'] || '5432'),
    username: process.env['TYPEORM_USERNAME'] || 'taskapp',
    password: process.env['TYPEORM_PASSWORD'] || 'password',
    synchronize: process.env['TYPEORM_SYNCHRONIZE'] == 'true' || false,
    migrations_dir: process.env['TYPEORM_MIGRATIONS_DIR'] || 'src/migrations',
    migrations: process.env['TYPEORM_MIGRATIONS'] || 'dist/src/migrations/*.js',
    entities: process.env['TYPEORM_ENTITIES'] || 'dist/src/**/*.entity.js',
  }
});
