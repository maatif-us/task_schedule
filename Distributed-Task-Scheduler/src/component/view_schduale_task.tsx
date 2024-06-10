import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axiosInstance from '../utility/axiosInstance';
import { endPoints } from '../utility/constants/constants';
import { useEffect, useState } from 'react';
import { SchedualeTaskListProps } from '../interfaces/task';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
const SchedualeTaskList = () => {
    const {id,task_name}=useParams();
    const [tasks, setTasks] = useState<SchedualeTaskListProps[]>([]);
    useEffect(() => {
        if(id){
            getData();
        }
    }, [])

    const getData = async () => {
        try{
            const result=await axiosInstance.get(`${endPoints.viewSchedualeTask}/${id}`)
            if(result?.data){
                setTasks(result?.data?.data);
                // toast.success(result?.data?.message);
                // setMessage([...message,result?.data?.message])
            }
        }catch(err){
            toast.error("Something Went Wrong");
        }

    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <>
            <h2>Schedualed Task List</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">id</StyledTableCell>
                            <StyledTableCell>Task Name</StyledTableCell>
                            <StyledTableCell align="center">Start Time</StyledTableCell>
                            <StyledTableCell align="center">End Time </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {tasks?.map((tasks) => (
                            <StyledTableRow key={tasks?.task_id}>
                                 <StyledTableCell align="center">{tasks?.task_id}</StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {task_name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{tasks?.start_time}</StyledTableCell>
                                <StyledTableCell align="center">{tasks?.end_time}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default SchedualeTaskList




