module.exports = {
  apps: [
    {
      name: 'newswalla-api',
      script: './apps/api/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3001 }
    }
  ]
};
