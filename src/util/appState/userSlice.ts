import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from './Store'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

interface PublicInfo {
    name: string;
    email: string;
    uid: string;
    img: string;
}

interface UserState extends PublicInfo {
    idToken: string;
    friend_list: Array<PublicInfo & { isOnline: boolean }>;
    isLogin: boolean;
    isOnline: boolean;
    friend_request: {
        sent: Array<PublicInfo & {tp: number}>;
        received: Array<PublicInfo & {tp: number}>
    }
}

const initialState: UserState = {
    email: '',
    img: '',
    idToken: '',
    uid: '',
    friend_list: [],
    isLogin: false,
    name: '',
    isOnline: false,
    friend_request: {
        sent: [],
        received: []
    }
}

export const submitLoginInfo = createAsyncThunk(
    'user/submitLoginInfo',
    async (info:{email: string, password: string}) => {
        const auth = firebase.auth()
        const userCredential = await auth.signInWithEmailAndPassword(info.email, info.password)
        return userCredential.user?.uid
    }
)

export const getUserDoc = createAsyncThunk(
    'user/getUserDoc',
    async (uid: string) => {
        const firestore = firebase.firestore()
        const userDocRef = firestore.collection("user").doc(uid)
        
        const userDoc = await userDocRef.get()

        const userDocData = <firebase.firestore.DocumentData>userDoc.data()
        
        const friendRequestDocRef = firestore.collection("user").doc(uid).collection("public").doc("friend_request")
        const friendRequestDoc = await friendRequestDocRef.get()
        const friendRequestDocData = <firebase.firestore.DocumentData>friendRequestDoc.data()
        console.log(friendRequestDocData)

        const candidateInfoDocRefs: Array<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> = [...friendRequestDocData["sent"], ...friendRequestDocData["received"]].map((user: {uid: string, tp: number}) => firestore.collection("user").doc(user.uid).collection("public").doc("info"))
        console.log(candidateInfoDocRefs)
        const candidateInfoDocsData = await Promise.all(candidateInfoDocRefs.map(async (ref) => ref.get().then(doc => doc.data())))
        console.log(candidateInfoDocsData)

        const friendsInfoDocRefs: Array<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> = userDocData['friend_list'].map((uid: string) => firestore.collection("user").doc(uid).collection("public").doc("info"))
        const friendsInfoDocsData = await Promise.all(friendsInfoDocRefs.map(async (ref) => ref.get().then(doc => doc.data())))


        return {
            userData: userDocData,
            friendsInfoData: friendsInfoDocsData,
            friendRequestDocData,
            candidateInfoDocsData
        }
    }
)

export const getIdToken = createAsyncThunk(
    'user/getIdToken',
    async () => {
        const auth = firebase.auth()
        return await auth.currentUser?.getIdToken()
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async() => {
        const auth = firebase.auth()
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
            state.friend_list = action.payload
        },
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        },
        setIsOnline: (state, action) => {
            state.isOnline = action.payload
        },
        friendOnline: (state, action) => {
            const uid = action.payload
            const idx = state.friend_list.findIndex(friend => friend.uid === uid)
            console.log(idx, uid)
            state.friend_list[idx].isOnline = true
        },
        friendOffline: (state, action) => {
            const uid = action.payload
            const idx = state.friend_list.findIndex(friend => friend.uid === uid)
            console.log(uid, idx)
            state.friend_list[idx].isOnline = false
        }
    },

    extraReducers: (builder) => {
        builder.addCase(submitLoginInfo.fulfilled, (state, action) => {
            state.uid = <string>action.payload
            state.isLogin = true
        })

        builder.addCase(getUserDoc.fulfilled, (state, action) => {
            const friendsInfo = <Array<firebase.firestore.DocumentData>>action.payload.friendsInfoData
            state.friend_list = action.payload.userData["friend_list"].map((uid: string): PublicInfo & {isOnline: boolean} => {
                const friend = friendsInfo.find(val => val.uid === uid)
                return { uid, isOnline: false, name: friend?.name, email: friend?.email, img: friend?.img } 
            })

            state.friend_request.sent = action.payload.friendRequestDocData["sent"].map((user: { uid: string, tp: number}) => {
                const candidate = action.payload.candidateInfoDocsData.find(doc => doc?.uid === user.uid)
                console.log('sent candidate', candidate)
                return {
                    uid: user.uid, tp: user.tp, email: candidate?.email, img: candidate?.img, name: candidate?.name
                }
            })

            state.friend_request.received = action.payload.friendRequestDocData["received"].map((user: {uid: string, tp: number}) => {
                const candidate = action.payload.candidateInfoDocsData.find(doc => {
                    console.log(doc?.uid, user.uid, doc?.uid === user.uid)
                    return doc?.uid === user.uid
                })
                console.log('received candidate', candidate)
                return {
                    uid: user.uid, tp: user.tp, email: candidate?.email, img: candidate?.img, name: candidate?.name
                }
            })
            
            state.name = action.payload.userData?.["name"]
            state.email = action.payload.userData?.["email"]
            state.img = action.payload.userData?.["img"]
        })

        builder.addCase(getIdToken.fulfilled, (state, action) => {
            state.idToken = <string>action.payload
        })

        builder.addCase(logout.fulfilled, (state) => {
            state.idToken = ''
            state.isLogin = false
            state.friend_list = []
            state.uid = ''
            state.name = ""
            state.isOnline = false
        })
    }
})

export const {setUid, setIdToken, setFriendList, setIsLogin, setIsOnline, friendOnline, friendOffline} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer