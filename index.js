const express = require('express')
const mongodb = require('mongodb-legacy')
const bcrypt = require('bcrypt');

const app = express();
app.listen(3000)

app.use(express.json())

let MongoClient = mongodb.MongoClient;
let db = '';

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
    if(err !== undefined){
        throw new Error(err)
    } else {
        db = client.db('cifrado')
    }
})

app.get('/', (req, res)=>{
    db.collection('users').find().toArray((err,datos)=>{
        if(err !== undefined){
            throw new Error(err)
        } else {
            res.send(datos)
        }
    })
})


app.post('/registro', (req, res)=>{
    console.log(req.body)
    // const {username, password} = req.body
    let contrascifrada = bcrypt.hashSync(req.body.password, 10);
    console.log(contrascifrada)

    db.collection('users').insertOne({username:req.body.username, password:contrascifrada}, (err, data)=>{
        if(err !== undefined){
            throw new Error(err)
        }else{
            res.send(data)
        }
    })
})

app.post('/login', (req, res)=>{
    console.log(req.body)
    let {username, password}=req.body

    db.collection('users').find({username:username}).toArray((err, client)=>{
        if(err !== undefined){
            throw new Error(err)
        }else{
            console.log('estoy entrando aqui')
            console.log(client)
            if(client.length > 0){
                if(bcrypt.compareSync(password, client[0].password)){
                    res.send({message:'logeado'} )
                }else{
                    res.send({message:'contrasela incorrecta'})
                }
            }else{
                res.send({message:'el usuario no existe'})
            }
        }
    })


})



// let contrascifrada1 = bcrypt.hashSync('12345', 10)
// console.log(contrascifrada1)

// let coincidencia = bcrypt.compareSync('1234', contrascifrada1);

// console.log(coincidencia)