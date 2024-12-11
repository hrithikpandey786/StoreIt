'use client';

import React from "react";
import { useRouter } from "next/navigation";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "./alert-dialog";

  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import Image from "next/image";
import { Button } from "./button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions"; 


  export const OTPModal = ({email, accountId}: {email: string, accountId: string}) =>{
    const [isOpen, setIsOpen] = React.useState(true);
    const [password, setIsPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const router = useRouter();

    const handleResendOtp = async()=>{
        await sendEmailOTP(email);
    }

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try{
            const sessionId = await verifySecret({accountId: accountId, password: password});

            if(sessionId)
                router.push("/");
        } catch(err){
            console.log("Failed to verify OTP", String(err));
            setErrorMessage(String(err).split('|')[0]);
        }

        setIsLoading(false);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader className="relative flex j-center">
                {/* <AlertDialogTitle className="h2 text-center">Are you absolutely sure?</AlertDialogTitle> */}
                <Image
                    src="/assets/icons/close-dark.svg"
                    alt="close"
                    width={20}
                    height={20}
                    onClick={()=>setIsOpen(false)}
                    className="otp-close-button"
                />
                
                <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                    We've sent a code to {" "}
                    <span className="pl-1 text-brand">{email}</span>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setIsPassword}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot"/>
                        <InputOTPSlot index={1} className="shad-otp-slot"/>
                        <InputOTPSlot index={2} className="shad-otp-slot"/>
                        <InputOTPSlot index={3} className="shad-otp-slot"/>
                        <InputOTPSlot index={4} className="shad-otp-slot"/>
                        <InputOTPSlot index={5} className="shad-otp-slot"/>
                    </InputOTPGroup>
                </InputOTP>

                <AlertDialogFooter>
                <div className="flex w-full flex-col gap-4">
                {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                <AlertDialogAction 
                    onClick={handleSubmit} 
                    className="shad-submit-btn h-12" 
                    type="button"
                >  Submit
                    {isLoading && <Image
                        src="/assets/icons/loader.svg"
                        alt="loader"
                        width={24}
                        height={24}
                        className="ml-2 animate-spin"
                    />}
                </AlertDialogAction>
                <div className="subtitle-2 mt-2 text-center text-light-100">
                        Didn't get a code?
                        <Button 
                            type="button"
                            variant="link"
                            className="pl-1 text-brand"
                            onClick={handleResendOtp}
                        >
                            Click to resend
                        </Button>
                </div>
                </div>
                </AlertDialogFooter>
                {errorMessage}
            </AlertDialogContent>
        </AlertDialog>

    )
  }