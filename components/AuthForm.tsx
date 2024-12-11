"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OTPModal } from "./ui/OTPModal";

import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getRandomValues } from "crypto";
import { appwriteConfig } from "@/lib/appwrite/config";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType)=>{
    return z.object({
        email: z.string().email(),
        fullName: formType==="sign-up"?z.string().min(2).max(50):z.string().optional(),
    })
}


export function AuthForm({type}: {type: FormType}) {
  // ...
  const [accountId, setAccountId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
     // 1. Define your form.

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");
    // console.log(values.fullName, values.email);
    try{
      const user = type==="sign-up"? await createAccount(values.fullName || "", values.email)
      :await signInUser({email: values.email});
      console.log(user.accountId);
      setAccountId(user.accountId);
      // console.log(user.accountId);
    } catch(error){
        setErrorMessage("Failed to create account, PLease try again!");
    } finally{
      setIsLoading(false);
    }
  }


  return (
    <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form space-y-8">
            <h1 className="form-title">{(type==="sign-in")?"Login":"Create Account"}</h1>
            {type==="sign-up"&&<FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                    <div className="shad-form-item">
                        <FormLabel className="shad-form-label">Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your Full Name" {...field} className="shad-input"/>
                        </FormControl>
                        
                    </div>
                    <FormMessage className="shad-form-message"/>
                </FormItem>
              )}
            />}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                    <div className="shad-form-item">
                        <FormLabel className="shad-form-label">Email</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your Email" {...field} className="shad-input"/>
                        </FormControl>
                    </div>
                    <FormMessage className="shad-form-message"/>
                </FormItem>
              )}
            />
            <Button type="submit" className="form-submit-button" disabled={isLoading}>{type==="sign-in"?"Login":"Create Account"}{isLoading&&<Image 
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin ml-2"
            />}</Button>

            {errorMessage&&<p className="error-message">*{errorMessage}</p>}

            <div className="body-2 flex justify-center">
                <p className="text-light-100">{type==="sign-in"?"Don't have an account?":"Already have an account?"}</p>
                <Link href={type==="sign-in"?"/sign-up":"/sign-in"} className="ml-1 font-medium text-brand">{type==="sign-in"?"Sign Up":"Sign In"}</Link>
            </div>
          </form>
        </Form>

        {accountId && <OTPModal email={form.getValues("email")} accountId={accountId}/>}
    </>
  )
}





























// import React from "react";

// "use client"

// import { z } from "zod"

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })



// export default function AuthForm({type}: {type: String}){
    
//     return(
//         <div>
//             AuthForm
//         </div>
//     )
// }