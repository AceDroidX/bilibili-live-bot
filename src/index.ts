const KHLAPIPREFIX = 'https://www.kaiheila.cn'
const BILILIVEPREFIX = 'https://live.bilibili.com'

import { LiveWS, LiveTCP, KeepLiveWS, KeepLiveTCP } from 'bilibili-live-ws';
import axios from 'axios';
import config from './config'

var roomid = config.get('room_id')
if (typeof roomid == "string") {
    roomid.split(',').forEach((element: string) => {
        openOneRoom(parseInt(element))
    });
} else {
    console.error('房间id获取出错:' + typeof roomid)
}

function openOneRoom(id: number) {
    const live = new KeepLiveTCP(id)
    live.on('open', () => console.log(timePrefix() + `<${id}>Connection is established`))
    // Connection is established
    live.on('live', () => {
        live.on('heartbeat', () => { console.log(timePrefix() + `<${id}>heartbeat`) })
    })
    live.on('LIVE', (data) => {
        console.log(timePrefix() + `<${id}>LIVE ${JSON.stringify(data)}`)
        sendMsgToKHL(timePrefix() + `<${id}>开始直播\n${BILILIVEPREFIX}/${id}`)
    })
    live.on('PREPARING', (data) => {
        console.log(timePrefix() + `<${id}>PREPARING ${JSON.stringify(data)}`)
        sendMsgToKHL(timePrefix() + `<${id}>停止直播\n${BILILIVEPREFIX}/${id}`)
    })
}

function sendMsgToKHL(msg: string) {
    axios.post(KHLAPIPREFIX + '/api/v3/message/create', {
        target_id: config.get('channel_id'),
        content: msg
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bot ' + config.get('khl_token')
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function timePrefix() {
    return `[${getTime()}]`
}
//get time 
function getTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var milli = now.getMilliseconds();
    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return time;
}