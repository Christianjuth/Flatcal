let version = require('../package').version;
const execSync = require('child_process').execSync;


execSync('npm run package', {stdio: 'inherit'});
execSync(`./node_modules/@sentry/cli/bin/sentry-cli releases new "flatcal@${version}"`, {stdio: 'inherit'});
execSync(`./node_modules/@sentry/cli/bin/sentry-cli releases set-commits "flatcal@${version}" --auto`, {stdio: 'inherit'});
execSync(`./node_modules/@sentry/cli/bin/sentry-cli releases files "flatcal@${version}" upload-sourcemaps --rewrite "./dist/" --url-prefix ""`, {stdio: 'inherit'});