import fs from 'fs';

const configpath = __dirname + '/config.json'

export const config = getConfig()

// export default ConfigManager;

function getConfig() {
    console.log(configpath)
    if (fs.existsSync(configpath)) {
        return JSON.parse(fs.readFileSync(configpath, "utf8"));
    }
    else {
        console.log("没有找到设置文件，将采用环境变量获取设置")
        return process.env;
    }
}