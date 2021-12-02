import * as Date from 'src/util/dateInfo'
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import { RootState } from './Store'

export const plannerAdapter = createEntityAdapter<__DOC__PLANNER>({
    selectId: (planner) => planner.planner_id,
    sortComparer: (a, b) => a.year_month.localeCompare(b.year_month)
})


export const plannerSlice = createSlice({
    name: 'planner',
    initialState: plannerAdapter.getInitialState(),
    reducers: {
        upsertOnePlanner: plannerAdapter.upsertOne
    }
})

export const {upsertOnePlanner} = plannerSlice.actions

export const selectPlanner = (state: RootState) => state.planner

export const plannerSelectors = plannerAdapter.getSelectors()

export default plannerSlice.reducer