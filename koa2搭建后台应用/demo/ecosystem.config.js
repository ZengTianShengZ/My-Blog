module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   * pm2 deploy ecosystem.config.js production setup
   */
  apps : [
    {
      name: 'koa2-demo',
      script: 'start.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'server_logs/err.log',
      exec_mode: "cluster",
      out_file: 'server_logs/out.log',
      max_memory_restart: '600M', // 限制最大内存
      min_uptime: '200s', // 应用运行少于时间被认为是异常启动, 防止不断重启
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_development: {
        name: 'koa2-demo-development',
        NODE_ENV: 'development',
        watch: 'true'
      },
      env_testing: {
        name: 'koa2-demo-testing',
        NODE_ENV: 'testing' // 默认
      },
      env_production : {
        name: 'koa2-demo-production',
        NODE_ENV: 'production' // 默认
      }
    }
  ]
};
