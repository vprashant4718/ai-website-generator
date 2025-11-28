"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{alignItems:"center", justifyContent:"center", display:"flex", marginTop:"9rem"}}>
      <SignIn
        appearance={{
          elements: {
            card: "shadow-xl rounded-xl border border-border",
          },
        }}
      />
    </div>
  );
}
