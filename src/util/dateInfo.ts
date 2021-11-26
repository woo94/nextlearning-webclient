import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export const today = dayjs()

export const yesterday = dayjs().subtract(1, 'day')

export const tomorrow = dayjs().add(1, 'day')

export const thisMonth = dayjs().startOf('month')

export const lastMonth = dayjs().subtract(1, 'month').startOf('month')

export const nextMonth = dayjs().add(1, 'month').startOf('month')