const express = require('express')
require('./db/db')

const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')

const app = express()

const port = process.env.PORT 

app.use(express.json())

// User Routes
app.use('/users', userRoutes)

// Task Routes
app.use('/tasks', taskRoutes)

app.listen(port, () => {
    console.log('Server running on port ' + port)
})