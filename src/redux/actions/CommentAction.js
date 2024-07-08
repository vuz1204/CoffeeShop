import { createAsyncThunk } from '@reduxjs/toolkit';
import { addComment } from '../reducers/commentReducer';
import apiUrl from '../../../database/api';

const comment_url = `${apiUrl}/comments`
export const fetchComments = () => {
    return async dispatch => {
        try {
            const response = await fetch(comment_url);
            const data = await response.json();
            data.forEach(row => {
                dispatch(addComment(row));
            });
        } catch (error) {
            console.error("Error fetching comment:", error);
        }
    };
};

export const addCommentAPI = createAsyncThunk(
    'comments/addCommentAPI',
    async (objComment, thunkAPI) => {
        console.log(objComment);
        try {
            const response = await fetch(comment_url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objComment),
            });
            const data = await response.json();
            // console.log(response);
            // Kiểm tra nếu status code là 200 hoặc 204 thì xóa thành công
            if (response.ok) {
                // console.log(response);
                // Sau khi thêm thành công, trả về dữ liệu server trả về để cập nhật store

                return data;
            } else {
                // Nếu có lỗi từ phía server, trả về lỗi
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData);
            }
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);
