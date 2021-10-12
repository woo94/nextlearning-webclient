import {RootState} from './Store'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {getFirestore, doc, getDoc, collection, getDocs} from 'firebase/firestore'
import {StudyGroup} from 'src/util/types'
import {getDatabase, ref, onChildAdded} from 'firebase/database'

const firestore = getFirestore()
const database = getDatabase()

interface STUDY_GROUP {
    // from study_group document(study_group/${gid})
    gid: string;
    title: string;
    img: string;
    description: string;
    host: string;

    // from my_study_group document(user/${uid}/private/my_study_group)
    last_read: string;

    // 
    badge: boolean;
}

export interface StudyGroupState {
    groups: Array<STUDY_GROUP>;
    initStudyGroup: boolean;
    initLastReads: boolean;
}

const initialState: StudyGroupState = {
    groups: [],
    initStudyGroup: false,
    initLastReads: false
}

export const setStudyGroup = createAsyncThunk(
    'studyGroup/setStudyGroup',
    async (studyGroupList: Array<string>) => {
        const studyGroupInfoPromises = studyGroupList.map(async gid => {
            const infoDoc = await getDoc(doc(firestore, 'study_group', gid))
            return infoDoc.data() as StudyGroup.__DOC__STUDY_GROUP
        })

        return await Promise.all(studyGroupInfoPromises)
    }
)

export const studyGroupSlice = createSlice({
    name: "studyGroup",
    initialState,
    reducers: {
        updateLastReads: (state, action) => {
            state.groups.forEach(group => {
                group.last_read = action.payload[group.gid]['last_read']
            })
        },
        attachBadge: (state, action) => {
            const group = state.groups.find(group => group.gid === action.payload)
            if(!group) {
                return
            }
            group.badge = true
        },
        detachBadge: (state, action) => {
            const group = state.groups.find(group => group.gid === action.payload)
            if(!group) {
                return
            }
            group.badge = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setStudyGroup.fulfilled, (state, action) => {
            state.groups = action.payload.map(({gid, title, img, description, host}) => ({gid, title, img, description, host, last_read: '', badge: false}))
            state.initStudyGroup = true
        })
    }
})

export const {updateLastReads, attachBadge, detachBadge} = studyGroupSlice.actions

export const selectStudyGroup = (state: RootState) => state.studyGroup

export default studyGroupSlice.reducer