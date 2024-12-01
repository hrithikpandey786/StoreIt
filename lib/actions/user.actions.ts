'use server';

import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import {parseStringify} from "../utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) =>{
    
    const {databases} = await createAdminClient();
    // console.log(appwriteConfig.userCollectionId); 
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", [email])],
    );
    // console.log(email);
    return result.total>0?result.documents[0]:null;
};

const handleError = async (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const sendEmailOTP = async (email: string) => {
    const {account} = await createAdminClient();

    try{
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch(error){
        handleError(error, "Failed to send email OTP");
    }
};

export const createAccount = async (fullName: string, email: string)=>{
    // console.log(fullName, email);
    const existingUser = await getUserByEmail(email);
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

    return parseStringify({accountId});
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
        handleError(err, "Failed to verify OTP");
    }
}