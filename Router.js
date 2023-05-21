import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppStack } from './stacks/AppStack'
import { AuthStack } from './stacks/AuthStack'
import {useSelector} from "react-redux";


const Router = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const studentInfo = useSelector((state) => state.auth.studentInfo);

  console.log(studentInfo)

  return (
    <NavigationContainer>
      {authToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Router