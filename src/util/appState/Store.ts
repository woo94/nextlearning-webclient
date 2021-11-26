import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice'
import friendSlice from './friendSlice'
import studyGroupSlice from './studyGroupSlice'
import fileUploadSlice from './fileUploadSlice'
import taskSlice from './taskSlice'
import librarySlice from './librarySlice'
import plannerSlice from './plannerSlice'
import dailyTaskSlice from './dailyTaskSlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        friend: friendSlice,
        studyGroup: studyGroupSlice,
        fileUpload: fileUploadSlice,
        task: taskSlice,
        library: librarySlice,
        planner: plannerSlice,
        dailyTask: dailyTaskSlice
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch