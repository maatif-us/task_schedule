import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

export interface DateTimePickersProps {
    selectedDate: Dayjs | null;
    setSelectedDate: Dispatch<SetStateAction<Dayjs | null>>;
}