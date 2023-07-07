"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Profile from "@/components/Profile"


const MyProfile = ({ params }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get("name");

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/users/${params?.id}/posts`);
                const data = await response.json();
                setPosts(data);
            }
            catch (err) {
                console.log(err);
            }
        }

        params?.id && fetchPosts();
    }, [])


    return (
        <Profile
            name={name}
            desc="Welcome to your personalized profiled page"
            data={posts} />
    )
}

export default MyProfile