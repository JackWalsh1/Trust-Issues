const path = require('path');
// https://github.com/Izhaki/nodemon-webpack-plugin#readme
const NodemonPlugin = require('nodemon-webpack-plugin'); 

module.exports = {
    entry: {
        accountPage: './client/accountPage.jsx',
        gamePortal: './client/gamePortal.jsx',
        trustUs: './client/trustUs.jsx',
        login: './client/login.jsx'
    },
    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
    plugins: [
        new NodemonPlugin(),
      ],
};