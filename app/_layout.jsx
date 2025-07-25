import { StyleSheet, Text, View } from 'react-native';
import {Slot, SplashScreen, Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
const _layout = () => {
    const [fontsLoaded,error]=useFonts({
        "SpaceMono-Regular":require("../assets/fonts/SpaceMono-Regular.ttf")
    });
    useEffect(()=>{
        if(error) throw error;
        if(fontsLoaded) SplashScreen.hideAsync();
    },[fontsLoaded,error])

    if(!fontsLoaded && !error) return null;
return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="profile" options={{headerShown:false}}/>
        <Stack.Screen name="home" options={{headerShown:false}}/>
    </Stack>
)
}

export default _layout
