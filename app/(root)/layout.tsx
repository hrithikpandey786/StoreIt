import React from "react";
import Sidebar from "../../components/Sidebar";
import MobileNavigation from "../../components/MobileNavigation";
import Header from "../../components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";


const layout = async ({children}: {children: React.ReactNode})=>{
    const currentUser = await getCurrentUser();
    console.log(currentUser);
    // if(!currentUser){
    //     return redirect("/sign-in");
    // }

    return(
        <main className="flex h-screen">
            <Sidebar fullName={"hrithik"} email={"currentUser.email"} avatar={"/currentUser.avatar"}/>
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation/>
                <Header/>
                <div className="main-content">
                    {children}
                </div>
            </section>
        </main>
    )
}

export default layout;