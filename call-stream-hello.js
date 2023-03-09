'use strict'

const grpc = require('@grpc/grpc-js')
const { port, grpcObject } = require('./server')

const grpcClient = new grpcObject.mypackage.GreeterService(`localhost:${port}`, grpc.credentials.createInsecure())

;(async () => {
  const stream = grpcClient.StreamHello({ name: 'World' })
  let maxMessages = 10
  for await (const chunk of stream) {
    if (maxMessages-- === 0) {
      return
    }
    console.log(chunk)
  }
})()
  .then(() => {
    console.log('END')
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    process.exit(1)
  })
