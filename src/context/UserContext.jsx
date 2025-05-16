import axios from "axios";
import { createContext, useState } from "react";


export const UserContext = createContext();

export default function UserContextProvider(props) {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

  const headers = {
    token: localStorage.getItem('userToken')
  }

  // function verifyUserToken() {
  //   return axios.get(`https://ecommerce.routemisr.com/api/v1/auth/verifyToken`, {
  //     headers
  //   })
  //     .then(response => {
  //       return response 
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       return null;
  //     });
  // }






  return <UserContext.Provider value={{ userToken, setUserToken}}>
    {props.children}
  </UserContext.Provider>
}



