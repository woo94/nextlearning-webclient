import TimerMode from './TimerMode'
import RecordingMode from './RecordingMode'
import {useLocation} from 'react-router-dom'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectPlanner, plannerSelectors} from 'src/util/appState/plannerSlice'
import {selectDailyTask, dailyTaskSelectors} from 'src/util/appState/dailyTaskSlice'
import {today} from 'src/util/dateInfo'
import {Mode} from 'src/util/types/firestore_daily_task'

export default function RunTask() {
    const planner = useAppSelector(selectPlanner)
    const dailyTask = useAppSelector(selectDailyTask)

    const {pathname, search} = useLocation()
    const plannerId = pathname.split('/')[3]
    const query = new URLSearchParams(search)
    const mode = query.get("mode") as Mode

    const dateString = today.format('YYYY-M-D')

    const plan = plannerSelectors.selectById(planner, plannerId)
    const task = dailyTaskSelectors.selectById(dailyTask, `${dateString}-${plannerId}`)

    // 우선 plan의 내용을 가지고 view 깔아주고
    // 그 다음 task가 비동기적으로 task에 추가될 가능성이 있기 때문에.. 예외처리를 잘해주도록 한다.

    return (
        <>
            {
                mode === "timer" ?
                <TimerMode task={{...plan, ...task}} /> :
                <RecordingMode task={{...plan, ...task}} />
            }
        </>
    )
}