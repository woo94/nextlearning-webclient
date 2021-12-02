import {useEffect, useState} from 'react'

export default function useTimer(startTime: number, endTime: number, isTaskDone: boolean, isPaused: boolean) {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [intervalTimeout, setIntervalTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // endTime === 0 means parent component is fetching data, avoid setting interval
        // isPaused means parent component wants to end interval
        if(endTime === 0 || isPaused || isTaskDone) {
            return
        }

        const timeout = setInterval(() => {
            setElapsedTime(prev => prev + 1)
        }, 1000)

        setIntervalTimeout(timeout)

        return () => {
            clearInterval(timeout)
        }
    }, [startTime, endTime, isTaskDone, isPaused])

    // clear interval when time has done
    useEffect(() => {
        if(endTime * 60 <= elapsedTime + startTime * 60) {
            console.log('endTimer')
            clearInterval(intervalTimeout as NodeJS.Timeout)
        }
    }, [elapsedTime])

    return elapsedTime + startTime * 60
}