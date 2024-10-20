import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, sign_Out } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import VideoCard from '../../components/VideoCard'
import EmptyState from '../../components/EmptyState'
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

export default function Profile() {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(
    () => getUserPosts(user.$id)
  );

  
  const logout = async () => {
    await sign_Out();
    setUser(null);
    setIsLogged(false)

    router.replace('/sign-in')
  }
  

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
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
             title={user?.username} 
             containerStyles='mt-5'
             titleStyles='text-lg'
             />

             <View className='mt-5 flex-row'>
                <InfoBox
                title={posts.length || 0} 
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
                />
                <InfoBox
                title='1.2k'
                subtitle='Followers'
                
                titleStyles='text-xl'
                />
             </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
