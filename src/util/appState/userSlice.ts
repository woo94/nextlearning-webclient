import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from './Store'
import {getAuth, signInWithEmailAndPassword, signOut, getIdToken} from 'firebase/auth'
import 'firebase/firestore'
import { PublicInfo } from './commonTypes'

const auth = getAuth()

export interface Friend extends PublicInfo {
    online: boolean;
}

export interface UserState extends PublicInfo {
    idToken: string;
    isLogin: boolean;
}

const initialState: UserState = {
    email: '',
    img: '',
    idToken: '',
    uid: '',
    isLogin: false,
    name: '',
}

export const submitLoginInfo = createAsyncThunk(
    'user/submitLoginInfo',
    async (info:{email: string, password: string}) => {
        const userCredential = await signInWithEmailAndPassword(auth, info.email, info.password)
        return userCredential.user?.uid
    }
)

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
        setUid: (state, action) => {
            state.uid = action.payload
        },
        setIdToken: (state, action) => {
            state.idToken = action.payload
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        },
        setMyinfo: (state, action) => {
            state.email = action.payload.email
            state.img = action.payload.img
            state.name = action.payload.name
        }
    },

    extraReducers: (builder) => {
        builder.addCase(submitLoginInfo.fulfilled, (state, action) => {
            state.uid = <string>action.payload
            state.isLogin = true
        })

        builder.addCase(requestIdToken.fulfilled, (state, action) => {
            state.idToken = <string>action.payload
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.idToken = ''
            state.isLogin = false
            state.uid = ''
            state.name = ""
        })
    }
})

export const { setUid, setIdToken, setIsLogin, setMyinfo } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer