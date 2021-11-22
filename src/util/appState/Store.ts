import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice'
import friendSlice from './friendSlice'
import studyGroupSlice from './studyGroupSlice'
import fileUploadSlice from './fileUploadSlice'
import taskSlice from './taskSlice'
import librarySlice from './librarySlice'

const store = configureStore({
    reducer: {
        user: userSlice,
        friend: friendSlice,
        studyGroup: studyGroupSlice,
        fileUpload: fileUploadSlice,
        task: taskSlice,
        library: librarySlice
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch