
import {useState} from 'react'
import _ from 'lodash'
import LibraryContent from './LibraryContent'
import {ContentContext, Item} from './LibraryContext'

const itemData: Array<Item> = [
    {id: 1, time: 10},
    {id: 2, time: 5},
    {id: 3, time: 15}
]

export default function LCContainer() {
    const [items, setItems] = useState(itemData)
    const deleteItem = (id: number) => {
        const _contents = _.cloneDeep(items).filter(val => val.id !== id)
        setItems(_contents)
    }

    return (
        <ContentContext.Provider value={{items, deleteItem}}>
            <LibraryContent />
        </ContentContext.Provider>
    )
}