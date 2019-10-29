module.exports = {
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
            targets: {
                browsers: '> 2%',
            },
            useBuiltIns: "entry"
        }],
    ],

    plugins: [
        'react-hot-loader/babel',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-runtime'
    ],
};
