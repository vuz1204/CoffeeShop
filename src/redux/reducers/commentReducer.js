import { createSlice } from '@reduxjs/toolkit';
import { addCommentAPI } from '../actions/CommentAction';

const initialState = {
  listComment: [],
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action) {
      state.listComment.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(addCommentAPI.fulfilled, (state, action) => {
        state.listComment.push(action.payload);
    });
  }
});

export const { addComment } = commentsSlice.actions;

export default commentsSlice.reducer;
