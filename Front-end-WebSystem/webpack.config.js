module.exports = {
    // ... outras configurações
    module: {
        rules: [
            // ... outras regras
            {
                test: /pdf\.worker\.min\.js$/,
                use: { loader: 'file-loader' }
            }
        ]
    }
};