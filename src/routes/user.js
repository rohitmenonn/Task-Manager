const express = require('express')
const router = new express.Router()

const User = require('../models/User')

router.post('/', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.get('/', async (req,res) => {
    try{
        const users = await User.find({})
        res.status(201).send(users)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.get('/:id', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user) return res.status(404).send()
        res.send(user)
    } catch(err){
        res.status(500).send(err)
    }
})

router.patch('/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid) return res.status(400).send({ error: 'Invalid updates'})

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!user) return res.status(404).send()
        res.send(user)
    } catch(err){
        res.status(400).send(err)
    }
})

router.delete('/:id', async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send()
        res.send(user)
    } catch(err){
        res.status(500).send(err)
    }
})

module.exports = router