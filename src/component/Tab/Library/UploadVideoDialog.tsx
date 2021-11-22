
import {Dialog} from '@mui/material'
import React from 'react'

interface Props {
    openUploadVideoDialog: boolean;
    setOpenUploadVideoDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UploadVideoDialog(props: Props) {
    
    return (
        <Dialog open={props.openUploadVideoDialog} onClose={props.setOpenUploadVideoDialog.bind(null, false)}>

        </Dialog>
    )
}