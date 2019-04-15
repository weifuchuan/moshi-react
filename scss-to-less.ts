import fs from 'fs-extra';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const src = resolveApp('./src');

function to(dir: string) {
  const files = fs.readdirSync(dir);

  for (let file of files) {
    const stat = fs.statSync(path.resolve(dir, file));
    if (stat.isFile()) {
      if (/.scss$/.test(file)) {
        fs.renameSync(
          path.resolve(dir, file),
          path.resolve(dir, file.replace('.scss', '.less'))
        );
      }
    }
    if (stat.isDirectory()) {
      to(path.resolve(dir, file));
    }
  }
}

to(src);
