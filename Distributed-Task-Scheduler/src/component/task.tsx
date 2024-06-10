
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { ObjectType } from '../interfaces/task';
import { TaskDetail } from '../interfaces/task';
import axiosInstance from '../utility/axiosInstance';
import { endPoints } from '../utility/constants/constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const Task = () => {
    const navigate = useNavigate();
    const {id}=useParams();
    const [taskDetail, setTaskDetail] = useState<TaskDetail>({ name: '', description: '',second:'' })
    const [selectedValue, setSelectedValue] = useState<string>('static')

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedValue(event.target.value)
    };
    useEffect(()=>{
        if(id){
            getTaskAgaintId()
        }
       
    },[id])
    const getTaskAgaintId=async ()=>{
        try{
            const result=await axiosInstance.get(`${endPoints.getTasks}/${id}`)
            if(result?.data){
                setTaskDetail({
                    name: result?.data?.data[0]?.task_name || '',
                    description: result?.data?.data[0]?.description || '',
                    second:result?.data?.data[0]?.minute || '',
                });
                setSelectedValue(result?.data?.data[0]?.type )
            }
        }catch(err){
            toast.error("Something Went Wrong");
        }
    }
    const handleSubmit = async() => {
        // const seconds = formattedTime?.minute();
        const Obj:ObjectType={
            name:taskDetail.name,
            desc:taskDetail.description,
            seconds:taskDetail.second
        }
        if(selectedValue==='dynamic'){
          Obj.type='dynamic';
          if(taskDetail.second){
            Obj.seconds=taskDetail.second;
          }
        
        }
        if(selectedValue==='static'){
            Obj.type='static';
            Obj.seconds=null;
        }
        try{
            if(id){
                Obj.id=+id
                const result=await axiosInstance.put(endPoints?.updateTask,Obj)
                if(result?.data){
                    toast.success(result?.data?.message);
                    navigate('/');
                }
            }else{
                const result=await axiosInstance.post(endPoints?.addTask,Obj)
                if(result?.data){
                    toast.success(result?.data?.message);
                    navigate('/');
                }
            }
        }catch(err){
            toast.error("Something Went Wrong");
        }
    }

    return (
        <>
            <Box   sx={{ minWidth: 750}}>
                <TextField id="standard-basic" label="Enter Task Name" fullWidth variant="standard"  value={taskDetail.name}
                onChange={(event)=> setTaskDetail({ ...taskDetail, name: event.target.value })} required 
                error={taskDetail?.name?.trim() === ''} 
                helperText={taskDetail?.name?.trim() === '' ? 'Task Name is required' : ' '}/>
                <TextField
                    fullWidth
                    placeholder="Task Description"
                    multiline
                    rows={4}
                    maxRows={4}
                    sx={{ marginTop: 3 }}
                    value={taskDetail.description}
                    onChange={(event)=> setTaskDetail({ ...taskDetail, description: event.target.value })}
                    required
                />
                <FormControl variant="standard" sx={{ minWidth: 150, marginTop: 2 }} fullWidth>
                    <Select
                        onChange={handleChange}
                        placeholder='Task Type'
                        label="Task Type"
                        value={selectedValue}
                    >
                        <MenuItem value='static'>One Time Task</MenuItem>
                        <MenuItem value='dynamic'>Recurring Task</MenuItem>
                    </Select>
                </FormControl>
                {selectedValue == 'dynamic' ? (
                   <TextField  label="Enter Time in second" fullWidth variant="outlined"  value={taskDetail.second}
                   onChange={(event)=> setTaskDetail({ ...taskDetail, second: event.target.value })} required sx={{marginTop:2}}/>
                ) : null}
                <Button variant="contained" color="success" sx={{marginTop:3}} onClick={handleSubmit} disabled={taskDetail?.name?.trim() === ''}>
                   {id ? 'Edit Task' :'Add Task'} 
                </Button>
            </Box>
        </>
    )
}

export default Task
