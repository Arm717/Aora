import { View, Text, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { RefreshControl } from "react-native-web";
import {getAllPosts, getLatestPosts} from  '../../lib/appwrite'
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import Trending from "../../components/Trending";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Home() {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);

  const { data: latestPosts} = useAppwrite(getLatestPosts);
  
  const [refreshing, setRefreshing] = useState(false);
  
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

 
console.log(posts);
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
          title={item.title}
          thumbnail={item.thumbnai}
          video={item.video}
          creator={item.users.username}
          avatar={item.users.avatar}
          />
          
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back,
                </Text>
                <Text className="font-pmedium text-2xl text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Last Videos
              </Text>
                    
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
           title= 'No Videos Found'
           subtitle='Be the first one to upload a video' 
           />
          
        )}
        RefreshControl={
        <RefreshControl
           refreshing={refreshing} 
           onRefresh={onRefresh}
        />}
      />
    </SafeAreaView>
  );
}
