const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://biotop.tailbf4c09.ts.net',
      changeOrigin: true,
      secure: false, // Set to true in production if using valid certificates
      pathRewrite: (path, req) => {
        return path.replace('/api', '/api');
      },
      logLevel: 'debug', // Enable debug logging
    })
  );
};