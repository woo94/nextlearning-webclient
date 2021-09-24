import React, {useContext} from 'react'
import SingleActionController from "./SingleActionController";
import MultiActionController from "./MultiActionController"
import {Props} from './util'
import Box from '@mui/material/Box'

function TopController(props: Props) {
    if(props.actions.length <= 1) {
        return (
            <Box pt={1} pb={2} >
                <SingleActionController {...props} />
            </Box>
        )
    }
    else {
        return (
            <Box pt={1} pb={2} >
                <MultiActionController {...props} />
            </Box>
        )
    }
}

export default TopController
export * from './util'