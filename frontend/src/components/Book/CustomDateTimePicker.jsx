import React, { useState } from 'react';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import TextField from '@mui/material/TextField';

function CustomDateTimePicker() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                    setStartDate(newValue);
                }}
                views={['year', 'month', 'day', 'hours']}
                sx={{mr: '2rem'}}
            />
            <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                    setEndDate(newValue);
                }}
                views={['year', 'month', 'day', 'hours']}
            />
        </LocalizationProvider>
    );
}

export default CustomDateTimePicker;