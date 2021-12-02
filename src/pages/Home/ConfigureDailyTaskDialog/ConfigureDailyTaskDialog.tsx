
// daily_task문서가 있는지 없는지는 DailyTaskItem component에서 확인한다.
// 이 component가 view에 보이게 된다는 것은 daily_task문서가 없어서 새로 문서를 생성하면서 시간과 mode를 설정하려고 하는 것이다.
import {Dialog, DialogContent, Typography, Grid, TextField, DialogActions, Button} from '@mui/material'
import React, {useState, useContext, useEffect} from 'react'
import {Mode, __DOC__DAILY_TASK} from 'src/util/types/firestore_daily_task'
import {Timer, CameraAlt} from '@mui/icons-material'
import DailyTaskDialogContext from 'src/util/context/DailyTaskSelection'
import {getFirestore, doc, setDoc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {useHistory} from 'react-router-dom'
import { __DOC__PLANNER } from 'src/util/types/firestore_planner'
import {today} from 'src/util/dateInfo'

const firestore = getFirestore()
const auth = getAuth()

interface ModeItemProps {
    mode: Mode;
    text: string;
    icon: ReturnType<typeof Timer>;
    handleModeSelect: React.Dispatch<React.SetStateAction<Mode>>;
}

function ModeItem(props: ModeItemProps) {

    return (
        <Grid onClick={props.handleModeSelect.bind(null, props.mode)} sx={{border: '1px solid #f4f4f6', borderRadius: '3rem', px: 4, py: 3, my: 2, cursor: 'pointer'}} alignItems="center" justifyContent="" columnGap={5} container>
            <Grid item>
                {props.icon}
            </Grid>
            <Grid item>
                <Typography variant="h6">
                    {props.text}
                </Typography>
            </Grid>
        </Grid>
    )
}

interface Props {
    // openConfigureDialog: boolean;
    // setOpenConfigureDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfigureDailyTaskDialog(props: Props) {
    const {plannerId, openDialog, onCloseDialog} = useContext(DailyTaskDialogContext)
    const history = useHistory()
    const year_month = today.format('YYYY-M')
    const date = today.date()
    const [min, setMin] = useState('')
    const [mode, setMode] = useState<Mode>('')

    const handleRunTask = async () => {
        // createDoc and close
        const dailyTaskDoc: __DOC__DAILY_TASK = {
            planner_id: plannerId,
            year_month,
            date: today.date(),
            min: parseInt(min),
            fulfilled: 0,
            step: 'define',
            mode,
            time_option: '',
            result_list: []
        }

        const docId = `${year_month}-${date}-${plannerId}`

        const uid = auth.currentUser?.uid
        if(!uid) {
            alert('no currentUser')
            return
        }

        const docRef = doc(firestore, 'user', uid, 'daily_task', docId)

        await setDoc(docRef, dailyTaskDoc)
        
        // setDoc 안되면 에러 알려줘라
        onCloseDialog()
        history.push(`${history.location.pathname}/${plannerId}?mode=${mode}`)
    }

    return(
        <Dialog fullWidth maxWidth="xs" 
            open={openDialog}
            onClose={onCloseDialog}
        >
            <DialogContent>
                <Typography my={2} variant="h6">
                    Select mode
                </Typography>

                {
                    mode === "" ?
                        <>
                            <ModeItem mode="timer" handleModeSelect={setMode} text="Timer mode" icon={<Timer />} />
                            <ModeItem mode="recording" handleModeSelect={setMode} text="Recording mode" icon={<CameraAlt />} />
                        </> :
                        <>
                            <TextField value={min} onChange={(e) => {setMin(e.target.value)}} fullWidth label="min" />
                            <Button onClick={handleRunTask}>Run task</Button>
                        </>
                }
            </DialogContent>
        </Dialog>
    )
}