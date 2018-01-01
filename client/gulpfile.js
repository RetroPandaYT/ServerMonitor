var gulp = require('gulp');
const shell = require('gulp-shell')

gulp.task('dev',

    shell.task([
      'cp -f ./.env.dev ./.env',
      './node_modules/.bin/webpack -d',
      './node_modules/.bin/webpack-dev-server'
    ])

);

gulp.task('prod',

    shell.task([
      'cp -f ./.env.dev ./.env',
      'NODE_ENV=production ./node_modules/.bin/webpack -p',
      'AWS_ACCESS_KEY_ID=AKIAIVAAEAK2XK7TVEJA AWS_SECRET_ACCESS_KEY=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 aws s3 cp dist/ s3://monitor.petgtest.com --recursive',
      'AWS_ACCESS_KEY_ID=AKIAIVAAEAK2XK7TVEJA AWS_SECRET_ACCESS_KEY=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 aws s3 cp index.html s3://monitor.petgtest.com',
      'AWS_ACCESS_KEY_ID=AKIAIVAAEAK2XK7TVEJA AWS_SECRET_ACCESS_KEY=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 aws s3 cp error.html s3://monitor.petgtest.com'
    ])

);
