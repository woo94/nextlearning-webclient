import {useState} from 'react'
import TopController from '../../../../Common/TopController'
import {useHistory} from 'react-router-dom'
import {Grid, Typography, IconButton, Dialog, Button, DialogTitle, DialogContent, DialogActions, TextField, Box} from '@mui/material'
import {ArrowBackIos, Add } from '@mui/icons-material'
import * as Sendbird from 'sendbird'

function StudyGroupList() {
    const history = useHistory()
    const [openModal, setOpenModal] = useState(false)
    const [sb, setSb] = useState(Sendbird.default.getInstance())
    const [createGroupText, setCreateGroupText] = useState('')

    const handleBackBtn = () => {
        history.goBack()
    }

    const createStudyGroup = () => {
        const userIds = [sb.currentUser.userId]
        sb.GroupChannel.createChannelWithUserIds(userIds, false, createGroupText, '', '', '', (groupChannel, error) => {
            if(error) {
                console.log(error)
                return
            }
            console.log(groupChannel)
            console.log(`group channel ${createGroupText} has created`)
        })
    }

    return (
        <>
            <Grid container alignItems="center" >
                <Grid item>
                    <IconButton onClick={handleBackBtn} > <ArrowBackIos /> </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        Study Group
                    </Typography>
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item>
                    <IconButton onClick={() => {setOpenModal(true)}}>
                        <Add />
                    </IconButton>
                </Grid>
            </Grid>

            <Dialog
                open={openModal}
                onClose={() => {setOpenModal(false)}}
            >
                <DialogContent>
                    <Box sx={{width: '350px', height: 'auto'}}>
                        <Grid  alignItems="center" flexDirection="column" container>
                            <div style={{ width: '200px', height: '200px', backgroundColor: 'orangered', borderRadius: '100%' }}>
                            </div>
                            <Grid item>
                                <Button>Upload group image</Button>
                            </Grid>
                            <Grid sx={{my: 2}} item>
                                <TextField value={createGroupText} onChange={(e) => {setCreateGroupText(e.target.value)}} variant="standard" />
                            </Grid>
                            <Grid sx={{my: 2}} item>
                                <Button onClick={createStudyGroup} variant="contained" size="large">create</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        <div>Study group list</div>
        </>
    )
}

export default StudyGroupList