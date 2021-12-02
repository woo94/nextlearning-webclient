import React from 'react'
import { Box, Typography } from '@mui/material'

interface Props {
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddTodayTask(props: Props) {

    return (
        <Box onClick={props.setOpenDialog.bind(null, true)} sx={{border: '1px dashed #d3d3d3', width: '90%', mx: 'auto', py: 1.5, borderRadius: '2rem', cursor: 'pointer'}}>
            <Typography textAlign="center" variant="h6">
                Add today task
            </Typography>
        </Box>
    )
}