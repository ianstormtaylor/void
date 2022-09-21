import useSwr from 'swr'

/** Use the current window. */
export let useWindow = () => {
  let { data, error } = useSwr('', electron.getWindow)
  return {}
}
