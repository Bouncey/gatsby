const chokidar = require(`chokidar`)
const readdirp = require(`readdirp`)
const anymatch = require(`anymatch`)

const findOnce = (path, options) => {
  const { ignored } = options
  return new Promise(resolve => {
    let fileList = []
    const stream = readdirp({ root: path })

    stream.on(`data`, data => {
      if (anymatch(ignored, data.path)) return
      fileList.push(data.fullPath)
      return
    })

    stream.on(`end`, () => {
      resolve(fileList)
    })
  })
}

module.exports = (path, options) => {
  const { watch, ignore } = options

  const ignored = [
    `**/*.un~`,
    `**/.DS_Store`,
    `**/.gitignore`,
    `**/.npmignore`,
    `**/.babelrc`,
    `**/yarn.lock`,
    `**/bower_components`,
    `**/node_modules`,
    `../**/dist/**`,
    ...(ignore || []),
  ]

  if (watch === true) {
    return chokidar.watch(path, { ignored })
  } else {
    return findOnce(path, { ignored })
  }
}
