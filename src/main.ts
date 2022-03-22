import md5 = require("md5");
import * as app from "./private";
import * as http from "http";
import * as querystring from "querystring";

type ErrorMap = {
    [key: string]: string
}
const errorMap: ErrorMap = {
    52001: '请求超时 ',
    52002: '系统错误 ',
    52003: '未授权用户 ',
    54004: '账户余额不足',
}

export const translate = (word: string) => {
    const salt = Math.random()
    const sign = md5(app.appid + word + salt + app.sign)
    let from, to

    if (/[a-zA-Z]/.test(word[0])) {
        from = 'en'
        to = 'zh'
    } else {
        from = 'zh'
        to = 'en'
    }
    const query: any = querystring.stringify({
        from, to, salt, sign,
        q: word,
        appid: app.appid
    })

    const options = {
        hostname: 'fanyi-api.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate' + query,
        method: 'GET'
    }

    const request = http.request(options, (response) => {
        let chunks: Buffer[] = []
        response.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
        })
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString()
            type BaiduResult = {
                from: string,
                to: string,
                error_code?: number,
                trans_result?: { src: string, dst: string }[]
            }
            const object: BaiduResult = JSON.parse(string)

            if (object.error_code) {
                console.error(errorMap[object.error_code])
                process.exit(2)
            } else {
                process.exit(0)
            }
        })
    })

    request.on('error', (err) => {
        console.log('err', err)
    })

    request.end()
}