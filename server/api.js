const express = require('express');
const router  = express.Router();


// curl localhost:3000/api/hello?name=Mitch
router.get('/hello', (request, response, next) => {
    let name = request.query.name || 'Unknown Person';
    response.status(200).json({
        message: `Hello ${name}!`
    });
});

// curl -X POST http://localhost:3000/api/command
// curl -X POST http://localhost:3000/api/command -d '{ action: "update" }'
// requires: app.use(express.json());
router.post('/command', (request, response, next) => {
    console.log(request?.body)
    if( !request?.body?.action ) {
        response.status(500).json({ error: "Unknown command" });
    } else {
        response.status(200).json({ action: request.body.action, status: "success" });        
    }
});


module.exports = router;