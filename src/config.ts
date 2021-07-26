import fs from 'fs';

const configpath = __dirname + '/config.json'

// export const config = getConfig()

// export default ConfigManager;

export class ConfigManager {
    json: Object | undefined;
    constructor() {
        console.log(configpath)
        if (fs.existsSync(configpath)) {
            this.json = JSON.parse(fs.readFileSync(configpath, "utf8"));
        }
        else {
            console.log("没有找到设置文件，将采用环境变量获取设置")
        }
    }

    get(key: string): any {
        if (this.json === undefined) {
            var env = process.env[key]
            if (env == undefined) {
                console.log('设置中没有这个key')
                return undefined
            } else {
                if (isNumber(env)) {
                    if (isInt(env)) {
                        return parseInt(env)
                    } else {
                        return parseFloat(env)
                    }
                } else {
                    return env
                }
            }
        } else {
            if (isValidKey(key, this.json)) {
                return this.json[key];
            }else{
                console.log('设置中没有这个key')
                return undefined
            }
        }
    }
}
export default new ConfigManager();

function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
    return key in object;
}
function isNumber(str: string) {
    return !isNaN(parseFloat(str))
}
function isInt(str: string) {
    return Number.isInteger(parseFloat(str))
}