import {getAuth} from "@clerk/nextjs/server";

export async function GET(request) {

    try {
        
        const {userId} = getAuth(request)

        await connectDB()
        const user = await User.findby(userId)

        if(!user) {
            return NextResponce,json({ success: false, message: "User Not Found"})
        }

        return NextResponce.json({success:true,user})

    } catch (error) {
         return NextResponce,json({ success: false, message: error.message})
        }

    }
    
