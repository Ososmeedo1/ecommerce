import { useMemo, useState } from "react";
import { UserContext } from './contexts.js';

export default function UserContextProvider(props) {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

  const value = useMemo(() => ({ userToken, setUserToken }), [userToken]);

  return <UserContext.Provider value={value}>
    {props.children}
  </UserContext.Provider>
}



