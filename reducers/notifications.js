import {
  RECEIVE_LOCAL_NOTIFICATIONS,
  ADD_LOCAL_NOTIFICATION,
  REMOVE_LOCAL_NOTIFICATION
} from '../actions/notifications';

export default function localNotifications (state = {}, action) {
  switch (action.type) {
    case RECEIVE_LOCAL_NOTIFICATIONS :
      return {
        ...state,
        ...action.localNotifications
      };
    case ADD_LOCAL_NOTIFICATION :
      return {
        ...state,
        [action.id]: true
      };
    case REMOVE_LOCAL_NOTIFICATION :
      return {
        ...state,
        [action.id]: false
      };
    default :
      return state;
  }
};
