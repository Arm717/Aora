import { Client, Account, ID, Avatars, Databases, Query, Storage} from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.armproj.aora',
    projectId: '66ec774c003498c5fce9',
    databaseId: '66ec7a710008332e47fa',
    userCollectionId: '66ec7aa8002ef095b010',
    videoCollectionId: '66ec7ae300093a00fcac',
    storageId: '66ec7d4b003a77a1f441'
}




const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client);
const storage = new Storage(client)


export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}
  
  // Sign In
  export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password)
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const checkActiveSession = async () => {
    try {
      const session = await account.getSession('current'); // Get the current session
      return session !== null; // Return true if there is an active session
    } catch (error) {
      // If there's an error (e.g., no active session), handle it appropriately
      if (error.code === 401) {
        return false; // No active session
      }
      throw error; // Re-throw other unexpected errors
    }
  };

  export const deleteSessions = async () => {
    try {
      // Get the list of all sessions
      const sessions = await account.listSessions();
  
      // Delete each session
      await Promise.all(
        sessions.sessions.map(async (session) => {
          await account.deleteSession(session.$id);
        })
      );
  
      console.log('All sessions deleted successfully');
    } catch (error) {
      console.error('Error deleting sessions:', error.message);
      throw error; // Re-throw the error for further handling
    }
  };

  export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc('$createdAt')]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc('$createdAt', Query.limit(7))]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search('title', query)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.equal('users', userId)]
      );
      
      console.log(posts.documents);
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const sign_Out = async () => {
    try{
      const session = await account.deleteSession('current');
      return session;
    } catch (error){
      throw new Error(error)
    }
  }

  export const getfilePilePreview = async (fileId, type) => {
    let fileUrl;
    try {
      if(type === 'video') {
        fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId)
      }else if(type === 'image') {
        fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
      } else {
        throw new Error('Invalid file type')
      }
      if (!fileUrl) {
        throw new Error;
      }
      return fileUrl;
    } catch (error) {
      throw  Error(error)
    }
    
  }
  export const uploadFile = async (file, type) => {
    if(!file) return

    
    const asset = {
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri,
    }

    

    console.log('File', file);
    

    try {
      const uploadFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );

      console.log('Uploaded',uploadFile);
      

      const fileUrl = await getfilePilePreview(uploadFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error)
    }
  }

  export const createVideo = async (form) => {
    try {
      const [thumbnaiUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnai, 'image'),
        uploadFile(form.video, 'video')
      ])

      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnai: thumbnaiUrl,
          video: videoUrl,
          prompt: form.prompt,
          users: form.userId
        }
      )
      return newPost
    } catch (error) {
      throw new Error(error)
    }
  }


