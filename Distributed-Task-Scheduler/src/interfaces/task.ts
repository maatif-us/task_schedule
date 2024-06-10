export interface TaskDetail{
    name: string;
    description: string;
    second:string
}

export interface ObjectType{
    id?:number,
    name: string;
    desc: string;
    type?:string;
    seconds?:string | null;
}

export interface TaskListProps {
    description: string;
    minute: number | null;
    task: number;
    task_name: string;
    type: string;
  }


export interface SchedualeTaskListProps {
    start_time: string;
    end_time: number | null;
    task_id: number;
  }