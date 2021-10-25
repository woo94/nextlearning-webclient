import { MonthlyTask } from 'src/util/types'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

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
        const {category, name, day_list, week_list, time, time_option, counter} = task

        task.week_list.forEach(weekNum => {
            weeks[weekNum].push(
                {
                   category, name, day_list, week_list, time, time_option, counter
                }
            )
        })
    }

    return weeks
}

export const appliedDays = (week_list: Array<number>, day_list: Array<string>, yearMonth: string, today: string) => {
    const days: Array<string> = []
    let dayjsObj = dayjs(yearMonth)
    const weekYear = dayjsObj.week()
        
    for(let i=1; i<=dayjsObj.daysInMonth(); i++) {
        dayjsObj = dayjsObj.date(i)
        
        if(!week_list.includes(dayjsObj.week() - weekYear)) {
            continue
        }

        if(day_list.includes(MonthlyTask.dayEnum[dayjsObj.day()])) {
            days.push(dayjsObj.date().toString())
        }
    }

    return days.filter(day => day > today)
}

export const isAbleDayExists = (weekNum: number, day_list: Array<MonthlyTask.Day>, yearMonth: string) => {
    let isAble = false
    let dayjsObj = dayjs(yearMonth)
    const month = dayjsObj.month()
    const weekYear = dayjsObj.week()
    dayjsObj = dayjsObj.week(weekYear+weekNum)
    day_list.forEach(day => {
        dayjsObj = dayjsObj.day(MonthlyTask.dayEnum[day])
        if(dayjsObj.month() === month) {
            isAble = true
        }
    })

    return isAble
}

export const getPossibleDays = (weekNum: number, day_list: Array<MonthlyTask.Day>, yearMonth: string, today: number) => {
    const days: Array<number> = []
    let dayjsObj = dayjs(yearMonth)
    const month = dayjsObj.month()
    const weekYear = dayjsObj.week()
    dayjsObj = dayjsObj.week(weekYear + weekNum)
    day_list.forEach(day => {
        dayjsObj = dayjsObj.day(MonthlyTask.dayEnum[day])
        const date = dayjsObj.date()
        if(dayjsObj.month() === month && date > today) {
            days.push(date)
        }
    })

    return days
}