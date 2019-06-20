/* eslint-disable no-unreachable */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable node/no-deprecated-api */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { readdir, createWriteStream, WriteStream, stat } from 'fs'
import { promisify } from 'util'
import { TSWritter, CallFunction } from './tsWrite'

const SRC_PATH = 'src'
const UTILS_PATH = `${SRC_PATH}/utils`
const MIXINS_PATH = `${SRC_PATH}/mixins`

const ROOT_PATH = '..'

const readdirAsync = promisify(readdir)
const statAsync = promisify(stat)

interface module {
  name: string
  fullpath: string
  filename: string
  extension: string
  output: string
}
interface component extends module {}
interface plugin extends module {
  components: component[]
  type: pluginType
}

async function createWriteStreamAsync(file: string, opts: any): Promise<WriteStream> {
  return new Promise((resolve, reject) => {
    let stream = createWriteStream(file, opts)
    stream.on('open', fd => resolve(stream))
  })
}

function getModuleFrom(name: string, filename: string, path: string): module {
  let parts = name.split('.')
  name = Array.from(parts[0]).reduce((acc, char, pos) => {
    if (pos == 0) return char.toUpperCase()
    if (acc.endsWith('-')) return acc.slice(0, -1) + char.toUpperCase()
    return acc + char
  }, '')
  let output = (path ? path + '/' + name : name).slice(SRC_PATH.length + 1)
  return {
    name: name,
    fullpath: path + '/' + filename,
    filename: filename.split('.')[0],
    output: output,
    extension: filename
      .split('.')
      .slice(1)
      .join('.')
  }
}

declare function installFactory(...args: any): any

async function createIndexForPlugin(plugin: plugin) {
  let files = await lsDir(plugin.fullpath)
  let index = new TSWritter()
  for (let c of files) {
    let module = getModuleFrom(plugin.type.componentNameFn(c), c, plugin.fullpath) as component
    let stats = await getStats(module.fullpath)
    if (stats.isFile() && c != 'index.ts' && c.endsWith('.ts')) plugin.components.push(module)
  }
  index.ImportFromModule('../../core/BvPlugin', ['BvPlugin', 'installFactory'])

  index.Comment('Import all plugin components')
  plugin.components.forEach(c =>
    index.ImportAllFromModule({
      name: `${c.name}${plugin.type.nameSingular}`,
      path: `./${c.filename}`
    })
  )
  index.Append('')
  index.DeclareObject(
    plugin.components.reduce<Dict<symbol>>((o, c) => {
      o[c.name] = Symbol(`${c.name}${plugin.type.nameSingular}.default`)
      return o
    }, {}),
    `${plugin.name.replace('Plugin', plugin.type.namePlurar)}`,
    'const',
    true
  )
  index.Comment('Plugin')
  index.DeclareObject(
    {
      install: new CallFunction('installFactory', [
        {
          components: Symbol(`${plugin.name.replace('Plugin', plugin.type.namePlurar)}`)
        }
      ])
    },
    `${plugin.name}: BvPlugin`,
    'const'
  )
  index.Comment('Exports')
  index.ExportDefault(plugin.name)
  index.ExportModules(plugin.name)
  index.ExportAllFromModules(plugin.components.map(c => `./${c.filename}`))
  await index.Write(getWritter(`${plugin.fullpath}/index.ts`))
}

function getWritter(path: string, opts: any = {}) {
  return async (content: string[]) => {
    let stream = await createWriteStreamAsync(`${ROOT_PATH}/${path}`, opts)
    content.forEach(c => stream.write(c))
    stream.end()
  }
}
async function getStats(path: string) {
  return await statAsync(`${ROOT_PATH}/${path}`)
}
async function lsDir(path: string) {
  return await readdirAsync(`${ROOT_PATH}/${path}`)
}
interface pluginType {
  pluginNameFn: (filename: string) => string
  componentNameFn: (filename: string) => string
  nameSingular: string
  namePlurar: string
  dir: string
  haveConfig: boolean
}
async function ProcessPlugins(types: pluginType[]) {
  let allplugins: plugin[] = []

  for (let type of types) {
    let plugins: plugin[] = []
    console.log(`Process ${type.namePlurar} Plugins`)
    let filenames = await lsDir(type.dir)
    let index = new TSWritter()
    for (let filename of filenames) {
      let module = getModuleFrom(type.pluginNameFn(filename), filename, type.dir) as plugin
      module.type = type
      module.components = []
      let stats = await getStats(module.fullpath)
      //All directories under components are plugins
      if (stats.isDirectory()) {
        plugins.push(module)
        await createIndexForPlugin(module)
        await ProcessHelpers(module.fullpath)
      }
    }
    index.ImportFromModule(`../core/BvPlugin`, [`installFactory`, 'BvPlugin'])
    if (type.haveConfig) {
      plugins.forEach(p =>
        index.ImportFromModule(
          `./${p.filename}`,
          type.haveConfig ? p.components.map(c => `${c.name}Config`) : [],
          p.name
        )
      )
      index.Indent(
        `export interface ${type.namePlurar}Config {`,
        plugins.reduce<string[]>(
          (lines, p) => lines.concat(p.components.map(c => `${c.name}?: ${c.name}Config`)),
          []
        )
      )
    } else {
      plugins.forEach(p => index.ImportDefModule({ name: p.name, path: `./${p.filename}` }))
    }

    index.DeclareObject(
      plugins.reduce<any>((o, p) => {
        o[Symbol(p.name)] = null
        return o
      }, {}),
      `${type.nameSingular}Plugins`,
      'const',
      true
    )

    index.DeclareObject(
      {
        install: new CallFunction('installFactory', [
          {
            components: Symbol(`${type.nameSingular}Plugins`)
          }
        ])
      },
      `${type.namePlurar}Plugin: BvPlugin`,
      'const',
      true
    )
    plugins.forEach(p => index.ExportAllFromModules(`./${p.filename}`))
    await index.Write(getWritter(`${type.dir}/index.ts`))
    allplugins = allplugins.concat(plugins)
  }

  return allplugins
}
async function ProcessHelpers(path: string) {
  let filenames = await lsDir(path)
  for (let filename of filenames) {
    let stats = await getStats(path)
    //All directories under components are plugins
    if ((stats.isDirectory() && filename == 'utils') || filename == 'mixins') {
      await BasicIndex(path + '/' + filename)
    }
  }
}
async function BasicIndex(path: string) {
  console.log(`Process index for ${path}`)
  let filenames = await lsDir(path)
  let index = new TSWritter()
  for (let filename of filenames) {
    let module = getModuleFrom(filename, filename, path)
    let stats = await getStats(module.fullpath)
    if (stats.isFile && !filename.endsWith('index.ts')) {
      index.ExportAllFromModules(`./${filename.split('.')[0]}`)
    }
  }
  await index.Write(getWritter(`${path}/index.ts`))
}

async function RollupInputs(plugins: plugin[]) {
  let rollupInputs = new TSWritter()
  rollupInputs.DeclareObject(
    plugins.reduce(
      (d, p) => {
        d[p.output] = `./${p.fullpath}/index.ts`
        p.components.forEach(c => (d[c.output] = `${c.fullpath}`))
        return d
      },
      {} as any
    ),
    'inputs',
    'const'
  )
  rollupInputs.ExportDefault('inputs')
  rollupInputs.Write(getWritter(`${SRC_PATH}/../rollup.inputs.js`))
}
async function run() {
  let componentPluginType: pluginType = {
    namePlurar: 'Components',
    nameSingular: 'Component',
    componentNameFn: n => 'b-' + n,
    pluginNameFn: n => n + '-plugin',
    dir: `${SRC_PATH}/components`,
    haveConfig: true
  }

  let directivePluginType: pluginType = {
    namePlurar: 'Directives',
    nameSingular: 'Directive',
    componentNameFn: n => 'v-b-' + n,
    pluginNameFn: n => 'v-b' + n + '-plugin',
    dir: `${SRC_PATH}/directives`,
    haveConfig: false
  }

  let plugins = await ProcessPlugins([componentPluginType, directivePluginType])
  await RollupInputs(plugins)
  ProcessHelpers(SRC_PATH)
}
run()
