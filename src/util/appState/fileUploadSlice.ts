import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import {RootState} from './Store'
import {v4 as uuidv4} from 'uuid'
import {getFunctions, httpsCallable} from 'firebase/functions'

interface FileUploadState {
    // key: uuid
    // value: state -> uploading / success / fail
    [key: string]: string;
}


const initialState: FileUploadState = {

}

export const uploadStudyGroupFileMessage = createAsyncThunk(
    'fileUpload/uploadStudyGroupFileMessage',
    async (data: { sender: string; fileName: string, fileBlob: Blob, filePath: ReturnType<typeof storageRef> }) => {
        const metadata = {
            customMetadata: {
                sender: data.sender,
                filename: data.fileName
            },
            cacheControl: 'private, max-age=15552000'
        }

        return uploadBytes(data.filePath, data.fileBlob, metadata)
    }
)

export const uploadRecordVideo = createAsyncThunk(
    'fileUpload/uploadRecordVideo',
    async (data: { uploader: string, taskId: string, fileBlob: Blob, filePath: ReturnType<typeof storageRef> }) => {
        const metadata = {
            customMetadata: {
                uploader: data.uploader,
                taskId: data.taskId,
                fileCategory: 'record-result'
            },
        }

        return uploadBytes(data.filePath, data.fileBlob, metadata)
    }
)

export const fileUploadSlice = createSlice({
    name: 'fileUpload',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(uploadStudyGroupFileMessage.pending, (state, action) => {
            state[action.meta.arg.fileName] = 'uploading'
        })

        builder.addCase(uploadStudyGroupFileMessage.fulfilled, (state, action) => {
            state[action.meta.arg.fileName] = 'success'
        })

        builder.addCase(uploadStudyGroupFileMessage.rejected, (state, action) => {
            state[action.meta.arg.fileName] = "fail"
        })
    }
})

export const selectFileUpload = (state: RootState) => state.fileUpload

export default fileUploadSlice.reducer