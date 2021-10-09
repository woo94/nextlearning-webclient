import React, {useState} from 'react'
import {Dialog, Grid, Paper, DialogContent} from '@mui/material'
import cyan from '@mui/material/colors/cyan'

interface Props {
    sender: string;
    myUid: string;
    downloadURL: string;
}

export default function ImageDialog(props: Props) {
    const [open, setOpen] = useState(false)

    return (
        <Grid item>
            <Grid flexDirection={props.myUid === props.sender ? "row-reverse" : "row"} container >
                <Grid item>
                    <Paper sx={{ p: 1, m: 1, bgcolor: cyan[50] }} >
                        {<img onClick={() => {setOpen(true)}} style={{ width: '200px', height: 'auto', cursor: "pointer" }} src={props.downloadURL} />}
                    </Paper>
                    <Dialog
                        open={open}
                        onClose={() => {setOpen(false)}}
                    >
                        <DialogContent>
                            <img style={{ width: "100%", height: "auto" }} src={props.downloadURL} />
                        </DialogContent>
                    </Dialog>
                </Grid>
            </Grid>
        </Grid>
    )
}