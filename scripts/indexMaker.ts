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
import { resolve } from 'url'
import { rejects } from 'assert'
import { TSWritter } from './tsWrite'
import { runInContext } from 'vm'

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
}

function range(size: number, startAt = 0) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
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

async function createIndexForComponentPlugin(plugin: plugin) {
  let files = await lsDir(plugin.fullpath)

  let index = new TSWritter()

  for (let c of files) {
    let module = getModuleFrom(
      COMPONENT_PREFIX + c + COMPONENT_POST,
      c,
      plugin.fullpath
    ) as component
    let stats = await getStats(module.fullpath)
    if (stats.isFile() && c != 'index.ts' && c.endsWith('.ts')) plugin.components.push(module)
  }
  index.ImportFromModule('../../core/BvPlugin', ['BvPlugin', 'installFactory'])
  index.Comment('Import all components')
  plugin.components.forEach(c =>
    index.ImportAllFromModule({ name: `${c.name}Component`, path: `./${c.filename}` })
  )
  index.Append('')
  index.Indent(
    `export const ${plugin.name.replace('Plugin', '')}Components = {`,
    plugin.components.map(c => `${c.name}:${c.name}Component.default,`)
  )
  index.Comment('Plugin')
  index.Indent(
    `const ${plugin.name}:BvPlugin = {`,
    `install: installFactory({components:${plugin.name.replace('Plugin', '')}Components})`
  )
  index.Comment('Exports')
  index.ExportDefault(plugin.name)
  index.ExportModules(plugin.name)
  index.ExportAllFromModules(plugin.components.map(c => `./${c.filename}`))
  await index.Write(getWritter(`${plugin.fullpath}/index.ts`))
}
const SRC_PATH = 'src'
const COMPONENT_PLUGINS_PATH = `${SRC_PATH}/components`
const DIRECTIVE_PLUGINS_PATH = `${SRC_PATH}/directives`

const UTILS_PATH = `${SRC_PATH}/utils`

const ROOT_PATH = '..'
const COMPONENT_PREFIX = 'b-'
const COMPONENT_POST = ''
const COMPONENT_PLUGIN_PREFIX = ''
const COMPONENT_PLUGIN_POST = '-plugin'
const DIRECTIVE_PREFIX = 'v-b-'
const DIRECTIVE_POST = ''
const DIRECTIVE_PLUGIN_PREFIX = 'v-b-'
const DIRECTIVE_PLUGIN_POST = '-plugin'

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
async function ProcessComponentPlugins() {
  console.log('Process Plugins')
  let filenames = await lsDir(COMPONENT_PLUGINS_PATH)
  let index = new TSWritter()
  let plugins: plugin[] = []
  for (let filename of filenames) {
    let module = getModuleFrom(
      COMPONENT_PLUGIN_PREFIX + filename + COMPONENT_PLUGIN_POST,
      filename,
      COMPONENT_PLUGINS_PATH
    ) as plugin
    let stats = await getStats(module.fullpath)
    //All directories under components are plugins
    if (stats.isDirectory()) {
      module.components = []
      plugins.push(module)
      await createIndexForComponentPlugin(module)
    }
  }
  index.ImportFromModule(`../core/BvPlugin`, `installFactory`)
  plugins.forEach(p =>
    index.ImportFromModule(`./${p.filename}`, p.components.map(c => `${c.name}Config`), p.name)
  )
  index.Indent(
    'export interface ComponentsConfig {',
    plugins.reduce<string[]>(
      (lines, p) => lines.concat(p.components.map(c => `${c.name}?:${c.name}Config`)),
      []
    )
  )
  index.Indent('export const componentPlugins = {', plugins.map(p => `${p.name},`))

  index.Indent(
    'export const componentsPlugin = {',
    `install: installFactory({ plugins: componentPlugins })`
  )
  plugins.forEach(p => index.ExportAllFromModules(`./${p.filename}`))
  await index.Write(getWritter(`${COMPONENT_PLUGINS_PATH}/index.ts`))

  return plugins
}

async function ProcessDirectivePlugins() {
  console.log('Process Directive Plugins')
  let filenames = await lsDir(DIRECTIVE_PLUGINS_PATH)
  let index = new TSWritter()
  let plugins: plugin[] = []
  for (let filename of filenames) {
    let module = getModuleFrom(
      DIRECTIVE_PLUGIN_PREFIX + filename + DIRECTIVE_PLUGIN_POST,
      filename,
      DIRECTIVE_PLUGINS_PATH
    ) as plugin
    let stats = await getStats(module.fullpath)
    //All directories under components are plugins
    if (stats.isDirectory()) {
      module.components = []
      plugins.push(module)
      await createIndexForDirectivePlugin(module)
    }
  }
  index.ImportFromModule(`../core/BvPlugin`, `installFactory`)
  plugins.forEach(p => index.ImportFromModule(`./${p.filename}`, [], p.name))

  index.Indent('export const directivePlugins = {', plugins.map(p => `${p.name},`))

  index.Indent(
    'export const directivesPlugin = {',
    `install: installFactory({ plugins: directivePlugins })`
  )
  plugins.forEach(p => index.ExportAllFromModules(`./${p.filename}`))
  await index.Write(getWritter(`${DIRECTIVE_PLUGINS_PATH}/index.ts`))
  return plugins
}
async function createIndexForDirectivePlugin(plugin: plugin) {
  let files = await lsDir(plugin.fullpath)

  let index = new TSWritter()

  for (let c of files) {
    let module = getModuleFrom(
      DIRECTIVE_PREFIX + c + DIRECTIVE_POST,
      c,
      plugin.fullpath
    ) as component
    let stats = await getStats(module.fullpath)
    if (stats.isFile() && c != 'index.ts' && c.endsWith('.ts')) plugin.components.push(module)
  }
  index.ImportFromModule('../../core/BvPlugin', ['BvPlugin', 'installFactory'])
  index.ImportFromModule('../../utils/vue', ['DirectiveOptions', 'DirectiveFunction'])
  index.ImportFromModule('../../utils/types', ['Dict'])

  index.Comment('Import all directives')
  plugin.components.forEach(c =>
    index.ImportAllFromModule({ name: `${c.name}Directive`, path: `./${c.filename}` })
  )
  index.Append('')
  index.Indent(
    `export const ${plugin.name.replace('Plugin', '')}Directives = {`,
    plugin.components.map(c => `${c.name}:${c.name}Directive.default,`)
  )
  index.Comment('Plugin')
  index.Indent(
    `const ${plugin.name}:BvPlugin = {`,
    `install: installFactory({components:${plugin.name.replace('Plugin', '')}Directives})`
  )
  index.Comment('Exports')
  index.ExportDefault(plugin.name)
  index.ExportModules(plugin.name)
  index.ExportAllFromModules(plugin.components.map(c => `./${c.filename}`))
  await index.Write(getWritter(`${plugin.fullpath}/index.ts`))
}

async function ProcessUtils() {
  console.log('Process Utils')
  let filenames = await lsDir(UTILS_PATH)
  let index = new TSWritter()
  index.Comment('Export all utils')

  for (let filename of filenames) {
    let module = getModuleFrom(filename, filename, UTILS_PATH)
    let stats = await getStats(module.fullpath)
    if (stats.isFile && !filename.endsWith('index.ts')) {
      index.ExportAllFromModules(`./${filename.split('.')[0]}`)
    }
  }
  await index.Write(getWritter(`${UTILS_PATH}/index.ts`))
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
  let plugins = await ProcessComponentPlugins()
  plugins = plugins.concat(await ProcessDirectivePlugins())
  await RollupInputs(plugins)
  ProcessUtils()
}
run()
