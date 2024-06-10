module.exports={ 
    getTasks:'SELECT * FROM schedular.task',
    insertTask: "INSERT INTO schedular.task(task_name,description,type,minute) VALUES(?)",
    deleteTask: "DELETE FROM schedular.task where task=?",
    updateTask:'UPDATE schedular.task SET task_name =?, description = ?, type = ?, minute =? WHERE task = ?',
    task_log:'INSERT INTO schedular.scheduale_task(task_id,start_time,end_time) VALUES(?)',
    viewSchedualeTask:'SELECT * FROM schedular.scheduale_task'
}