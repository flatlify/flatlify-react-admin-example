import fs from 'fs';
import fse from 'fs-extra';
import dotenv from 'dotenv';

dotenv.config();

async function setup(path) {
  await fse.ensureDir(`${path}`);
  await fse.ensureDir(`${path}/content-types`);
  await fse.ensureDir(`${path}/settings`);
  if (fs.existsSync(path)) {
    await fse.writeJSON(`${path}/settings/site.json`, {
      id: 'site',
      url: '',
      siteName: '',
      timeZone: '',
    });
  }
}

const pathParam = process.argv[2] || process.env.DB_DIR;
if (pathParam) {
  setup(pathParam);
} else {
  console.error('Database path is not specified');
}
