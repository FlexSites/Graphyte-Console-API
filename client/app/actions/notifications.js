import { createAction } from 'redux-actions'

import {
  PUSH_NOTIFICATION,
  POP_NOTIFICATION,
} from '../constants'


export const pushNotification = createAction(PUSH_NOTIFICATION)
export const popNotification = createAction(POP_NOTIFICATION)
