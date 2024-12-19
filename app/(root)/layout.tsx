import React from "react";
import Sidebar from "../../components/Sidebar";
import MobileNavigation from "../../components/MobileNavigation";
import Header from "../../components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { avatarPlaceholderUrl } from "@/constants";


export const dynamic = "force-dynamic";

const layout = async ({children}: {children: React.ReactNode})=>{
    const currentUser = await getCurrentUser();
    // console.log(currentUser);
    if(!currentUser){
        return redirect("/sign-in");
    }

    return(
        <main className="flex h-screen">
            <Sidebar fullName={"hrithik"} email={"currentUser.email"} avatar={avatarPlaceholderUrl}/>
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation {...currentUser}/>
                <Header userId={currentUser.$id} accountId={currentUser.accountId}/>
                <div className="main-content">
                    {children}
                </div>
            </section>
        </main>
    )
}

export default layout;