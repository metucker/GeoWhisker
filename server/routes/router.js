const express = require('express');
const router = express.Router();;

router.get('/users', (req, res) => {
    const userData = [
        {
            id: 1,
            name: 'John Doe'
        },
        {
            id: 2,
            name: 'Jane Doe'
        }
    ];
    res.send('Hello World');
});

module.exports = router;