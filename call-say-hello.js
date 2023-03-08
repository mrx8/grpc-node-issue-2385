'use strict'

const grpc = require('@grpc/grpc-js')
const { port, protoDescriptor } = require('./server')

const grpcClient = new protoDescriptor.mypackage.GreeterService(`localhost:${port}`, grpc.credentials.createInsecure())

;(async () => {
  const response = await new Promise((resolve, reject) => {
    grpcClient.SayHello({ name: 'World' }, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
  console.log(response)
})()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
