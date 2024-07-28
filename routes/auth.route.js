const express = require('express')
const {signup, signIn} = require('../controller/auth.controller')
const router = express()

router.post('/sigin', signIn)
router.post('/signup', signup)

module.exports = router