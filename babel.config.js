module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            ['@babel/preset-env', {modules: false}]
        ],
        plugins: [
            '@babel/plugin-syntax-dynamic-import'
        ]
    };
};
