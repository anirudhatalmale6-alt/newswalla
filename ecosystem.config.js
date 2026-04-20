module.exports = {
  apps: [
    {
      name: 'vtn-api',
      script: './apps/api/dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3001 }
    },
    {
      name: 'vtn-worker',
      script: './apps/api/dist/jobs/worker.js',
      instances: 1,
      env: { NODE_ENV: 'production' }
    }
  ]
};
