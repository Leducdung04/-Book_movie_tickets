import { createAsyncThunk } from '@reduxjs/toolkit';
import { addNotification, addTodo } from '../reducers/todoReducers';
import { Uri_get_list_movide ,Ipv4} from '../../api';


export const fetchTodos = () => {
 return async dispatch => {
   try {
     const response = await fetch(Uri_get_list_movide);
     const data = await response.json();
     data.data.forEach(row => {
       dispatch(addTodo( row));
     });
   } catch (error) {
     console.error('Error fetching todos:', error);
   }
 };
};

export const fetchNotification = () => {
  return async dispatch => {
    try {
      const response = await fetch(`http://${Ipv4}:3000/api/get-list-notifications-by-user/663b1b0095121af8cf26fe17`);
      const data = await response.json();
      data.data.forEach(row => {
        dispatch(addNotification( row));
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
 };


 export const updateNotification = createAsyncThunk(
  'todo/updateNotification',
  async (objUpdate, thunkAPI) => {
    try {
      const response = await fetch(`http://${Ipv4}:3000/api/update-notification-new/${objUpdate._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objUpdate.data),
      });

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);


