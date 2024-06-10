const express = require('express')
const db = require('../database')
const http = require("http")
const cron = require('node-cron')
const socketIo = require("socket.io");
const { getTasks, insertTask, deleteTask, updateTask, task_log, viewSchedualeTask } = require('../utils/taskSqlQuery')
const Router = express.Router
const router = Router()
const app = express();
const server = http.createServer(app);
const taskCronJobs = new Map();



//Get Task
router.get('/getTask/:id?', async (req, res) => {
        const id = req.params.id;
        let query = getTasks;
        if (id) {
                query += ` WHERE task = ${id}`;
        }
        try {

                const result = await new Promise((resolve, reject) => {
                        db.query(query, (err, dbRes) => {
                                if (err) {
                                        return reject({
                                                status: err.errno,
                                                message: err.message
                                        });
                                }
                                resolve({
                                        data: dbRes
                                });
                        });
                });
                res.send(result);
        } catch (err) {
                res.status(500).send(err);
        }
});


//Add TASK

router.post('/addTask', async (req, res) => {
        const values = [req.body.name, req.body.desc, req.body.type, req.body.seconds];
        try {
                const result = await new Promise((resolve, reject) => {
                        db.query(insertTask, [values], (err, dbRes) => {
                                if (err) {
                                        return reject({
                                                status: err.errno,
                                                message: err.message
                                        });
                                }
                                resolve({
                                        status: 201,
                                        message: "Successfully task created!!",
                                        data: {
                                                task_name: values[0],
                                                desc: values[1],
                                                type: values[2],
                                                minute: values[3]
                                        }
                                });
                        });
                });
                res.status(result.status).send(result);
        } catch (err) {
                res.status(500).send(err);
        }
});
// Delete Task


//Updat TASK

router.put('/updateTask', async (req, res) => {

        const values = [req.body.name, req.body.desc, req.body.type, req.body.seconds, parseInt(req.body.id)];
        try {
                const result = await new Promise((resolve, reject) => {
                        db.query(updateTask, values, (err, dbRes) => {

                                if (err) {
                                        return reject({
                                                status: err.errno,
                                                message: err.message
                                        });
                                }
                                resolve({
                                        status: 201,
                                        message: "Successfully task updated!!",
                                        data: {
                                                task_name: values[0],
                                                desc: values[1],
                                                type: values[2],
                                                minute: values[3],
                                                id: values[4]
                                        }
                                });
                        });
                });
                res.status(result.status).send(result);
        } catch (err) {
                res.status(500).send(err);
        }
});


//Execute Task

router.post('/executeTask', async (req, res) => {
        let { task, task_name, minute, type } = req.body;

        const currentTime = new Date().toLocaleTimeString([], { hour12: false });
        let currentTime2;
        if (type === 'dynamic') {
                console.log(currentTime, "currentTime")
              const job=  cron.schedule(`*/${minute} * * * * *`, () => {
                        currentTime2 = new Date().toLocaleTimeString([], { hour12: false });
                        const message = `'This task ${task_name} runs every ${minute} seconds start-Time :${currentTime} end-time :${currentTime2}`;
                        req.io.emit("FromAPI", { message: message });
                        const values = [task, currentTime, currentTime2];
                        try {
                                new Promise((resolve, reject) => {
                                        db.query(task_log, [values], (err, dbRes) => {

                                                if (err) {
                                                        return reject({
                                                                status: err.errno,
                                                                message: err.message
                                                        });
                                                }
                                                resolve({
                                                        status: 201,
                                                        message: "Successfully task inserted!!",
                                                });
                                        });
                                });
                        }
                        catch (err) {
                                console.log(err, "err")
                        }
                });
                taskCronJobs.set(task, job);

        } else if (type === 'static') {
                let hasRun = false;
                minute=10;
                 cron.schedule(`*/${minute} * * * * *`, () => {
                                if(!hasRun){
                                        currentTime2 = new Date().toLocaleTimeString([], { hour12: false });
                                        const message = `'This task ${task_name} runs only ${minute} seconds start-Time :${currentTime} end-time :${currentTime2}`;
                                        req.io.emit("FromAPI", { message: message });
                                        hasRun=true
                                        const values = [task, currentTime, currentTime2];
                                        try {
                                                new Promise((resolve, reject) => {
                                                        db.query(task_log, [values], (err, dbRes) => {
        
                                                                if (err) {
                                                                        return reject({
                                                                                status: err.errno,
                                                                                message: err.message
                                                                        });
                                                                }
                                                                resolve({
                                                                        status: 201,
                                                                        message: "Successfully task inserted!!",
                                                                });
                                                        });
                                                });
                                        }
                                        catch (err) {
                                                console.log(err, "err")
                                        }
                                }
                              
                        

                });
                

        }
});
router.delete('/deleteTask/:id', async (req, res) => {
        const taskId = req.params.id;
        const cronJob = taskCronJobs.get(parseInt(taskId));
        if(cronJob){
                cronJob.stop();
                taskCronJobs.delete(taskId);
                try {
                        const result = await new Promise((resolve, reject) => {
                                db.query(deleteTask, [taskId], (err, dbRes) => {
                                        if (err) {
                                                return reject({
                                                        status: err.errno,
                                                        message: err.message
                                                });
                                        }
                                        resolve({
                                                status: 200,
                                                message: "Successfully deleted task"
                                        });
                                });
                        });
                        res.status(result.status).send(result);
                } catch (err) {
                        res.status(500).send(err);
                }
        }
        else{
                res.status(500).json({message: "cant delete task before scheduled"});
        }
     
});



//Get Schedulaed Task
//Get Task
router.get('/viewSchedualeTask/:id', async (req, res) => {
        const id = req.params.id;
        let query = viewSchedualeTask;
        if (id) {
                query += ` WHERE task_id = ${id}`;
        }
        try {

                const result = await new Promise((resolve, reject) => {
                        db.query(query, (err, dbRes) => {
                                if (err) {
                                        return reject({
                                                status: err.errno,
                                                message: err.message
                                        });
                                }
                                resolve({
                                        data: dbRes
                                });
                        });
                });
                res.send(result);
        } catch (err) {
                res.status(500).send(err);
        }
});


module.exports = router;