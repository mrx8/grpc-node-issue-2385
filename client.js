'use strict'

const path = require('node:path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const protoPath = path.resolve(__dirname, 'hello.proto')
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  defaults: false
})
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

const grpcClient = new protoDescriptor.hellopackage.GreeterService('0.0.0.0:12345', grpc.credentials.createInsecure())

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
  })
