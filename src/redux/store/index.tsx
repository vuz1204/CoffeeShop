import { configureStore } from '@reduxjs/toolkit';
import commentReducer from '../reducers/commentReducer';

export interface RootState {
  listComment: {
    listComment: any[]; 
  };
}

export const store = configureStore({
  reducer: {
    listComment: commentReducer,
  },
});
