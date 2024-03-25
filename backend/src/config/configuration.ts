export default () => ({
  port: parseInt(process.env['PORT'] || '3000'),
  app_secret: process.env['APP_SECRET'] || 'SECRET_HERE',
  frontend_url: process.env['FRONTEND_URL'] || 'http://localhost:4200',
  db: {
    database_name: process.env['DB_DATABASE'] || 'taskapp',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USERNAME'] || 'taskapp',
    password: process.env['DB_PASSWORD'] || 'password',
  },
  mail: {
    host: process.env['MAIL_HOST'] || 'smtp.gmail.com',
    port: parseInt(process.env['MAIL_PORT'] || '465'),
    user: process.env['MAIL_USER'] || 'username',
    password: process.env['MAIL_PASSWORD'] || 'password',
  },
});
