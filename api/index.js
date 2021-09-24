const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080

app.use(cors())
app.use(express.json())

app.get('/contact', (req, res) => {
    const contact = [
        {
            em: 'test@test.com'
        },
        {
            ph: '+821011111111'
        },
        {
            em: 'woo@woo2.com'
        },
        {
            em: 'woo3@woo3.com'
        }
    ]

    res.json(contact)
})

app.listen(port, () => {
    console.log(`api is running at http://localhost:${port}`)
})