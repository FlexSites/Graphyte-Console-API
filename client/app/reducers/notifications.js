import { PUSH_NOTIFICATION } from '../constants'

export default function(state = [], { type, payload }) {
  const reducer = {
    [PUSH_NOTIFICATION]: () => {
      return [ ...state, payload ]
    }
  }[type]

  if (reducer) return reducer()

  return state
}
