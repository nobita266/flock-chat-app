import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  toastStatus: null,
  toastMessage: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast:(state,action)=>{
        const {status,displayMessage} = action.payload
        state.toastStatus = status;
        state.toastMessage = displayMessage;
    }
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setToast } = toastSlice.actions;
export default toastSlice.reducer;
