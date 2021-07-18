const express = require('express')
const router = new express.Router()

const Task = require('../models/Task')

const auth = require('../middleware/auth')

router.post('/', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task);
    } catch(err) {
        res.status(400).send(err)
    }
})

router.get('/', auth, async (req,res) => {
    try{
        const tasks = await Task.find({ owner: req.user._id })
        res.send(tasks);
    } catch(err) {
        res.status(500).send(err)
    }
})

router.get('/:id', auth,  async (req,res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) return res.status(404).send()
        res.send(task);
    } catch(err){
        res.status(500).send(err)
    }
})

router.patch('/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid) return res.status(400).send({ error: 'Invalid updates'})

    try{

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(err){
        res.status(400).send(err)
    }
})

router.delete('/:id', auth, async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id})
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(err){
        res.status(500).send(err)
    }
})

module.exports = router