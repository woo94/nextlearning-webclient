import React, {useState} from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Select, MenuItem, Grid, Typography, Button} from '@mui/material'
import {getFunctions, httpsCallable } from 'firebase/functions'
import {v4 as uuidv4} from 'uuid'

interface Props {
    openStartLiveDialog: boolean
    setOpenStartLiveDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const functions = getFunctions()

export default function StartLiveDialog(props: Props) {
    const [totalTime, setTotalTime] = useState(30)

    const handleStartLive = () => {
        const generate_agora_auth_token = httpsCallable(functions, 'generate_agora_auth_token')
        generate_agora_auth_token({
            role: "publisher",
            channelName: uuidv4()
        }).then(res => {
            console.log(res)
        })
    }

    return (
        <Dialog fullWidth open={props.openStartLiveDialog} onClose={props.setOpenStartLiveDialog.bind(null, false)}>
            <DialogTitle>Start Live</DialogTitle>
            <DialogContent>
                <Box my={2}>
                    <TextField fullWidth placeholder="Title" />
                </Box>
                <Box my={2}>
                    <TextField multiline maxRows={4} minRows={4} fullWidth placeholder="Description (optional)" />
                </Box>

                <Grid alignItems="center" columnGap={3} justifyContent="flex-end" container>
                    <Grid item>
                        <Typography variant="h6">
                            Total time
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            value={totalTime}
                            onChange={(e) => { setTotalTime(e.target.value as number) }}
                        >
                            <MenuItem value={30} >30 min</MenuItem>
                            <MenuItem value={60} >60 min</MenuItem>
                            <MenuItem value={90} >90 min</MenuItem>
                            <MenuItem value={120} >120 min</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleStartLive} sx={{fontSize: '1.5rem'}}>
                    Start Live
                </Button>
            </DialogActions>
        </Dialog>
    )
}