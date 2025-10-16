const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const picocolors = require('picocolors')

//import packages from './package.json'
// 获取当前命令行上下文路径
const currentDirectory = process.cwd()

const transferTime = (date) => {
  const currentDate = date ? new Date(date) : new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // getMonth() 返回的是 0-11，需要加 1
  const dates = currentDate.getDate()
  const hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  const seconds = currentDate.getSeconds()
  return `${year}-${month}-${dates} ${hours}:${minutes}:${seconds}`
}

function build() {
  //版本号获取
  const packageJsonPath = path.join(currentDirectory, 'package.json')
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonContent)
  const currentVersion = packageJson.version

  // 执行npm打包命令
  execSync('vite build --mode production', {
    stdio: 'inherit'
  })
  console.log('Successfully built the project!')
  // const newStr = {
  //     'build.time': transferTime(),
  // };

  // const branch = execSync('git rev-parse --abbrev-ref HEAD')
  //     .toString()
  //     .trim();

  //此处添加git命令
  // const gitDataMap = {
  //     'build.user.name': 'git config user.name',
  //     'build.user.email': 'git config user.email',
  //     'git.branch': 'git rev-parse --abbrev-ref HEAD',
  //     'git.branch.tag': 'git describe --always',
  //     'git.remote.origin.url': 'git remote get-url origin',
  //     'git.commit.user.name': `git log -1 ${
  //         branch ? 'origin/' + branch : ''
  //     } --format="%an"`,
  //     'git.commit.user.email': `git log -1 ${
  //         branch ? 'origin/' + branch : ''
  //     } --format="%ae"`,
  //     'git.commit.time': `git log -1 ${
  //         branch ? 'origin/' + branch : ''
  //     } --format="%cd"`,
  // };

  // Object.keys(gitDataMap).forEach((value) => {
  //     newStr[value] = execSync(gitDataMap[value])?execSync(gitDataMap[value]).toString().trim():'';
  //     if (value === 'git.commit.time') {
  //         newStr[value] = transferTime(newStr[value]);
  //     }
  // });

  //将日志写入log.txt
  //     fs.writeFile('dist/web.version.json', JSON.stringify(newStr), 'utf-8', (err) => {
  //         if (err != null) {
  //             console.log('ERROR:', err);
  //         } else {
  //             console.log(picocolors.green(`
  //    ___     ___    _____    ___     ___    _  _              ___    _   _    ___     ___     ___     ___     ___
  //   / __|   / _ \\  |_   _|  |_ _|   / _ \\  | \\| |     o O O  / __|  | | | |  / __|   / __|   | __|   / __|   / __|
  //  | (_ |  | (_) |   | |     | |   | (_) | |  \  |    o       \\__ \\  | |_| | | (__   | (__    | _|    \\__ \\   \\__ \\
  //   \\___|   \\___/   _|_|_   |___|   \\___/  |_|\\_|   TS__[O]  |___/   \\___/   \\___|   \\___|   |___|   |___/   |___/
  // `));
  //         }
  //     });
}

build()
