import {__DOC__DAILY_TASK} from 'src/util/types/firestore_daily_task'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import {RootState} from './Store'
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit'
import {thisMonth, nextMonth, lastMonth} from 'src/util/dateInfo'

const dailyTaskAdapter = createEntityAdapter<__DOC__DAILY_TASK>({
    selectId: (dailyTask) => `${dailyTask.year_month}-${dailyTask.date}-${dailyTask.planner_id}`
})

export const dailyTaskSlice = createSlice({
    name: 'dailyTask',
    initialState: dailyTaskAdapter.getInitialState(),
    reducers: {
        upsertOneTask: dailyTaskAdapter.upsertOne
    }
})

export const {upsertOneTask} = dailyTaskSlice.actions

export const selectDailyTask = (state: RootState) => state.dailyTask

export const dailyTaskSelectors = dailyTaskAdapter.getSelectors()

export default dailyTaskSlice.reducer