import {createContext} from 'react'
import {MonthlyTask} from 'src/util/types'

export interface PlannerContext {
    this_month: MonthlyTask.__DOC__MONTHLY_TASK;
    next_month: MonthlyTask.__DOC__MONTHLY_TASK; 
    // month: 
    // 0 when this_month
    // 1 when next_month
    editPlanner: (month: number, taskName: string, editContent: MonthlyTask.SingleTask) => void;
    this_month_updateDoc: Partial<MonthlyTask.__DOC__MONTHLY_TASK>;
    next_month_updateDoc: Partial<MonthlyTask.__DOC__MONTHLY_TASK>;
}

const MonthlyPlannerContext = createContext<PlannerContext | null>(null)
MonthlyPlannerContext.displayName = 'MonthlyPlannerContext'

export default MonthlyPlannerContext