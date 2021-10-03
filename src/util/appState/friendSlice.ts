import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { RootState } from './Store'
import { PublicInfo } from './commonTypes'

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

export const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        setFriendList: (state, action) => {
            state.friend_list = action.payload
            state.initFriendList = true
        },
        setFriendRequest: (state, action) => {
            state.friend_request = action.payload
            state.initFriendList = true
        },
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
    }
})

export const {setFriendList, setFriendRequest, friendOnline, friendOffline} = friendSlice.actions

export const selectFriend = (state: RootState) => state.friend

export default friendSlice.reducer