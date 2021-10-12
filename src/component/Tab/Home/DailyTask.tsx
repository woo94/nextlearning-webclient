
import {useRouteMatch} from 'react-router-dom'

export default function DailyTask() {
    const match = useRouteMatch()
    console.log(match)

    return (
        <div>
            DailyTask
        </div>
    )
}