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

const onChildChanged = (snapshot, list, reducer, dispatch) => {
  let changedData = { ...snapshot };
  const newList = [...list];
  const curIndex = newList.findIndex((item) => item.key === changedData.key);

  newList[curIndex] = changedData;
  dispatch(dbSlice.actions[reducer](newList));
};

const onChildRemoved = (key, list, reducer, dispatch) => {
  const newList = list.filter((item) => item.key !== key);
  dispatch(dbSlice.actions[reducer](newList));
};

export const getUsersMetaData = () => async (dispatch, getState) => {
  try {
    const metaDataRef = getDatabaseRef("users/" + "metaData");

    metaDataRef.on("child_added", (snapshot) => {
      let key = snapshot.key;
      let childData = snapshot.val();

      dispatch(dbSlice.actions.addToMetaData({ key, ...childData }));
    });

    metaDataRef.on("child_changed", (snapshot) => {
      const {
        db: {
          userMetaData: { data },
        },
      } = getState();
      const snapshotObj = { key: snapshot.key, ...snapshot.val() };
      onChildChanged(snapshotObj, data, "changeToMetaData", dispatch);
    });

    metaDataRef.on("child_removed", (snapshot) => {
      const {
        db: {
          userMetaData: { data },
        },
      } = getState();
      onChildRemoved(snapshot.key, data, "removeFromMetaData", dispatch);
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMeals = () => async (dispatch, getState) => {
  const mealsRef = getDatabaseRef("meals");

  mealsRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let childValue = snapshot.val();
    dispatch(dbSlice.actions.addToMeals({ key, ...childValue }));
  });

  mealsRef.on("child_changed", (snapshot) => {
    const {
      auth,
      db: {
        meals: { data },
      },
    } = getState();

    let snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToMeals", dispatch);
  });

  mealsRef.on("child_removed", (snapshot) => {
    const {
      db: {
        meals: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromMeals", dispatch);
  });
};

export const getMenuItems = () => async (dispatch, getState) => {
  const menuRef = getDatabaseRef("menu");

  menuRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let childValue = snapshot.val();
    dispatch(dbSlice.actions.addToMenuItems({ key, ...childValue }));
  });

  menuRef.on("child_changed", (snapshot) => {
    const {
      auth,
      db: {
        menuItems: { data },
      },
    } = getState();

    let snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToMenuItems", dispatch);
  });
  menuRef.on("child_removed", (snapshot) => {
    const {
      db: {
        menuItems: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromMenuItems", dispatch);
  });
};

export const getActiveSubList = () => async (dispatch, getState) => {
  const activeSubListRef = getDatabaseRef("users/" + "activeSubscription");

  activeSubListRef.on("child_added", (snapshot) => {
    const key = snapshot.key;
    const value = snapshot.val();
    dispatch(dbSlice.actions.addToActiveSubList({ key, ...value }));
  });

  activeSubListRef.on("child_changed", (snapshot) => {
    const {
      db: {
        activeSubList: { data },
      },
    } = getState();
    const snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToActiveSubList", dispatch);
  });

  activeSubListRef.on("child_removed", (snapshot) => {
    const {
      db: {
        activeSubList: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromActiveSubList", dispatch);
  });
};

export const getPendingSubList = () => async (dispatch, getState) => {
  const pendingSubListRef = getDatabaseRef("users/" + "pendingSubscription");

  pendingSubListRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let value = snapshot.val();

    dispatch(dbSlice.actions.addToPendingSubList({ key, ...value }));
  });

  pendingSubListRef.on("child_changed", (snapshot) => {
    const {
      db: {
        pendingSubList: { data },
      },
    } = getState();
    let snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToPendingSubList", dispatch);
  });

  pendingSubListRef.on("child_removed", (snapshot) => {
    const {
      db: {
        pendingSubList: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromPendingSubList", dispatch);
    //dispatch(dbSlice.actions.removeFromPendingSubList({ key: snapshot.key }));
  });
};

export const getLunchOrders = () => async (dispatch, getState) => {
  const lunchRef = getDatabaseRef("users/" + "meals/" + "Lunch");

  lunchRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let value = snapshot.val();
    dispatch(dbSlice.actions.addToLunchOrders({ key, ...value }));
  });

  lunchRef.on("child_changed", (snapshot) => {
    const {
      auth,
      db: {
        lunchOrders: { data },
      },
    } = getState();

    let snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToLunchOrders", dispatch);
  });

  lunchRef.on("child_removed", (snapshot) => {
    const {
      db: {
        lunchOrders: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromLunchOrders", dispatch);
  });
};

export const getDinnerOrders = () => async (dispatch, getState) => {
  const dinnerRef = getDatabaseRef("users/" + "meals/" + "Dinner");

  dinnerRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let value = snapshot.val();
    dispatch(dbSlice.actions.addToDinnerOrders({ key, ...value }));
  });
  dinnerRef.on("child_changed", (snapshot) => {
    const {
      auth,
      db: {
        dinnerOrders: { data },
      },
    } = getState();

    let snapshotObj = { key: snapshot.key, ...snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToDinnerOrders", dispatch);
  });
  dinnerRef.on("child_removed", (snapshot) => {
    const {
      db: {
        dinnerOrders: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromDinnerOrders", dispatch);
  });
};

export const getWalletList = () => async (dispatch, getState) => {
  const walletRef = getDatabaseRef("users/" + "wallet");

  walletRef.on("child_added", (snapshot) => {
    let key = snapshot.key;
    let amount = snapshot.val();
    dispatch(dbSlice.actions.addToWalletList({ key, amount }));
  });
  walletRef.on("child_changed", (snapshot) => {
    const {
      auth,
      db: {
        walletList: { data },
      },
    } = getState();

    let snapshotObj = { key: snapshot.key, amount: snapshot.val() };
    onChildChanged(snapshotObj, data, "changeToWalletList", dispatch);
  });
  walletRef.on("child_removed", (snapshot) => {
    const {
      db: {
        walletList: { data },
      },
    } = getState();
    onChildRemoved(snapshot.key, data, "removeFromWalletList", dispatch);
  });
};

export const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    addToMetaData: (state, action) => {
      state.userMetaData.data.push(action.payload);
    },
    changeToMetaData: (state, action) => {
      state.userMetaData.data = action.payload;
    },
    removeFromMetaData: (state, action) => {
      state.userMetaData.data = action.payload;
    },
    addToActiveSubList: (state, action) => {
      state.activeSubList.status = "succeeded";
      state.activeSubList.data.push(action.payload);
    },
    changeToActiveSubList: (state, action) => {
      state.activeSubList.data = action.payload;
    },
    removeFromActiveSubList: (state, action) => {
      state.activeSubList.data = action.payload;
    },
    addToPendingSubList: (state, action) => {
      state.pendingSubList.status = "succeeded";
      state.pendingSubList.data.push(action.payload);
    },
    changeToPendingSubList: (state, action) => {
      state.pendingSubList.data = action.payload;
    },
    removeFromPendingSubList: (state, action) => {
      // state.pendingSubList.data = state.pendingSubList.data.filter(
      //   (item) => item.key !== action.payload.key
      // );
      state.pendingSubList.data = action.payload;
    },
    addToMeals: (state, action) => {
      (state.meals.status = "succeeded"), state.meals.data.push(action.payload);
    },
    changeToMeals: (state, action) => {
      state.meals.data = action.payload;
    },
    removeFromMeals: (state, action) => {
      state.meals.data = action.payload;
    },
    addToMenuItems: (state, action) => {
      (state.menuItems.status = "succeeded"),
        state.menuItems.data.push(action.payload);
    },
    changeToMenuItems: (state, action) => {
      state.menuItems.data = action.payload;
    },
    removeFromMenuItems: (state, action) => {
      state.menuItems.data = action.payload;
    },
    addToLunchOrders: (state, action) => {
      (state.lunchOrders.status = "succeeded"),
        state.lunchOrders.data.push(action.payload);
    },
    changeToLunchOrders: (state, action) => {
      state.lunchOrders.data = action.payload;
    },
    removeFromLunchOrders: (state, action) => {
      state.lunchOrders.data = action.payload;
    },
    addToDinnerOrders: (state, action) => {
      (state.dinnerOrders.status = "succeeded"),
        state.dinnerOrders.data.push(action.payload);
    },
    changeToDinnerOrders: (state, action) => {
      state.dinnerOrders.data = action.payload;
    },
    removeFromDinnerOrders: (state, action) => {
      state.dinnerOrders.data = action.payload;
    },
    addToWalletList: (state, action) => {
      (state.walletList.status = "succeeded"),
        state.walletList.data.push(action.payload);
    },
    changeToWalletList: (state, action) => {
      state.walletList.data = action.payload;
    },
    removeFromWalletList: (state, action) => {
      state.walletList.data = action.payload;
    },
    dbLogout: (state, action) => {
      state = initialState;
      console.log("db loggedout");
    },
  },
  extraReducers: {
    // [getMenuItems.fulfilled]: (state, action) => {
    //   //console.log(action.payload);
    //   state.menuItems.push(...action.payload);
    // },
    // [registerRestro.fulfilled]: (state, action) => {
    //   state.restro.name = action.payload;
    // },
    // [getUsersMetaData.fulfilled]: (state, action) => {
    //   console.log(action.payload);
    //   state.userMetaData.data.push(...action.payload);
    // },
    // [getActiveSubList.fulfilled]: (state, action) => {
    //   state.activeSubList.status = "succeeded";
    //   if (action.payload.type === "child_added") {
    //     //console.log("action.payload.data", action.payload.data);
    //     state.activeSubList.data.push(action.payload.data);
    //   }
    // },
  },
});

export const setOrder = async (data) => {
  try {
    const { userId, mealType, updateInfo } = data;
    let message;
    await firebase
      .app("Zorrito-restro")
      .database()
      .ref("users/" + "meals/" + mealType + "/" + userId)
      .update(updateInfo, (err) => {
        if (err) {
          console.log("error occured");
          message =
            "Order can't be updated. Please check your Internet Connection.";
        } else {
          console.log("update successful");
          message = "Order updated successfully.";
        }
      });
    return message;
  } catch (error) {
    return "Something went wrong, try again later!";
  }
};

export default dbSlice.reducer;

export const { dbLogout } = dbSlice.actions;

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
