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
    initHostOf: boolean;
}

interface StudyGroup {
    enter_at: number;
    last_read: string;
    title: string;

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

    hostOf: [],
    initHostOf: false
}

export const initStudyGroup = createAsyncThunk(
    'studyGroup/initStudyGroup',
    async (uid: string) => {
        const myStudyGroupColRef = collection(firestore, 'user', uid, 'my_study_group')
        const myStudyGroupCol = await getDocs(myStudyGroupColRef)
        const myStudyGroupDocs = myStudyGroupCol.docs.map(doc => {return {gid: doc.id, ...doc.data()}}) as unknown as Array<StudyGroup>
        return myStudyGroupDocs
    }
)

export const initHostOf = createAsyncThunk(
    'studyGroup/initHostOf',
    async (param: {myUid: string, gids: Array<string>}) => {
        const studyGroupDocRefs = param.gids.map(gid => doc(firestore, 'study_group', gid))
        const studyGroupDocsPromise = studyGroupDocRefs.map(ref => getDoc(ref).then(doc => doc.data()))
        
        const studyGroupDocs = await Promise.all(studyGroupDocsPromise)
        const filteredStudyGroupDocs = studyGroupDocs.filter(doc => doc?.host === param.myUid)
        
        return filteredStudyGroupDocs.map(doc => doc?.gid)
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

        }
    },
    extraReducers: (builder) => {
        builder.addCase(initStudyGroup.fulfilled, (state, action) => {
            state.groups = action.payload
            state.groups.forEach(group => {
                state.chats[group.gid] = []
            })
            state.initGroups = true
        })

        builder.addCase(initHostOf.fulfilled, (state, action) => {
            state.hostOf = action.payload
            state.initHostOf = true
        })
    }
})

export const {addStudyGroup, pushChat, unshiftChat} = studyGroupSlice.actions

export const selectStudyGroup = (state: RootState) => state.studyGroup

export default studyGroupSlice.reducer