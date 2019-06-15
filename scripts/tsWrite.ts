import { isPrimitive, isNumber, isString, isBoolean, isArray } from "util";

interface Module{
    name:string,
    path:string
}

type Writter = (lines:string[])=>Promise<void>

function range(size: number, startAt = 0) {
    return Array.from(Array(size).keys()).map(i => i + startAt);
}

function getList<T>(list:T[]|T){
    return (Array.isArray(list)?list:[list])
}

export class TSWritter{
    LinesBuffer:string[] = []
    IndentSize:number = 0
    SingleIndent:string = '    '
    NewLine:string = '\n'


    IncreaseIndent(line?:string|string[]){
        this.IndentSize++;
        this.Append(line||[])
        return this.IndentSize;
    }
    DecreaseIndent(line?:string|string[]){
        this.IndentSize--;
        this.Append(line||[])
        return this.IndentSize;
    }

    get indent() {
        return this.indentFor(this.IndentSize);
    }

    indentFor(i:number){
        return range(i).reduce(i=>i+this.SingleIndent,'');
    }

    Indent(start:string,indented:string|string[],end?:string){
        end = isString(end) ? end : String.fromCharCode(start.trim().slice(-1).charCodeAt(0)+2)
        this.Append(start);
        this.IncreaseIndent(indented);
        this.DecreaseIndent(end);
    }

    Append(line:string|string[]){
        getList(line).forEach(l=>this.LinesBuffer.push(`${this.indent}${l}${this.NewLine}`))
    }
    async Write(writter:Writter){
        await writter(this.LinesBuffer);
    }

    ExportDefault(name:string){
        this.Append(`export default ${name}`)
    }
    ExportAllFromModules(module: string|string[]) {
        getList(module).forEach( m => this.Append(`export * from '${m}'`))
    }
    ExportModules(modules: string|string[]) {   
        this.Append(`export { ${ getList(modules).join(", ")} }`)
    }
    
    ImportDefModule(module: Module, as?: string) {
        this.Append(`import ${as ? as : module.name} from '${module.path}'`)
    }
    
    ImportAllFromModule(module: Module, as?: string) {
        this.Append(`import * as ${as ? as : module.name} from '${module.path}'`)
    }    

    ImportFromModule(path:string, components:string[]|string, defaultAs?:string){
        this.Append(`import ${defaultAs?`${defaultAs}, `:''}{ ${getList(components).join(", ")} } from '${path}'`)
    }
   
    Comment(line: string | string[]) {
        let lines = [
            "//",
            ...getList(line).map(l => `//${l}`),
            "//"
        ]
        this.Append(lines);
    }

    DeclareObject(obj:any,name:string,type:string='const'){
        let o = this.declareObject(obj);
        let lines = [
            `${type} ${name} = ${o[0]}`,
            ...o.slice(1)
        ]
        this.Append(lines);
    }

    declareObject(obj:any):string[]{  
        let lines = []
        if(isNumber(obj) || isBoolean(obj)) lines.push(obj.toString());
        else if(isString(obj)) lines.push(`"${obj}"`)
        else if(isArray(obj)){
            lines = [
                '[',
                ...obj.map(o=>`${this.indentFor(1)}${this.declareObject(o)},`),
                ']'
            ];
         
        }else{
            lines.push('{')
            for(let k in obj){
                lines.push(`${this.indentFor(1)}"${k}":${this.declareObject(obj[k])},`)
            }
            lines.push("}")
        }
        return lines;
    }
}