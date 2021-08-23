import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from './Store'
import app from '../../firebase'

interface UserState {
    idToken: string;
    uid: string;
    friendList: Array<{uid: string, name: string, isOnline: boolean}>;
    isLogin: boolean;
    name: string;
    isOnline: boolean;
}

const initialState: UserState = {
    idToken: '',
    uid: '',
    friendList: [],
    isLogin: false,
    name: '',
    isOnline: false,
}

export const submitLoginInfo = createAsyncThunk(
    'user/submitLoginInfo',
    async (info:{email: string, password: string}) => {
        const auth = app.auth()
        const userCredential = await auth.signInWithEmailAndPassword(info.email, info.password)
        return userCredential.user?.uid
    }
)

export const getUserDoc = createAsyncThunk<firebase.default.firestore.DocumentData, string, {}>(
    'user/getUserDoc',
    async (uid: string) => {
        const firestore = app.firestore()
        const userDocRef = firestore.collection("user").doc(uid)
        const userDoc = await userDocRef.get()
        // console.log(userDoc)
        return userDoc.data()
    }
)

export const getIdToken = createAsyncThunk(
    'user/getIdToken',
    async () => {
        const auth = app.auth()
        return await auth.currentUser?.getIdToken()
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async() => {
        const auth = app.auth()
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
        setFriendList: (state, action) => {
            state.friendList = action.payload
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        },
        setIsOnline: (state, action) => {
            state.isOnline = action.payload
        },
        friendOnline: (state, action) => {
            const uid = action.payload
            const idx = state.friendList.findIndex(friend => friend.uid === uid)
            console.log(idx, uid)
            state.friendList[idx].isOnline = true
        },
        friendOffline: (state, action) => {
            const uid = action.payload
            const idx = state.friendList.findIndex(friend => friend.uid === uid)
            console.log(uid, idx)
            state.friendList[idx].isOnline = false
        }
    },

    extraReducers: (builder) => {
        builder.addCase(submitLoginInfo.fulfilled, (state, action) => {
            state.uid = <string>action.payload
            state.isLogin = true
        })

        builder.addCase(getUserDoc.fulfilled, (state, action) => {
            state.friendList = action.payload["friend-list"].map((val: {uid: string, name: string}) => {return {...val, isOnline: false} })
            state.name = action.payload["name"]
        })

        builder.addCase(getIdToken.fulfilled, (state, action) => {
            state.idToken = <string>action.payload
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.idToken = ''
            state.isLogin = false
            state.friendList = []
            state.uid = ''
            state.name = ""
            state.isOnline = false
        })
    }
})

export const {setUid, setIdToken, setFriendList, setIsLogin, setIsOnline, friendOnline, friendOffline} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer