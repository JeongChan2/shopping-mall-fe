import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 성공
      // LoginPage

      return response.data;
    } catch (error) {
      // 실패시 생긴 에러값은 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공
      // 성공 토스트 메시지 show
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      // 로그인 페이지로 리다이렉트
      navigate("/login");

      return response.data.data;
    } catch (error) {
      // 실패
      // 실패 토스트 메시지 show
      dispatch(
        showToastMessage({
          message: "회원가입을 실패 했습니다.",
          status: "error",
        })
      );
      // error값을 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(loginWithEmail.fulfilled, (state,action) => {
        state.loading = false
        state.user = action.payload.user
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state,action) => {
        state.loading = false
        state.loginError = action.payload
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
