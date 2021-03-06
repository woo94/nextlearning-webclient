import React, { useContext } from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from 'src/util/appState/hooks'
import {selectUser, requestIdToken, setMyinfo} from 'src/util/appState/userSlice'
import {setFriendRequest, setFriendList} from 'src/util/appState/friendSlice'
import {selectFriend} from 'src/util/appState/friendSlice'
import {setTask, selectTask, updateTask, setDesignatedTask} from 'src/util/appState/taskSlice'
import {selectStudyGroup, setStudyGroup, updateLastReads} from 'src/util/appState/studyGroupSlice'
import {Container} from '@mui/material'
import {doc, onSnapshot, getDoc, getFirestore} from 'firebase/firestore'
import { Route, Switch } from 'react-router-dom'
import { Home, Community, Profile, Library } from './Tab'
import { SocketContext } from '../socket/context'
import {Category, User} from 'src/util/types'
import MonthlyPlan from 'src/component/Tab/Home/MonthlyPlan'
import {getAuth} from 'firebase/auth'

const firestore = getFirestore()
const auth = getAuth()

// read user document and dispatch to user/friend/studyGroup slices
// use asyncthunk to read friend's public info 
// use asyncthunk to read study_group's info
function Main() {
    const user = useAppSelector(selectUser)
    const friend = useAppSelector(selectFriend)
    const studyGroup = useAppSelector(selectStudyGroup)
    const task = useAppSelector(selectTask)
    const dispatch = useAppDispatch()

    useEffect(() => {
        async function run() {
            const userDoc = await readUserDoc()
            
            // dispatch to userSlice to name, img, later on maybe the membership and points too
            dispatch(setMyinfo({
                email: userDoc['email'],
                img: userDoc['img'],
                name: userDoc['name'],
                grade: userDoc['grade']
            }))

            // dispatch friend_list array to friendSlice, it will handle async task to fill all the friend's public information
            dispatch(setFriendList(userDoc.friend_list))

            // dispatch study_group_list array to studyGroupSlice, it will handle async task to fill all the study group's information
            dispatch(setStudyGroup(userDoc.study_group_list))

            // dispatch monthly_task docs to taskSlice
            
            // this_month
            onSnapshot(doc(firestore, 'user', user.uid, 'monthly_task', `${task.dates.today.year}-${task.dates.today.monthIntStr}`), (doc) => {
                dispatch(updateTask({
                    month: "this_month",
                    docId: doc.id,
                    data: doc.data()
                }))
            })

            // next_month
            onSnapshot(doc(firestore, 'user', user.uid, 'monthly_task', `${task.dates.next_month.year}-${task.dates.next_month.monthIntStr}`), (doc) => {
                dispatch(updateTask({
                    month: 'next_month',
                    docId: doc.id,
                    data: doc.data()
                }))
            })

            // last_month
            const lastMonthPlan = await getDoc(doc(firestore, 'user', user.uid, 'monthly_task', `${task.dates.last_month.year}-${task.dates.last_month.monthIntStr}`))
            dispatch(updateTask({
                month: 'last_month',
                docId: lastMonthPlan.id,
                data: lastMonthPlan.data()
            }))
        }

        async function readUserDoc() {
            const userDoc = await getDoc(doc(firestore, 'user', user.uid))
            const userDocData = userDoc.data() as User.__DOC__USER

            return userDocData
        }

        run()
    }, [])

    useEffect(() => {
        if(user.grade === "") {
            return
        }
        
        getDoc(doc(firestore, 'category', user.grade)).then(doc => {
            const data = doc.data() as Category.__DOC__CATEGORY
            dispatch(setDesignatedTask(data))
        })
    },[user.grade])

    useEffect(() => {
        if(!studyGroup.initStudyGroup) {
            return
        }

        const unsubMyStudyGroup = onSnapshot(doc(firestore, 'user', user.uid, 'private', 'my_study_group'), (doc) => {
            const data = doc.data() as User.__DOC__PRIVATE_MY_STUDY_GROUP
            dispatch(updateLastReads(data))
        })

        return () => {
            unsubMyStudyGroup()
        }
    },[studyGroup.initStudyGroup])

    useEffect(() => {
        if(user.idToken === "") {
            dispatch(requestIdToken())
        }
    }, [user.idToken])

    const {isSocketAvailable, socket} = useContext(SocketContext)

    useEffect(() => {
        if(!isSocketAvailable || !friend.initFriendList) {
            return
        }

        if(friend.friend_list.length > 0) {
            socket.emit("creq.init-friend_list", JSON.stringify({data: friend.friend_list.map(friend => friend.uid)}))
        }
        
        return () => {
            console.log(`close socket ${socket.id}`)
            socket.close()
        }
    },[isSocketAvailable, friend.initFriendList])

    return (
        <Container>
            <Switch>
                <Route path='/home'>
                    <Home />
                </Route>
                <Route path='/library'>
                    <Library />
                </Route>
                <Route path='/community'>
                    <Community />
                </Route>
                <Route path='/profile'>
                    <Profile />
                </Route>
                <Route path="/monthly-plan">
                    <MonthlyPlan />
                </Route>
            </Switch>
        </Container>
    )
}

export default Main