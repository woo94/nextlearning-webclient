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
    online: boolean;
}

const initialState: UserState = {
    email: '',
    img: '',
    idToken: '',
    uid: '',
    isLogin: false,
    name: '',
    online: false
}

export const submitLoginInfo = createAsyncThunk(
    'user/submitLoginInfo',
    async (info:{email: string, password: string}) => {
        const userCredential = await signInWithEmailAndPassword(auth, info.email, info.password)
        return userCredential.user?.uid
    }
)

// due to creation of friendSlice, read user doc and dispatch to both slice synchronously
// export const getUserDoc = createAsyncThunk(
//     'user/getUserDoc',
//     async (uid: string) => {
//         const firestore = firebase.firestore()
//         const userDocRef = firestore.collection("user").doc(uid)
        
//         const userDoc = await userDocRef.get()

//         const userDocData = <firebase.firestore.DocumentData>userDoc.data()
        
//         const friendRequestDocRef = firestore.collection("user").doc(uid).collection("public").doc("friend_request")
//         const friendRequestDoc = await friendRequestDocRef.get()
//         const friendRequestDocData = <firebase.firestore.DocumentData>friendRequestDoc.data()
//         console.log(friendRequestDocData)

//         const candidateInfoDocRefs: Array<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> = [...friendRequestDocData["sent"], ...friendRequestDocData["received"]].map((user: {uid: string, tp: number}) => firestore.collection("user").doc(user.uid).collection("public").doc("info"))
//         console.log(candidateInfoDocRefs)
//         const candidateInfoDocsData = await Promise.all(candidateInfoDocRefs.map(async (ref) => ref.get().then(doc => doc.data())))
//         console.log(candidateInfoDocsData)

//         const friendsInfoDocRefs: Array<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> = userDocData['friend_list'].map((uid: string) => firestore.collection("user").doc(uid).collection("public").doc("info"))
//         const friendsInfoDocsData = await Promise.all(friendsInfoDocRefs.map(async (ref) => ref.get().then(doc => doc.data())))

//         return {
//             userData: userDocData,
//             friendsInfoData: friendsInfoDocsData,
//             friendRequestDocData,
//             candidateInfoDocsData
//         }
//     }
// )

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
        setIsOnline: (state, action) => {
            state.online = action.payload
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
            state.online = false
        })
    }
})

export const {setUid, setIdToken, setIsLogin, setIsOnline} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer