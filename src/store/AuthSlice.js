import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";

const initialState = {
  authDetails: { userId: null, userName: null, emailId: null },
  error: null,
  status: "idle",
};

export const getUser = (state) => state.auth;

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async (props) => {
    console.log("dispatched");
    console.log(props.authType);
    console.log(props.email);
    console.log(props.password);
    let response;
    if (props.authType === "signIn") {
      response = await firebase
        .app("Zorrito-restro")
        .auth()
        .signInWithEmailAndPassword(props.email, props.password);
    } else if (props.authType === "signUp") {
      console.log("hey");
      try {
        response = await firebase
          .app("Zorrito-restro")
          .auth()
          .createUserWithEmailAndPassword(props.email, props.password);
      } catch (error) {
        console.log(error);
      }
    }
    //console.log("apps", firebase.apps);
    console.log(response.user.uid);
    return { userId: response.user.uid, email: response.user.email };
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.authDetails = { userId: null, userName: null, emailId: null };
    },
  },
  extraReducers: {
    [authenticate.pending]: (state, action) => {
      state.status = "loading";
    },
    [authenticate.fulfilled]: (state, action) => {
      state.status = "succeded";
      state.authDetails.userId = action.payload.userId;
      state.authDetails.emailId = action.payload.email;
    },
    [authenticate.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
