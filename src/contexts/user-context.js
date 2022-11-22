import Cookies from "js-cookie";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialState as UserInitState, setUser } from "../store/reducers/userSlice";

const UserContext = createContext({
  ...UserInitState,
  method: "UserAuth",
});

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.user);

  useEffect(() => {
    if (!currUser.id) {
      const user = Cookies.get("user");
      if (user) dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return <UserContext.Provider value={currUser}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

export default UserContext;
