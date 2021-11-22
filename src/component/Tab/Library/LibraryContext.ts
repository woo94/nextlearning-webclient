import {createContext} from 'react'

export interface Item {
    id: number;
    time: number;
}

export const ContentContext = createContext<{items: Array<Item>, deleteItem: (id: number) => void}>({items: [], deleteItem: (id: number) => {}})