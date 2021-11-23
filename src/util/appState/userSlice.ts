import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from './Store'
import {getAuth, signInWithEmailAndPassword, signOut, getIdToken} from 'firebase/auth'
import 'firebase/firestore'
import { PublicInfo } from './commonTypes'

const auth = getAuth()

export interface Friend extends PublicInfo {
    online: boolean;
}

interface UserState {
    img: string;
    idToken: string;
    name: string;
    grade: string;
    uid: string;
}

const initialState: UserState = {
    img: '',
    idToken: '',
    name: '',
    grade: '',
    uid: ''
}



export const requestIdToken = createAsyncThunk(
    'user/getIdToken',
    async () => {
        const currentUser = auth.currentUser
        if(!currentUser) {
            return ''
        }
        return await getIdToken(currentUser)
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async() => {
        await auth.signOut()
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setMyinfo: (state, action) => {
            state.img = action.payload.img
            state.name = action.payload.name
            state.grade = action.payload.grade
            state.idToken = action.payload.idToken
            state.uid = action.payload.uid
        }
    },

    extraReducers: (builder) => {
        builder.addCase(requestIdToken.fulfilled, (state, action) => {
            state.idToken = <string>action.payload
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.idToken = ''
            state.name = ""
        })
    }
})

export const { setMyinfo } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer