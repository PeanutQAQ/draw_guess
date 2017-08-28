module.exports = {
    entry: __dirname + "/client.js", //入口文件路径
    output: {
        path: __dirname + "/public/", //存放打包后文件的地方路径
        filename: "bundle.js" //打包后的文件名
    }
}
