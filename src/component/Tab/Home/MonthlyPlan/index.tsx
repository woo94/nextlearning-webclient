import {useState, useRef, useEffect} from 'react' 
import {Switch, Route, useRouteMatch} from 'react-router-dom'
import MonthlyPlanner from './MonthlyPlanner'
import {selectTask} from 'src/util/appState/taskSlice'
import {MonthlyTask} from 'src/util/types'
import {useAppSelector} from 'src/util/appState/hooks'
import MonthlyPlannerContext, {PlannerContext} from 'src/util/context/MonthlyPlannerContext'

export default function MonthlyPlan() {
    const {path} = useRouteMatch()
    const task = useAppSelector(selectTask)

    const [this_month_context, set_this_month_context] = useState<MonthlyTask.__DOC__MONTHLY_TASK>(task.this_month)
    const [next_month_context, set_next_month_context] = useState<MonthlyTask.__DOC__MONTHLY_TASK>(task.next_month)

    const [this_month_updateDoc, set_this_month_updateDoc] = useState<Partial<MonthlyTask.__DOC__MONTHLY_TASK>>({})
    const [next_month_updateDoc, set_next_month_updateDoc] = useState<Partial<MonthlyTask.__DOC__MONTHLY_TASK>>({})

    useEffect(() => {
        set_this_month_context(task.this_month)
        set_this_month_updateDoc({})
    }, [task.this_month])

    useEffect(() => {
        set_next_month_context(task.next_month)
        set_next_month_updateDoc({})
    }, [task.next_month])

    const editPlanner = (month: number, taskName: string, editContent: MonthlyTask.SingleTask) => {
        if(month === 0) {
            const _this_month_context = {...this_month_context}
            const _this_month_updateDoc = {...this_month_updateDoc}
            if(!Object.keys(this_month_context).includes(taskName)) {
                const counter = _this_month_context.counter
                _this_month_context.counter = counter + 1
                _this_month_updateDoc.counter = counter + 1
            }
            _this_month_context[taskName] = editContent
            _this_month_updateDoc[taskName] = editContent
            set_this_month_context(_this_month_context)
            set_this_month_updateDoc(_this_month_updateDoc)
        }
        else {
            const _next_month_context = {...next_month_context}
            const _next_month_updateDoc = {...next_month_updateDoc}
            if(!Object.keys(next_month_context).includes(taskName)) {
                const counter = _next_month_context.counter
                _next_month_context.counter = counter + 1
                _next_month_updateDoc.counter = counter + 1
            }
            _next_month_context[taskName] = editContent
            _next_month_updateDoc[taskName] = editContent
            set_next_month_context(_next_month_context)
            set_next_month_updateDoc(_next_month_updateDoc)
        }
    }

    return (
        <MonthlyPlannerContext.Provider value={{this_month: this_month_context, next_month: next_month_context, editPlanner, this_month_updateDoc: this_month_updateDoc, next_month_updateDoc: next_month_updateDoc}}>
            <Switch>
                <Route path={`${path}/:month`}>
                    <MonthlyPlanner />
                </Route>
            </Switch>
        </MonthlyPlannerContext.Provider>
    )
}