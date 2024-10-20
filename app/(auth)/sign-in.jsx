import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomBotton'
import { Link, router } from 'expo-router'
import { checkActiveSession, deleteSessions, getAccount, getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";

export default function SignIn() {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });




  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      // Check for an active session
      const activeSession = await checkActiveSession();

      if (activeSession) {
        // Delete the active sessions if one exists
        await deleteSessions();
      }
    
      // Proceed with sign-in
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <SafeAreaView className= 'bg-primary h-full' >
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4 my-6 '>
          <Image
           source={images.logo}
          className='w-[115px] h-[35px]'
          resizeMode="contain"
          />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>
          <FormField 
            title ='Email'
            value={form.email}
            handleChangeText={(e) => setForm({...form,
            email:e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />

          <FormField 
            title ='Password'
            value={form.password}
            handleChangeText={(e) => setForm({...form,
            password:e })}
            otherStyles='mt-7'
            
          />

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have account?
              </Text>
              <Link href='/sign-up' className='text-lg font-psemibold text-secondary'> Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    
  )
}