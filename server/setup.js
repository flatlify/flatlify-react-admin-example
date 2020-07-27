import fs from 'fs';

const { mkdir, writeFile } = fs.promises;

export async function setup(path) {
  await mkdir(`${path}/database`);
  await mkdir(`${path}/database/content-types`);
  await mkdir(`${path}/database/settings`);
  await writeFile(`${path}/database/settings/site.json`, {
    id: 'site',
    url: '',
    siteName: '',
    timeZone: '',
  });
}
