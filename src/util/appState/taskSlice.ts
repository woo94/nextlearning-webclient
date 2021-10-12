import {RootState} from './Store'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const firestore = getFirestore()

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault(dayjs.tz.guess())

const dayjsObj = dayjs()

interface TaskState {
    last_month: MonthlyTask;
    this_month: MonthlyTask;
    next_month: MonthlyTask;
    date: {
        year: string;
        monthIntStr: string;
        monthFullStr: string;
        day: string;
    };
    initTask: boolean;
}

const initialState: TaskState = {
    last_month: {},
    this_month: {},
    next_month: {},
    date: {
        year: dayjsObj.format('YYYY'),
        monthIntStr: dayjsObj.format('MM'),
        monthFullStr: dayjsObj.format('MMMM'),
        day: dayjsObj.format('DD')
    },
    initTask: false
}

interface MonthlyTask {
    [key: string]: DailyTask
}

interface DailyTask {
    category: string;
    date: number;
    fulfilled: number;
    min: number;
    name: string;
    step: "define" | "ongoing" | "finish" | "done";
}

const createMonthlyTask = (daysInMonth: number) => {
    const doc: {[key: string]: []} = {}

    for(let i=1; i<=daysInMonth; i++) {
        doc[i.toString()] = []
    }

    return doc
}

export const setTask = createAsyncThunk(
    'task/setTask',
    async (uid: string) => {
        const lastMonth = dayjsObj.subtract(1, 'month')
        const nextMonth = dayjsObj.add(1, 'month')

        const thisMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${dayjsObj.format('YYYY-MM')}`)
        const lastMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${lastMonth.format('YYYY-MM')}`)
        const nextMonthDocRef = doc(firestore, 'user', uid, 'monthly_task', `${nextMonth.format('YYYY-MM')}`)

        const thisMonthDoc = await getDoc(thisMonthDocRef)
        const lastMonthDoc = await getDoc(lastMonthDocRef)
        const nextMonthDoc = await getDoc(nextMonthDocRef)

        let thisMonthTask = thisMonthDoc.data()
        let lastMonthTask = lastMonthDoc.data()
        let nextMonthTask = nextMonthDoc.data()

        if(!thisMonthTask) {
            thisMonthTask = createMonthlyTask(dayjsObj.daysInMonth())
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

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(setTask.fulfilled, (state, action) => {
            state.this_month = action.payload.thisMonthTask
            state.last_month = action.payload.lastMonthTask
            state.next_month = action.payload.nextMonthTask

            state.initTask = true
        })
    }
})

export const {} = taskSlice.actions

export const selectTask = (state: RootState) => state.task

export default taskSlice.reducer