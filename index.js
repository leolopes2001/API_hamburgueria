
const { request, response, json } = require('express')
const express = require('express')

const app = express()
const port = 3000
const uuid = require('uuid')

app.use(express.json())

data_orders = []

const checkUserId = (request, response,next) => {
    const {id} = request.params

    const index = data_orders.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json('User not found')
    }
    request.userId = id
    request.userIndex = index

    next()
}

const type_of_request = (request,response,next) =>{
    console.log(request.method)
    console.log(`http://localhost:3000${request.url}`)
    next()
}

app.get('/order',type_of_request, (request,response) => {
    return response.json(data_orders)
})

app.post('/order',type_of_request, (request,response) => {
    const {order,clientName,price,status} = request.body

    const newUser = {id:uuid.v4(),order,clientName,price,status}

    data_orders.push(newUser)

    return response.status(201).json(newUser)
})

app.get('/order/:id',checkUserId,type_of_request, (request,response) => {
    const index = request.userIndex
    return response.json(data_orders[index])
})

app.put('/order/:id',checkUserId,type_of_request, (request,response) => {
    const id = request.userId
    const index = request.userIndex

    const {order,clientName,price,status} = request.body

    const updateUser = {id,order,clientName,price,status}

    data_orders[index] = updateUser

    return response.json(updateUser)
})

app.delete('/order/:id',checkUserId,type_of_request ,(request,response) => {
    const id = request.userId
    const index = request.userIndex

    data_orders.splice(index,1)

    return response.json(data_orders)
})

app.patch('/order/:id',checkUserId,type_of_request , (request,response) => {
    const id= request.userId
    const index = request.userIndex
    
    const {order,clientName,price} = data_orders[index]

    let status = data_orders[index].status
    status = 'Finished'

    const finishedOrder ={id,order,clientName,price,status}

    data_orders[index] = finishedOrder
    
    return response.json(data_orders)
})

app.listen(port, () => {
    console.log("SERVER STARTED :) :) :) :) :) :)")
})