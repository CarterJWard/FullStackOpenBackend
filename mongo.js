const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://carter1:${password}@cluster0.k3xm4w1.mongodb.net/phoneBook?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const personSchema = new mongoose.Schema({
    "name": String,
    "number": String
})

const Person = mongoose.model('Person', personSchema)

const Note = mongoose.model('Note', noteSchema)

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        if (process.argv.length < 3) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            return person.save()
        } else {
            Person.find({}).then(result => {
                result.forEach(singlePerson => {
                    console.log(singlePerson)
                })
            })
        }

    })
    .then(() => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to the phoneobok`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

