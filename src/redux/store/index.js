import { configureStore } from "@reduxjs/toolkit";
import Listmovide, { addNotification } from "../reducers/todoReducers";

export default configureStore({
    reducer:{
            listTodo:Listmovide,
            listNotification:addNotification
    }
})