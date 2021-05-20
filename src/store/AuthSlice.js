import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";
import * as dbActions from "./DBSlice";

const initialState = {
  authDetails: { userId: null, userName: null, emailId: null },
  error: null,
  status: "idle",
};

export const getUser = (state) => state.auth;

export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async (props) => {
    // console.log("dispatched");
    // console.log(props.authType);
    // console.log(props.email);
    // console.log(props.password);
    let response;

    if (props.authType === "signIn") {
      response = firebase
        .app("Zorrito-restro")
        .auth()
        .signInWithEmailAndPassword(props.email, props.password);
      console.log("response", response);
    } else if (props.authType === "signUp") {
      response = firebase
        .app("Zorrito-restro")
        .auth()
        .createUserWithEmailAndPassword(props.email, props.password);
    }

    return response.then((res) => ({
      userId: res.user.uid,
      email: res.user.email,
    }));

    //console.log("apps", firebase.apps);
  }
);

export const Logout = () => async (dispatch) => {
  firebase
    .app("Zorrito-restro")
    .auth()
    .signOut()
    .then((res) => {
      dispatch(logout());
      dispatch(dbActions.dbLogout());
    })
    .catch((err) => {
      alert(`Something went wrong!"\n"Please check your Internet Connection.`);
      console.log(err);
    });
};

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
      console.log(action);
      state.authDetails.userId = action.payload.userId;
      state.authDetails.emailId = action.payload.email;
    },
    [authenticate.rejected]: (state, action) => {
      console.log(action);
      state.status = "failed";
      state.error = action.error.code;
    },
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
