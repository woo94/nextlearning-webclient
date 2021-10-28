import {RootState} from './Store'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import {Category} from 'src/util/types'
import {MonthlyTask} from 'src/util/types'

const firestore = getFirestore()

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekOfYear)

dayjs.tz.setDefault(dayjs.tz.guess())

const yesterday = dayjs().subtract(1, 'day')
const today = dayjs()
const tomorrow = dayjs().add(1, 'day')
const last_month = dayjs().subtract(1, 'month')
const next_month = dayjs().add(1, 'month')

interface DateInfo {
    year: string;
    monthIntStr: string;
    monthFullStr: string;
    date: string;
    day: number;
    week: number;
}

interface MonthInfo extends DateInfo {
    numberOfWeeks: number;
    yearMonth: string;
}

interface TaskState {
    monthly_task_docs: {
        [key: string]: MonthlyTask.__DOC__MONTHLY_TASK
    }
    last_month: MonthlyTask.__DOC__MONTHLY_TASK;
    this_month: MonthlyTask.__DOC__MONTHLY_TASK;
    next_month: MonthlyTask.__DOC__MONTHLY_TASK;
    dates: {
        today: DateInfo;
        tomorrow: DateInfo;
        yesterday: DateInfo;
        last_month: MonthInfo;
        next_month: MonthInfo;
        this_month: MonthInfo & { currentWeek: number };
    };
    calenders: {
        [key: string]: Calender;
    };
    designated_task: Category.__DOC__CATEGORY;
}

interface Calender {
    [key: string]: Array<MonthlyTask.DailyAssignment>;
}

const initialState: TaskState = {
    monthly_task_docs: {

    },
    last_month: {
        counter: 0
    },
    this_month: {
        counter: 0
    },
    next_month: {
        counter: 0
    },
    calenders: {

    },
    dates: {
        yesterday: {
            year: yesterday.format('YYYY'),
            monthIntStr: yesterday.format('MM'),
            monthFullStr: yesterday.format('MMMM'),
            date: yesterday.format('DD'),
            day: yesterday.day(),
            week: yesterday.week() - yesterday.startOf('month').week()
        },
        today: {
            year: today.format('YYYY'),
            monthIntStr: today.format('MM'),
            monthFullStr: today.format('MMMM'),
            date: today.format('DD'),
            day: today.day(),
            week: today.week() - today.startOf('month').week()
        },
        tomorrow: {
            year: tomorrow.format('YYYY'),
            monthIntStr: tomorrow.format('MM'),
            monthFullStr: tomorrow.format('MMMM'),
            date: tomorrow.format('DD'),
            day: tomorrow.day(),
            week: tomorrow.week() - tomorrow.startOf('month').week()
        },
        last_month: {
            year: last_month.format('YYYY'),
            monthIntStr: last_month.format('MM'),
            monthFullStr: last_month.format('MMMM'),
            numberOfWeeks: dayjs(`${last_month.format('YYYY-MM')}-${last_month.daysInMonth()}`).week() - dayjs(`${last_month.format('YYYY-MM')}-01`).week() + 1,
            date: last_month.format('DD'),
            yearMonth: last_month.format('YYYY-MM'),
            day: 0,
            week: 0
        },
        this_month: {
            year: today.format('YYYY'),
            monthIntStr: today.format('MM'),
            monthFullStr: today.format('MMMM'),
            numberOfWeeks: dayjs(`${today.format('YYYY-MM')}-${today.daysInMonth()}`).week() - dayjs(`${today.format('YYYY-MM')}-01`).week() + 1,
            date: today.format('DD'),
            yearMonth: today.format('YYYY-MM'),
            currentWeek: today.week() - dayjs().startOf('month').week(),
            day: 0,
            week: 0
        },
        next_month: {
            year: next_month.format('YYYY'),
            monthIntStr: next_month.format('MM'),
            monthFullStr: next_month.format('MMMM'),
            numberOfWeeks: dayjs(`${next_month.format('YYYY-MM')}-${next_month.daysInMonth()}`).week() - dayjs(`${next_month.format('YYYY-MM')}-01`).week() + 1,
            date: next_month.format('DD'),
            yearMonth: next_month.format('YYYY-MM'),
            day: 0,
            week: 0
        }
    },
    designated_task: {
        school: [],
        extracurricular: [],
        challenges: []
    }
}

const last_month_calender: Calender = {}
for(let i=0; i<=last_month.daysInMonth(); i++) {
    last_month_calender[i.toString()] = []
}

const this_month_calender: Calender = {}
for(let i=0; i<=today.daysInMonth(); i++) {
    this_month_calender[i.toString()] = []
}

const next_month_calender: Calender = {}
for(let i=0; i<=next_month.daysInMonth(); i++) {
    next_month_calender[i.toString()] = []
}

initialState.calenders[last_month.format('YYYY-MM')] = last_month_calender
initialState.calenders[today.format('YYYY-MM')] = this_month_calender
initialState.calenders[next_month.format('YYYY-MM')] = next_month_calender

const createMonthlyTask = (daysInMonth: number) => {
    const doc: {[key: string]: []} = {}

    for(let i=1; i<=daysInMonth; i++) {
        doc[i.toString()] = []
    }

    return doc
}

export const setTask = createAsyncThunk(
    'task/setTask',
    async (uid: string, thunkAPI) => {        
        const lastMonth = today.subtract(1, 'month')
        const nextMonth = today.add(1, 'month')

        const thisMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${today.format('YYYY-MM')}`)
        const lastMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${lastMonth.format('YYYY-MM')}`)
        const nextMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${nextMonth.format('YYYY-MM')}`)

        const thisMonthDoc = await getDoc(thisMonthDocRef)
        const lastMonthDoc = await getDoc(lastMonthDocRef)
        const nextMonthDoc = await getDoc(nextMonthDocRef)

        let thisMonthTask = thisMonthDoc.data()
        let lastMonthTask = lastMonthDoc.data()
        let nextMonthTask = nextMonthDoc.data()

        if(!thisMonthTask) {
            thisMonthTask = createMonthlyTask(today.daysInMonth())
            await setDoc(thisMonthDocRef, thisMonthTask)
        }

        if(!lastMonthTask) {
            lastMonthTask = createMonthlyTask(lastMonth.daysInMonth())
            await setDoc(lastMonthDocRef, lastMonthTask)
        }

        if(!nextMonthTask) {
            nextMonthTask = createMonthlyTask(nextMonth.daysInMonth())
            await setDoc(nextMonthDocRef, nextMonthTask)
        }

        return {
            thisMonthTask,
            lastMonthTask, 
            nextMonthTask
        }
    }
)

function monthlyTaskToCalenderDictionary(taskDoc: MonthlyTask.__DOC__MONTHLY_TASK, daysInMonth: number) {
    const taskDocKeys = Object.keys(taskDoc).filter(key => key!=="counter")
    const calender: Calender = {}
    for(let i=1; i<=daysInMonth; i++) {
        calender[i.toString()] = []
    }

    taskDocKeys.forEach(taskName => {
        const daily_management = (taskDoc[taskName] as MonthlyTask.SingleTask).daily_management
        const daily_management_keys = Object.keys(daily_management)
        daily_management_keys.forEach(day => {
            calender[day].push(daily_management[day])
        })
    })

    return calender
}

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        updateTask: (state, action) => {
            switch(action.payload.month) {
                case 'this_month': 
                    state.this_month = action.payload.data
                    state.calenders[action.payload.docId] = monthlyTaskToCalenderDictionary(action.payload.data, today.daysInMonth())
                    break
                case 'next_month':
                    state.next_month = action.payload.data
                    state.calenders[action.payload.docId] = monthlyTaskToCalenderDictionary(action.payload.data, next_month.daysInMonth())
                    break
                case 'last_month':
                    state.last_month = action.payload.data
                    state.calenders[action.payload.docId] = monthlyTaskToCalenderDictionary(action.payload.data, last_month.daysInMonth())
                    break
                default:
                    console.log(action.payload)
            }
            state.monthly_task_docs[action.payload.docId] = action.payload.data
        },
        setDesignatedTask: (state, action) => {
            state.designated_task = action.payload
        }
    },
    extraReducers: (builder) => {
        
    }
})

export const {updateTask, setDesignatedTask} = taskSlice.actions

export const selectTask = (state: RootState) => state.task

export default taskSlice.reducer