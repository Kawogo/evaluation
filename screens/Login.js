import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../context/authSlice";
import { clearAuthData } from "../context/authSlice"; // Import the clearAuthData action

const Login = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.status === "loading"); // Update isLoading selector
  const error = useSelector((state) => state.auth.error);

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    dispatch(login({ studentId, password }));
  };

  // Clear auth data when the component is unmounted
  React.useEffect(() => {
    return () => {
      dispatch(clearAuthData());
    };
  }, [dispatch]);

  return (
      <KeyboardAwareScrollView>
        <View className="min-h-screen">
          <View className="flex-1 items-center justify-center bg-slate-100">
            <View className="p-8 w-full max-w-sm">
              <Text className="text-3xl font-bold mb-6 text-slate-900 text-center">EVALUATION SYSTEM</Text>
              <Text className="text-2xl font-bold mb-6 text-slate-900 text-center">Login</Text>

              <TextInput
                  className="w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4"
                  placeholder="Enter student id"
                  value={studentId}
                  onChangeText={(value) => setStudentId(value)}
              />

              <TextInput
                  className="w-full bg-white border border-slate-200 rounded-md h-12 px-4"
                  placeholder="Enter password"
                  secureTextEntry
                  value={password}
                  onChangeText={(value) => setPassword(value)}
              />

              <View className="flex flex-row justify-between items-center my-8">
                <Pressable>
                  <Text className="text-blue-400 font-bold">Reset password</Text>
                </Pressable>
              </View>

              <TouchableOpacity
                  onPress={handleSubmit}
                  className="h-12 bg-blue-500 rounded-md flex flex-row justify-center items-center px-6"
                  disabled={isLoading}
              >
                <View className="flex-1 flex items-center">
                  <Text className="text-white text-base font-medium">Login</Text>
                </View>
              </TouchableOpacity>

              {isLoading && <Text>Loading...</Text>}
              {error && <Text>{error}</Text>}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
  );
}

export default Login;