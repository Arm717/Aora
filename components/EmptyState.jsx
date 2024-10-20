import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import CustomButton from './CustomBotton'
import { router } from "expo-router";

export default function EmptyState({title, subtitle}) {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-pmedium text-xl text-white">
                  {title}
                </Text>
                <Text className="font-pmedium text-sm  text-gray-100 mt-2">
                  {subtitle}
                </Text>
                <CustomButton
                    title='Create video'
                    handlePress={() => router.push('/create')}
                    containerStyles='w-full my-5'
                />
    </View>
  );
}
