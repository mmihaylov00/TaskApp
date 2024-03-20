export default () => ({
  port: parseInt(process.env['PORT'] || '3000'),
  app_secret: process.env['APP_SECRET'] || 'SECRET_HERE',
  db: {
    database_name: process.env['DB_DATABASE'] || 'taskapp',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USERNAME'] || 'taskapp',
    password: process.env['DB_PASSWORD'] || 'password',
  },
});
