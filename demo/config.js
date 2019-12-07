const common = {
  mongodb: 'mongodb://localhost:27017/demo'
}

const development = Object.assign(common ,{
  port: 3000
})

const production = Object.assign(common ,{
  port: 3001
})

let config

process.env.NODE_ENV === 'production' ? config = production : config = development

export default config