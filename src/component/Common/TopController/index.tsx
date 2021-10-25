import React, {useContext} from 'react'
import SingleActionController from "./SingleActionController";
import {Props} from './util'
import Box from '@mui/material/Box'

function TopController(props: Props) {
    return (
        <Box pt={1} pb={2} >
            <SingleActionController {...props} />
        </Box>
    )
}

export default TopController
export * from './util'