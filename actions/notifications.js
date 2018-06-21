import { Permissions } from 'expo';
import { deleteLocalNotification, saveLocalNotification } from '../utils/api';

export const ADD_LOCAL_NOTIFICATION = 'ADD_LOCAL_NOTIFICATION';
export const REMOVE_LOCAL_NOTIFICATION = 'REMOVE_LOCAL_NOTIFICATION';
export const RECEIVE_LOCAL_NOTIFICATIONS = 'RECEIVE_LOCAL_NOTIFICATIONS';

export function receiveLocalNotifications(localNotifications) {
  return {
    type: RECEIVE_LOCAL_NOTIFICATIONS,
    localNotifications
  };
};

function addLocalNotification(id) {
  return {
    type: ADD_LOCAL_NOTIFICATION,
    id
  };
};

function removeLocalNotification(id) {
  return {
    type: REMOVE_LOCAL_NOTIFICATION,
    id
  };
};

export function handleAddLocalNotification() {
  return (dispatch) => {
    return Permissions.askAsync(Permissions.NOTIFICATIONS)
      .then(({ status }) => {
        if (status === 'granted') {
          // Save notification to device storage.
          return saveLocalNotification()
          .then((id) => dispatch(addLocalNotification(id)))
          .catch((e) => {
            console.log('Error while adding notification.');
          });
        }
      });
  };
}

export function handleRemoveLocalNotification(id) {
  return (dispatch) => {
    // Remove notification from device storage.
    return deleteLocalNotification(id)
      .then(() => dispatch(removeLocalNotification(id)))
      .catch((e) => {
        console.log('Error while deleting notification.');
      });
  };
}