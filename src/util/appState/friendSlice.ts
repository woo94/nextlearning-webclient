import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { RootState } from './Store'
import { PublicInfo } from './commonTypes'
import {getDoc, getFirestore, doc} from 'firebase/firestore'

const firestore = getFirestore()

export interface FriendState {
    initFriendList: boolean;
    friend_list: Array<PublicInfo & { online: boolean }>;
    
    initFriendRequest: boolean;
    friend_request: {
        sent: Array<PublicInfo & {tp: number}>;
        received: Array<PublicInfo & {tp: number}>;
    }
}

const initialState: FriendState = {
    initFriendList: false,
    friend_list: [],

    initFriendRequest: false,
    friend_request: {
        sent: [],
        received: []
    }
}

export const setFriendList = createAsyncThunk(
    'friend/setFriendList',
    async (friendList: Array<string>) => {
        const friendsInfoPromise = friendList.map(async uid => {
            const infoDoc = await getDoc(doc(firestore, 'user', uid, 'public', 'info'))
            return infoDoc.data() as PublicInfo
        })

        return Promise.all(friendsInfoPromise)
    }
)

export const setFriendRequest = createAsyncThunk(
    'friend/setFriendRequest',
    async () => {
        
    }
)

export const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        friendOnline: (state, action) => {
            const uid = action.payload
            const idx = state.friend_list.findIndex(friend => friend.uid === uid)
            if(idx !== -1) {
                state.friend_list[idx].online = true
            }
        },
        friendOffline: (state, action) => {
            const uid = action.payload
            const idx = state.friend_list.findIndex(friend => friend.uid === uid)
            if(idx !== -1) {
                state.friend_list[idx].online = false
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setFriendList.fulfilled, (state, action) => {
            state.friend_list = action.payload.map(info => {
                return {
                    ...info,
                    online: false
                }
            })
            state.initFriendList = true
        })
    }
})

export const { friendOnline, friendOffline} = friendSlice.actions

export const selectFriend = (state: RootState) => state.friend

export default friendSlice.reducer