const express = require('express')
const router = new express.Router()

const User = require('../models/User')

const auth = require('../middleware/auth')

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(err){
        res.status(400).send(err)
    }
})

router.post('/', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(err) {
        res.status(400).send(err)
    }
})

router.post('/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch(err) {
        res.status(500).send()
    }
})

router.post('/logoutall', auth, async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(err) {
        res.status(500).send()
    }
})

router.get('/me', auth, async (req,res) => {
    res.send(req.user)
})

router.patch('/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid) return res.status(400).send({ error: 'Invalid updates'})

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch(err){
        res.status(400).send(err)
    }
})

router.delete('/me', auth,  async (req,res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch(err){
        res.status(500).send()
    }
})

module.exports = router