import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice'
import friendSlice from './friendSlice'
import studyGroupSlice from './studyGroupSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        friend: friendSlice,
        studyGroup: studyGroupSlice
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch