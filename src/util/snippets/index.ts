import { MonthlyTask } from 'src/util/types'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import { __DOC__DAILY_TASK } from '../types/firestore_daily_task'

dayjs.extend(weekOfYear)

export const createSingleTask = (category: string, date: number, min: number, name: string, time_option: string) => {
    return {
        category,
        date,
        fulfilled: 0,
        min,
        name,
        step: 'define',
        time_option
    }
}

export const sortMonthlyTask = (taskDoc: MonthlyTask.__DOC__MONTHLY_TASK, numberOfWeeks: number) => {
    const weeks: Array<Array<MonthlyTask.TaskMetadata>> = []
    
    for(let i=1; i<=numberOfWeeks; i++) {
        weeks.push([])
    }

    const taskKeys = Object.keys(taskDoc).filter(key => key !== "counter")

    for(let key of taskKeys) {
        const task = taskDoc[key] as MonthlyTask.SingleTask
        const {category, name, day_list, week_list, min, time_option, counter} = task

        task.week_list.forEach(weekNum => {
            weeks[weekNum].push(
                {
                   category, name, day_list, week_list, min, time_option, counter
                }
            )
        })
    }

    return weeks
}

export const appliedDays = (week_list: Array<number>, day_list: Array<number>, yearMonth: string, today: string) => {
    const days: Array<string> = []
    let dayjsObj = dayjs(yearMonth)
    const weekYear = dayjsObj.week()
        
    for(let i=1; i<=dayjsObj.daysInMonth(); i++) {
        dayjsObj = dayjsObj.date(i)
        
        if(!week_list.includes(dayjsObj.week() - weekYear)) {
            continue
        }

        if(day_list.includes(dayjsObj.day())) {
            days.push(dayjsObj.date().toString())
        }
    }

    return days.filter(day => day > today)
}

export const getPossibleDays = (weekNum: number, day_list: Array<number>, yearMonth: string, today: number) => {
    const days: Array<number> = []
    let dayjsObj = dayjs(yearMonth)
    const month = dayjsObj.month()
    const weekYear = dayjsObj.week()
    dayjsObj = dayjsObj.week(weekYear + weekNum)
    day_list.forEach(day => {
        dayjsObj = dayjsObj.day(day)
        const date = dayjsObj.date()
        if(dayjsObj.month() === month && date > today) {
            days.push(date)
        }
    })

    return days
}

export const taskIdToAccessor = (id: string) => {
    const [year, month, date, fieldName] = id.split('-')
    return {
        docId: `${year}-${month}`,
        fieldName,
        date
    }
}

export const createCalendar = (planners: Array<__DOC__PLANNER>, ...year_month: Array<string>) => {
    interface Calendar {
        [key: number]: Array<__DOC__PLANNER & __DOC__DAILY_TASK>;
    }

    interface Calendars {
        // year_month
        [key: string]: Calendar;
    }

    const c: Calendars = { }
    year_month.forEach(ym => {
        const dateObj = dayjs(ym)
        c[ym] = { }
        const daysInMonth = dateObj.daysInMonth()
        for(let i=1; i<=daysInMonth; i++) {
            c[ym][i] = []
        }
    })

    planners.forEach(planner => {
        planner.define_date_list.forEach(date => {
            c[planner.year_month][date].push({
                ...planner, 
                date,
                min: 0,
                fulfilled: 0,
                mode: 'timer',
                step: 'define',
                result_list: []
            })
        })
    })

    return c
}