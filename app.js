const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 80

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'remotemysql.com',
    user            : 'uHop4pLKeJ',
    password        : 't6EawUiKPR',
    database        : 'uHop4pLKeJ'
})

// Get all es
app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from es', (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.json(rows)
            } else {
                console.log(err)
            }

        })
    })
})


// Get a ES by ID
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from es WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// Delete a records / ES
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from es WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`ES with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
})


// Add a record / ES
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body
      console.log(params)

       connection.query('INSERT INTO es SET ?', params , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.json({'Status':'Success'})
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


// Update a record / ES
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, name, tagline, description, image } = req.body

        connection.query('UPDATE es SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`ES with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})



// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listen on port ${port}`))
