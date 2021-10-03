import {useState, useEffect} from 'react'
import TopController from '../../../../Common/TopController'
import {useHistory, useRouteMatch, Switch, Route} from 'react-router-dom'
import {Grid, Typography, IconButton, Dialog, Button, DialogTitle, DialogContent, DialogActions, TextField, Box} from '@mui/material'
import {ArrowBackIos, Add } from '@mui/icons-material'
import {useAppSelector, useAppDispatch} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {addStudyGroup} from 'src/util/appState/studyGroupSlice'
import {getFunctions, httpsCallable} from 'firebase/functions'
import {User} from 'src/util/types'
import GroupChatRoom from '../GroupChatRoom'

function StudyGroupList() {
    const history = useHistory()
    const [openModal, setOpenModal] = useState(false)
    const [createGroupTitle, setCreateGroupTitle] = useState('')
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const {path} = useRouteMatch()

    const handleBackBtn = () => {
        history.goBack()
    }

    const createStudyGroup = async () => {
        const functions = getFunctions()
        const myName = user.name

        const create_study_group = httpsCallable(functions, "create_study_group")
        const myStudyGroupDoc = await create_study_group({
            title: createGroupTitle,
            description: "",
            img: "",
            myName
        })
        
        dispatch(addStudyGroup(myStudyGroupDoc))
        setOpenModal(false)
        setCreateGroupTitle('')
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
                                <TextField value={createGroupTitle} onChange={(e) => {setCreateGroupTitle(e.target.value)}} variant="standard" />
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