import React from "react"
import { Dialog, DialogTitle, DialogContent, Box, Button, DialogActions, Link } from '@mui/material'
import {grey, lightBlue, indigo} from '@mui/material/colors'
import { useHistory } from "react-router"
import { MonthlyTask } from "src/util/types"
import _ from 'lodash'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectTask} from 'src/util/appState/taskSlice'
import {selectUser} from 'src/util/appState/userSlice'
import {taskIdToAccessor} from 'src/util/snippets'
import {getFirestore, updateDoc, doc} from 'firebase/firestore'

interface Props {
    openSelectModeDialog: boolean;
    dailyAssignment: MonthlyTask.DailyAssignment;
    setOpenSelectModeDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const firestore = getFirestore()

export default function SelectModeDialog(props: Props) {
    const history = useHistory()
    const task = useAppSelector(selectTask)
    const user = useAppSelector(selectUser)

    const handleClickMode = (mode: "timer" | "record") => {
        const {docId, fieldName, date} = taskIdToAccessor(props.dailyAssignment.id)
        const monthlyTaskRef = doc(firestore, 'user', user.uid, 'monthly_task', docId)
        const updateDocument: Partial<MonthlyTask.__DOC__MONTHLY_TASK> = { }
        const _task = _.cloneDeep(task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask)
        _task.daily_management[date].mode = mode
        updateDocument[fieldName] = _task
        updateDoc(monthlyTaskRef, updateDocument)

        props.setOpenSelectModeDialog(false)
        history.push(`${history.location.pathname}/${mode}-mode`, {id: props.dailyAssignment.id})
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={props.setOpenSelectModeDialog.bind(null, false)} open={props.openSelectModeDialog}>
            <DialogTitle>
                Select Mode
            </DialogTitle>
            <DialogContent>
                <Box my={3} sx={{textAlign: 'center'}}>
                    <Button
                         variant="contained" 
                         sx={{ 
                             '&:hover': { bgcolor: lightBlue[400] }, 
                             bgcolor: lightBlue[100], 
                             color: 'black', 
                             border: '1px solid black', 
                             height: '70px', 
                             width: '80%', 
                             borderRadius: '20px', 
                             fontSize: '1.3rem'
                             }}
                         onClick={handleClickMode.bind(null, 'timer')}
                        >
                                 Timer Mode
                    </Button>
                </Box>
                <Box my={3} sx={{textAlign: 'center'}}>
                    <Button
                         variant="contained" 
                         sx={{ 
                             '&:hover': { bgcolor: lightBlue[400] }, 
                             bgcolor: lightBlue[100], 
                             color: 'black', 
                             border: '1px solid black', 
                             height: '70px', 
                             width: '80%', 
                             borderRadius: '20px', 
                             fontSize: '1.3rem'
                             }}
                         onClick={handleClickMode.bind(null, 'record')}     
                        >
                                 
                                 Record Mode
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Link sx={{color: 'orangered'}}>Why do you need to record?</Link>
            </DialogActions>
        </Dialog>
    )
}