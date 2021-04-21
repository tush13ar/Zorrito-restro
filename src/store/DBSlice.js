import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";

export const getDatabaseRef = (refString) =>
  firebase.app("Zorrito-restro").database().ref(refString);

const initialState = {
  restro: {
    name: null,
  },
  userMetaData: {
    data: [],
    error: null,
    status: "idle",
  },
  meals: {
    data: [],
    status: "idle",
  },
  menuItems: {
    data: [],
    status: "idle",
  },
  activeSubList: {
    data: [],
    error: null,
    status: "idle",
  },
  pendingSubList: {
    data: [],
    status: "idle",
  },
  lunchOrders: {
    data: [],
    status: "idle",
  },
  dinnerOrders: {
    data: [],
    status: "idle",
  },
  walletList: {
    data: [],
    status: "idle",
  },
};

export const getDatabase = (state) => state.db;

export const getMeals = () => async (dispatch) => {
  const mealsRef = getDatabaseRef("meals");
  mealsRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let childValue = snapshot.val();
    dispatch(dbSlice.actions.addToMeals({ key, ...childValue }));
  });
};

export const getMenuItems = () => async (dispatch) => {
  const menuRef = getDatabaseRef("menu");

  menuRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let childValue = snapshot.val();
    dispatch(dbSlice.actions.addToMenu({ key, ...childValue }));
  });
};

export const getLunchOrders = () => async (dispatch) => {
  const lunchRef = getDatabaseRef("users/" + "meals/" + "Lunch");

  lunchRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let value = snapshot.val();
    dispatch(dbSlice.actions.addToLunchOrders({ key, ...value }));
  });
};
export const getDinnerOrders = () => async (dispatch) => {
  const dinnerRef = getDatabaseRef("users/" + "meals/" + "Dinner");

  dinnerRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let value = snapshot.val();
    dispatch(dbSlice.actions.addToDinnerOrders({ key, ...value }));
  });
};
export const getWalletList = () => async (dispatch) => {
  const walletRef = getDatabaseRef("users/" + "wallet");

  walletRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let amount = snapshot.val();
    dispatch(dbSlice.actions.addToWalletList({ key, amount }));
  });
};

export const getPendingSubList = createAsyncThunk(
  "db/getPendingSubList",
  async (_, { dispatch }) => {
    let key;
    let value;
    const pendingSubListRef = getDatabaseRef("users/" + "pendingSubscription");
    pendingSubListRef.on("child_added", (snapshot) => {
      key = snapshot.key;
      value = snapshot.val();
      dispatch(dbSlice.actions.addToPendingSubList({ key, ...value }));
      console.log("pending");
    });
    pendingSubListRef.on("child_removed", (snapshot) => {
      dispatch(dbSlice.actions.removeFromPendingSubList({ key: snapshot.key }));
    });
  }
);

export const getActiveSubList = createAsyncThunk(
  "db/getActiveSubList",
  async (_, { dispatch }) => {
    let key;
    let value;
    const activeSubListRef = getDatabaseRef("users/" + "activeSubscription");
    activeSubListRef.on("child_added", (snapshot) => {
      key = snapshot.key;
      value = snapshot.val();
      dispatch(dbSlice.actions.addToActiveSubList({ key, ...value }));
      console.log("active");
    });
  }
);

// export const registerRestro = createAsyncThunk(
//   "db/registerRestro",
//   async ({ name }) => {
//     console.log(name);
//     const restroRef = firebase
//       .app("Zorrito-restro")
//       .database()
//       .ref("restaurants");
//     const newRestroRef = await restroRef.push();
//     newRestroRef.update(
//       {
//         name,
//       },
//       (error) => {
//         if (error) {
//           alert("Something went wrong, Check your Internet connection.");
//           return;
//         }
//       }
//     );
//     return name;
//   }
// );

// export const getRestros = createAsyncThunk("db/getRestros", async () => {
//   console.log("start");
//   let restroArr = [];
//   let userArr = [];
//   //   const restroRef = firebase
//   //     .app("Zorrito-restro")
//   //     .database()
//   //     .ref("restaurants");
//   //   restroRef.on("value", (snapshot) => {
//   //     snapshot.forEach((childSnapshot) => {
//   //       let key = childSnapshot.key;
//   //       let name = childSnapshot.val().name;
//   //       restroArr.push({ key, name });
//   //     });
//   //     console.log("restroArr", restroArr);
//   //   });
//   const userRef = firebase.app("Zorrito-restro").database().ref("users");
//   userRef.on("value", (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       //let key = childSnapshot.key;
//       let userData = childSnapshot.val().userData;
//       userArr.push({ userData });
//     });
//     console.log("restroArr", userArr);
//     //console.log(snapshot.val());
//   });
// });

export const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    appendToMetaData: (state, action) => {
      state.userMetaData.data = action.payload;
    },
    addToActiveSubList: (state, action) => {
      state.activeSubList.status = "succeeded";
      state.activeSubList.data.push(action.payload);
    },
    addToPendingSubList: (state, action) => {
      state.pendingSubList.status = "succeeded";
      state.pendingSubList.data.push(action.payload);
    },
    removeFromPendingSubList: (state, action) => {
      state.pendingSubList.data = state.pendingSubList.data.filter(
        (item) => item.key !== action.payload.key
      );
    },
    addToMeals: (state, action) => {
      (state.meals.status = "succeeded"), state.meals.data.push(action.payload);
    },
    addToMenu: (state, action) => {
      (state.menuItems.status = "succeeded"),
        state.menuItems.data.push(action.payload);
    },
    addToLunchOrders: (state, action) => {
      (state.lunchOrders.status = "succeeded"),
        state.lunchOrders.data.push(action.payload);
    },
    addToDinnerOrders: (state, action) => {
      (state.dinnerOrders.status = "succeeded"),
        state.dinnerOrders.data.push(action.payload);
    },
    addToWalletList: (state, action) => {
      (state.walletList.status = "succeeded"),
        state.walletList.data.push(action.payload);
    },
  },
  extraReducers: {
    // [registerRestro.fulfilled]: (state, action) => {
    //   state.restro.name = action.payload;
    // },
    // [getUsersMetaData.fulfilled]: (state, action) => {
    //   console.log(action.payload);
    //   state.userMetaData.data.push(...action.payload);
    // },

    [getMenuItems.fulfilled]: (state, action) => {
      //console.log(action.payload);
      state.menuItems.push(...action.payload);
      //console.log("state", state.menuItems);
    },
    // [getActiveSubList.fulfilled]: (state, action) => {
    //   state.activeSubList.status = "succeeded";
    //   if (action.payload.type === "child_added") {
    //     //console.log("action.payload.data", action.payload.data);
    //     state.activeSubList.data.push(action.payload.data);
    //   }
    // },
  },
});

export const getUsersMetaData = () => async (dispatch) => {
  try {
    const metaDataList = [];
    const metaDataRef = firebase
      .app("Zorrito-restro")
      .database()
      .ref("users/" + "metaData");
    metaDataRef.on("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let key = childSnapshot.key;
        let childData = childSnapshot.val();
        metaDataList.push({ key, ...childData });
      });
      dispatch(dbSlice.actions.appendToMetaData(metaDataList));
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getMetaDataList = createAsyncThunk(
//   "db/getMetaDataList",
//   async (_, { dispatch }) => {
//     const metaDataRef = firebase
//       .app("Zorrito-restro")
//       .database()
//       .ref("users/" + "metaData");
//     metaDataRef.on("child_added", (childSnapshot) => {
//       dispatch(
//         dbSlice.actions.appendToMetaData({
//           userId: childSnapshot.key,
//           ...childSnapshot.val(),
//         })
//       );
//     });
//   }
// );

export default dbSlice.reducer;
