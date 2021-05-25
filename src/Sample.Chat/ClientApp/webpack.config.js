const webpack = require('webpack');
const path = require('path');

const environmentName = process.env.NODE_ENV || 'development';

const isDevelpoment = () => {
    return environmentName !== 'production';
};

module.exports = {
    mode: isDevelpoment() ? 'development' : environmentName,
    // devtool: isDevelpoment() ? 'inline-source-map' : 'hidden-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    entry: {
        chatApp: path.resolve('src/ChatApp/index'),
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        // options: {
                        //     plugins: [
                        //         isDevelpoment() &&
                        //             require('react-refresh/babel'),
                        //     ].filter(Boolean),
                        // },
                    },
                    'ts-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ],
    },
    plugins: [new webpack.LoaderOptionsPlugin({ dev: isDevelpoment() })],
    output: {
        filename: '[name]/[name].bundle.js',
        path: path.join(path.resolve(__dirname, '..'), 'wwwroot', 'bundles'),
        publicPath: '/bundles/',
        // clean: true,
    },
};
