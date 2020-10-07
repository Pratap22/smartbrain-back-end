const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const image = require('./imageAPI');



const db = knex({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
      ssl : true
    }
});



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.user);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => {
                res.status(400).json('Unable to get user!!')
            })
        } else {
            res.json('Invalid username or password')
        }
    }).catch(err => {
        res.json('Invalid username or password')
    })
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
if(!email || !name || !password) {
    return res.status(400).json('Incorrect format')
}
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login').returning('email')
        .then(loginEmail => {
            return db('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                }).then(user => {
                res.json(user[0])
            })
        }).then(trx.commit).catch(trx.rollback)
    
    }).catch(err => res.json('User already exists!!'))
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('NOT FOUND');
        }
    }).catch(err => res.status(400).json('Not found'));
})

app.put('/image', (req, res) => {
    const {id} = req.body;

    db('users').where('id', '=', id).increment('entries', 1)
    .returning('entries').then(entries => {
        res.json(entries[0]);
    }).catch(err => {
        res.json("Unable to get entries!!")
    })
})

app.post('/imageURL', (req, res) => {image.imageurlAPI(req, res)})
app.listen(process.env.PORT || 3001, () => {
    console.log('App is running on port ' +(process.env.PORT || 3001))
});