var gulp = require('gulp');
const shell = require('gulp-shell')

gulp.task('dev',

    shell.task([
      'cp -f ./.env.dev ./.env',
      'nodemon .'
    ])

);

gulp.task('prod',

    shell.task([
      'serverless deploy --stage staging',
      'serverless logs --stage staging --function api -t'
    ])

);
