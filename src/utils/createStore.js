import  { createContext, useContext, useReducer } from "react";

export default function createStore(reducer, initialState) {
    // make a context or our store
    const storeContext = createContext();
    const dispatchContext = createContext();

    // make a provider that takes an intialValue, children and a reducer connected to it
    function StoreProvider({ children }) {
        // using reducer to maintain a store and dispatcher
        const [store, dispatch] = useReducer(reducer, initialState);

        // provide the store to children and related context value
        return <dispatchContext.Provider value={dispatch}>
            <storeContext.Provider value={store}>
                {children}
            </storeContext.Provider>
        </dispatchContext.Provider>;
    };

    // a hook to help us consume the store
    function useStore() {
        return useContext(storeContext);
    }

    // a hook to help us manipulate the store using reducer
    function useDispatch() {
        return useContext(dispatchContext) || (() => {});
    }

    return [StoreProvider, useDispatch, useStore];
}