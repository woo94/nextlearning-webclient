import React from 'react'
import {Box} from '@mui/material'

const GreyWallpaper: React.FC = ({children}) => {

    return (
        <Box sx={{my: 3, height: '100%', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', bgcolor: '#f6fafb'}} >
            {children}
        </Box>
    )
}

export default GreyWallpaper