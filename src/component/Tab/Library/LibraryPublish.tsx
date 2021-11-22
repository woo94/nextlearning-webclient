import {Grid, Box, Typography} from '@mui/material'
import React, {useState} from 'react'
import StartLiveDialog from './StartLiveDialog'
import UploadVideoDialog from './UploadVideoDialog'

interface PublishBtnProps {
    name: string;
    handler: React.Dispatch<React.SetStateAction<boolean>>;
}

function PublishBtn(props: PublishBtnProps) {

    return (
        <Grid flexGrow={1} item>
            <Box p={2} sx={{cursor: 'pointer', border: '1px solid black'}} onClick={() => {props.handler(true)}}>
                <Typography textAlign="center" variant="h5">
                    {props.name}
                </Typography>
            </Box>
        </Grid>
    )
}

export default function LibraryPublish() {
    const [openStartLiveDialog, setOpenStartLiveDialog] = useState(false)
    const [openUploadVideoDialog, setOpenUploadVideoDialog] = useState(false)

    return (
        <>
            <Grid height="100px" columnGap={2} alignItems="center" container>
                <PublishBtn handler={setOpenStartLiveDialog} name="Start Live" />
                <PublishBtn handler={setOpenUploadVideoDialog} name="Upload Video" />
            </Grid>
            <StartLiveDialog openStartLiveDialog={openStartLiveDialog} setOpenStartLiveDialog={setOpenStartLiveDialog} />
            <UploadVideoDialog openUploadVideoDialog={openUploadVideoDialog} setOpenUploadVideoDialog={setOpenUploadVideoDialog} />
        </>
    )
}