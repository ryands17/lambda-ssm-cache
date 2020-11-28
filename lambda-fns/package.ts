import { mkdirp, copy, createWriteStream } from 'fs-extra'
import archiver from 'archiver'
import { promisify } from 'util'
import { exec } from 'child_process'
import { join } from 'path'

const execAs = promisify(exec)
const filesToCopy = ['dist', 'package.json', '.yarnclean'] as const
const filesToPackage = [
  { name: 'dist', type: 'folder' },
  { name: 'node_modules', type: 'folder' },
] as const

const directory = join(__dirname, 'assets')

const buildAndCopyFiles = async () => {
  try {
    console.log('*** Building TS and creating assets directory ***')
    await mkdirp(directory)
    await execAs('yarn build')

    return Promise.all(
      filesToCopy.map(file => copy(file, join(directory, file)))
    )
  } catch (e) {
    throw Error(`[buildAndCopyFiles]: ${e?.stack}`)
  }
}

const installProductionDeps = () => {
  try {
    console.log(`*** Installing production dependencies in ${directory} ***`)
    return execAs('yarn install --production', { cwd: directory })
  } catch (e) {
    throw Error(`[installProductionDeps]: ${e?.stack}`)
  }
}

const archiveFiles = () => {
  try {
    console.log('*** Creating archive of files and packages ***')
    const output = createWriteStream(join(directory, 'assets.zip'))
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    archive.pipe(output)

    archive.on('error', err => {
      throw err
    })

    for (let file of filesToPackage) {
      const name = `assets/${file.name}`
      if (file.type === 'folder') {
        archive.directory(name, file.name)
      } else archive.file(name, { name: file.name })
    }
    return archive.finalize()
  } catch (e) {
    throw Error(`[archiveFiles]: ${e?.stack}`)
  }
}

const main = async () => {
  try {
    await buildAndCopyFiles()
    await installProductionDeps()
    await archiveFiles()
  } catch (e) {
    console.error(e)
  }
}

main()
