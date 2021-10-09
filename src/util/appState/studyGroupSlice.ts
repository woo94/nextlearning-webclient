import {RootState} from './Store'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getFirestore, doc, getDoc, collection, getDocs} from 'firebase/firestore'

const firestore = getFirestore()

export interface StudyGroupState {
    groups: Array<StudyGroup>;
    initGroups: boolean;

    chats: {
        // key: gid
        [key: string]: Array<Chat>;
    }

    hostOf: Array<string>;
}

interface StudyGroup {
    last_read: string;
    title: string;
    img: string;
    chatFetched: boolean;
    gid: string;
}

interface Chat {
    randomKey: string;

    type: "text" | "image" | "video" | "file" | "url";
    // unix timestamp milliseconds
    tp: number;
    sender: string;
    message: string;
}

const initialState: StudyGroupState = {
    groups: [],
    initGroups: false,

    chats: {},

    hostOf: []
}

export const initStudyGroup = createAsyncThunk(
    'studyGroup/initStudyGroup',
    async (uid: string) => {
        const myStudyGroupColRef = collection(firestore, 'user', uid, 'my_study_group')
        const myStudyGroupCol = await getDocs(myStudyGroupColRef)
        
        const myStudyGroupList = myStudyGroupCol.docs.map(doc => {
            const data = doc.data()
            return {
                last_read: data['last_read'] as string,
                gid: doc.id
            }
        })

        const hostOf: Array<string> = []
        
        const getMyStudyGroupPromise: Array<Promise<StudyGroup>> = myStudyGroupList.map(async ({gid, last_read}) => {
            const studyGroupDocRef = doc(firestore, 'study_group', gid)
            const studyGroupDoc = await getDoc(studyGroupDocRef)
            const data = studyGroupDoc.data()

            if(data?.host === uid) {
                hostOf.push(gid)
            }

            const result: StudyGroup = {
                last_read,
                gid,
                chatFetched: false,
                title: data?.title || "",
                img: data?.img || ""
            }
            return result
        })

        return {
            groups: await Promise.all(getMyStudyGroupPromise),
            hostOf
        }
    }
)

export const studyGroupSlice = createSlice({
    name: "studyGroup",
    initialState,
    reducers: {
        addStudyGroup: (state, action) => {
            state.groups.push(action.payload)
        },
        pushChat: (state, action) => {
            state.chats[action.payload.gid].push(action.payload.data)
        },
        unshiftChat: (state, action) => {

        },
        chatFetched: (state, action) => {
            const group = state.groups.find(group => group.gid === action.payload)
            if(group) {
                group.chatFetched = true
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initStudyGroup.fulfilled, (state, action) => {
            state.groups = action.payload.groups
            state.groups.forEach(group => {
                state.chats[group.gid] = []
            })
            state.hostOf = action.payload.hostOf
            state.initGroups = true
        })
    }
})

export const {addStudyGroup, pushChat, unshiftChat, chatFetched} = studyGroupSlice.actions

export const selectStudyGroup = (state: RootState) => state.studyGroup

export default studyGroupSlice.reducer