import {ContentContext, Item} from './LibraryContext'
import {useContext, useState, useEffect} from 'react'

interface SingleContentProps {
    item: Item
}

function SingleContent(props: SingleContentProps) {
    const [timecount, setTimecount] = useState(props.item.time)
    const [init, setInit] = useState(true)
    const [intervalTimeout, setIntervalTimeout] = useState<NodeJS.Timeout | null>(null)

    const ContentContextValue = useContext(ContentContext)

    useEffect(() => {
        console.log(init)
        if(!init) {
            return;
        }

        const timeout = setInterval(() => {
            setTimecount(prev => prev - 1)
        }, 1000)

        setIntervalTimeout(timeout)

        return () => {
            // console.log('cleanup', props.item)
            clearInterval(timeout)
            
        }
    }, [init])

    useEffect(() => {
        if(timecount === 0) {
            console.log('timecount timeout')
            setInit(false)
            clearInterval(intervalTimeout as NodeJS.Timeout)
            ContentContextValue.deleteItem(props.item.id)
        }

    }, [timecount])

    return (
        <div>
            {timecount}
        </div>
    )
}

export default function LibraryContent() {
    const ContentContextValue = useContext(ContentContext)
    console.log(ContentContextValue.items)

    return(
        <>
        {
            ContentContextValue.items.map((item) => (
                <SingleContent key={item.id} item={item} />
            ))
        }
        </>
    )
}