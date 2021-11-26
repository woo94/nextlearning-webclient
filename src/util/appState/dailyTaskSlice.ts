import {__DOC__DAILY_TASK} from 'src/util/types/firestore_daily_task'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import {RootState} from './Store'
import {createSlice} from '@reduxjs/toolkit'
import {thisMonth, nextMonth, lastMonth} from 'src/util/dateInfo'


export const dailyTaskSlice = createSlice({
    name: 'dailyTask',
    initialState: {},
    reducers: {
        plannerAdded: (state, action) => {

        }
    }
})

export const {} = dailyTaskSlice.actions

export const selectDailyManagement = (state: RootState) => state.dailyTask

export default dailyTaskSlice.reducer