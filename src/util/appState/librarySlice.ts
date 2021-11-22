import {RootState} from './Store'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

interface RecordData {
    
}

interface LiveData {
    
}

interface LibraryState {
    record: Array<RecordData>;
    live: Array<LiveData>;
}

const initialState: LibraryState = {
    record: [],
    live: []
}

export const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {

    }
})

export const selectLibrary = (state: RootState) => state.library

export default librarySlice.reducer