/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable node/no-deprecated-api */
import { isNumber, isString, isBoolean, isArray, isFunction, isSymbol } from 'util'

interface Module {
  name: string
  path: string
}

type Writter = (lines: string[]) => Promise<void>

function range(size: number, startAt = 0) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}

function getList<T>(list: T[] | T) {
  return Array.isArray(list) ? list : [list]
}

function getSymbolDesc(symbol: symbol) {
  return symbol.toString().slice(7, -1)
}

export class CallFunction {
  name: string
  parameters: any[]
  constructor(name: string, params?: any[]) {
    this.name = name
    this.parameters = params || []
  }
}

export class TSWritter {
  LinesBuffer: string[] = []
  IndentSize: number = 0
  SingleIndent: string = '  '
  NewLine: string = '\n'

  IncreaseIndent(line?: string | string[]) {
    this.IndentSize++
    this.Append(line || [])
    return this.IndentSize
  }
  DecreaseIndent(line?: string | string[]) {
    this.IndentSize--
    this.Append(line || [])
    return this.IndentSize
  }

  get indent() {
    return this.indentFor(this.IndentSize)
  }

  indentFor(i: number) {
    return range(i).reduce(i => i + this.SingleIndent, '')
  }

  Indent(start: string, indented: string | string[], end?: string) {
    end = isString(end)
      ? end
      : String.fromCharCode(
          start
            .trim()
            .slice(-1)
            .charCodeAt(0) + 2
        )
    this.Append(start)
    this.IncreaseIndent(indented)
    this.DecreaseIndent(end)
  }

  Append(line: string | string[]) {
    getList(line).forEach(l => this.LinesBuffer.push(`${this.indent}${l}${this.NewLine}`))
  }
  async Write(writter: Writter) {
    await writter(this.LinesBuffer)
  }

  ExportDefault(name: string) {
    this.Append(`export default ${name}`)
  }
  ExportAllFromModules(module: string | string[]) {
    getList(module).forEach(m => this.Append(`export * from '${m}'`))
  }
  ExportModules(modules: string | string[]) {
    this.Append(`export { ${getList(modules).join(', ')} }`)
  }

  ImportDefModule(module: Module, as?: string) {
    this.Append(`import ${as || module.name} from '${module.path}'`)
  }

  ImportAllFromModule(module: Module, as?: string) {
    this.Append(`import * as ${as || module.name} from '${module.path}'`)
  }

  ImportFromModule(path: string, components: string[] | string, defaultAs?: string) {
    this.Append(
      `import ${defaultAs ? `${defaultAs}, ` : ''}{ ${getList(components).join(
        ', '
      )} } from '${path}'`
    )
  }

  Comment(line: string | string[]) {
    let lines = ['//', ...getList(line).map(l => `//${l}`), '//']
    this.Append(lines)
  }

  DeclareObject(obj: any, name: string, type: string = 'const', exprt: boolean = false) {
    let o = this.declareObject(obj)
    let lines = [`${exprt ? 'export ' : ''}${type} ${name} = ${o[0]}`, ...o.slice(1)]
    this.Append(lines)
  }

  declareObject(obj: any): string[] {
    let lines: string[] = []
    if (isNumber(obj) || isBoolean(obj)) lines.push(obj.toString())
    else if (isString(obj)) lines.push(`'${obj}'`)
    else if (isArray(obj)) {
      lines = ['[', ...obj.map(o => `${this.indentFor(1)}${this.declareObject(o)},`), ']']
    } else if (isFunction(obj) && !(obj instanceof CallFunction)) {
      lines = [obj.toString()]
    } else if (isSymbol(obj)) {
      lines = [getSymbolDesc(obj)]
    } else if (obj instanceof CallFunction) {
      lines.push(`${obj.name}(`)
      let bracket = /^[{}[\]()]$/
      obj.parameters.forEach((p, i) => {
        let l = this.declareObject(p)

        l.forEach((p, i2) => {
          if (i === 0 && i2 === 0) {
            p = p.trim()
            lines[lines.length - 1] += `${p[0].match(bracket) ? '' : ' '}${p.trim()}`
          } else {
            lines.push(`${this.indentFor(1)}${p}`)
          }
        })

        if (i < obj.parameters.length - 1) {
          lines[lines.length - 1] += ','
        }
      })
      if (obj.parameters.length > 1) lines.push(')')
      else lines[lines.length - 1] += ' )'
      let last = lines[lines.length - 1].slice(0, -1).trimRight()
      if (last.slice(-1).match(bracket)) {
        lines[lines.length - 1] = last + ')'
      }
    } else {
      let count = 0
      lines.push('{')
      for (let k in obj) {
        count++
        let validName = /^[a-zA-Z_][0-9a-zA-Z_]+$/
        let name = k.match(validName) ? k : `'${k}'`
        let start = `${this.indentFor(1)}${name}: `
        let content = this.declareObject(obj[k])

        content.forEach((c, i) => {
          lines.push(i === 0 ? start + c : c)
        })
        lines[lines.length - 1] += ','
      }
      Object.getOwnPropertySymbols(obj).forEach(s => {
        lines.push(this.indentFor(1) + getSymbolDesc(s) + ',')
        count++
      })
      if (count > 0) lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1)
      lines.push('}')
    }
    return lines
  }
}
