import moment from 'moment'

export function calendar(page, type = 'weeks', no_of_day_week = 6) {
  let date = moment()
  if (type === 'month') {
    let startDate = moment().add(page, 'months').startOf('month')
    let endDate = moment(startDate).endOf('month')
    let weeks = [weekDates(startDate)]
    while (startDate.add(7, 'days').diff(endDate) < 8) {
      weeks.push(weekDates(startDate))
    }
    return weeks
  } else if (type === 'monthInDays') {
    let startDate = moment().add(page, 'months').startOf('month')
    let endDate = moment(startDate).endOf('month')
    let days = [startDate.clone()]
    while (startDate.add(1, 'days').diff(endDate) < 1) {
      days.push(startDate.clone())
    }
    return days
  } else if (['week', 'weeks'].includes(type)) {
    date.add(page * 7, 'days')
    if (type === 'week') {
      return weekDates(date)
    }
    return [weekDates(date, no_of_day_week)]
  } else {
    if (type === 'days') {
      return [date.add(page * 1, 'days')]
    }
    return date.add(page * 1, 'days')
  }
}

export const weekDates = (currentDate = moment(), no_of_day_week = 6) => {
  let weekStart = currentDate.clone().startOf('isoWeek')
  let days = []
  for (let i = 0; i <= no_of_day_week - 1; i++) {
    days.push(moment(weekStart).add(i, 'days'))
  }
  return days
}
