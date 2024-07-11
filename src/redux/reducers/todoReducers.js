import { createSlice } from "@reduxjs/toolkit";
import { updateNotification } from "../action/todoAction";

//1. khai báo khởi tạo state
const initialState = {
   listMovide: [] ,
   ListNotifications:[]
}
const todoSlice = createSlice({
   name: 'todo',
   initialState,
   reducers: {
       addTodo(state, action) {
         state.listMovide.push(action.payload);
     },
     addNotification(state, action) {
      state.ListNotifications.push(action.payload);
  },
   },
   extraReducers: builder => {
    builder.addCase(updateNotification.fulfilled, (state, action)=>{
  
      console.log(action)
      

      const {_id,title,content,type,neww,id_uer,id_bill} = action.payload;
      // tìm bản ghi phù hợp với tham số truyền vào
      const todo = state.ListNotifications.find(row => row._id === _id);
      // update
      if (todo ) {
          todo.title = title;
          todo.content = content;
          todo.type = type;
          todo.id_uer = id_uer??id_uer; // gán giá trị
          todo.neww=neww;
          todo.id_bill = id_bill??id_bill;
      }
    })
   },
})

export const { addTodo,addNotification } = todoSlice.actions;
export default todoSlice.reducer;