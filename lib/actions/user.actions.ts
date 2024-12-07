'use server';

import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import {parseStringify} from "../utils";
import { cookies } from "next/headers";


const handleError = async (error: unknown, message: string) => {
    console.log(error, message);
    throw new Error(`${message} | Original Error: ${String(error)}`);
}


const getUserByEmail = async (email: string) =>{
    
    try{
        const {databases} = await createAdminClient();
        // console.log(appwriteConfig.userCollectionId); 
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("email", [email])],
        );
        // console.log(email);
        return result.total>0?result.documents[0]:null;
    } catch(err){
        console.log(err);
        handleError(err, "Failed to get user by email");
    }
};

export const sendEmailOTP = async (email: string) => {
    const {account} = await createAdminClient();

    try{
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch(error){
        await handleError(error, "Failed to send email OTP");
    }
};

export const createAccount = async (fullName: string, email: string)=>{
    // console.log(fullName, email);
    try{const existingUser = await getUserByEmail(email);
    // console.log(fullName, email);
    const accountId = await sendEmailOTP(email);

    if(!accountId)
        throw new Error("Failed to send an OTP");

    if(!existingUser){
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "",
                accountId
            },
        );
    }

    return parseStringify({accountId});}catch(err){
        console.log(err);
    }
}   

export const verifySecret = async({accountId, password}: {accountId: string; password: string})=>{
    try{
        const {account} = await createAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set("appwrite_session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return parseStringify({sessionId: session.$id});
    } catch(err){
        await handleError(err, "Failed to verify OTP");
    }
}

// export const getCurrentUser = async() =>{

//     try{
//         const {databases, account} = await createSessionClient();
//         const result = await account.get();
//         console.log(result.$id);
//         const user = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.userCollectionId,
//             [Query.equal("accountId", result.$id)],
//         );
//         console.log(user);
//         if(user.total<=0)
//            { return null;}
    
//         return parseStringify(user.documents[0]);
//     } catch(err){
//         console.log(err);
//     }
// }

export const getCurrentUser = async () => {
    try {
      const { databases, account } = await createSessionClient();
  
      const result = await account.get();
  
      const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", result.$id)],
      );
      console.log(user);
      if (user.total <= 0) return null;
  
      return parseStringify(user.documents[0]);
    } catch (error) {
      console.log(error);
    }
  };