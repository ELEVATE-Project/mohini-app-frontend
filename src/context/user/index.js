import createStore from "../../utils/createStore";
import USER_INIT from "./user";
import userReducer from "./userReducer";

// creating a new store by using create store's instance
const [UserProvider, useUserDispatcher, useUserStore] = createStore(
    userReducer,
    USER_INIT
);

export { UserProvider, useUserDispatcher, useUserStore };