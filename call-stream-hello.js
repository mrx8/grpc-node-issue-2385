'use strict'

const grpc = require('@grpc/grpc-js')
const { port, protoDescriptor } = require('./server')

const grpcClient = new protoDescriptor.mypackage.GreeterService(`localhost:${port}`, grpc.credentials.createInsecure())

;(async () => {
  const stream = grpcClient.StreamHello({ name: 'World' })
  for await (const chunk of stream) {
    console.log(chunk)
  }
})()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
