const { application } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `Phone book has info for ${persons.length} people<br> ${new Date}}`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personToReturn = persons.find(person => person.id === id)
    if (personToReturn) {
        response.json(personToReturn)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    if (newPerson.name == null || newPerson.number == null) {
        return response.status(400).json({
            error: "Content Missing from request"
        })
    }

    if (checkNameExists(newPerson.name)) {
        return response.status(400).json({
            error: "Name already exists in phone book"
        })
    }

    const newPersonWithID = {
        "id": Math.floor((Math.random() * 3000) + 1),
        "name": newPerson.name,
        "number": newPerson.number
    }
    persons = persons.concat(newPersonWithID)
    response.json(newPersonWithID)
})

const checkNameExists = (name) => {
    const match = persons.filter(person => person.name === name)
    return (match.length != 0)
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})