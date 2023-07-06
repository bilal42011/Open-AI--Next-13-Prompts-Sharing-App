"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import Profile from "@/components/Profile"


const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [posts, setPosts] = useState([]);

    const handleEdit = (post) => {
        console.log("Inside handleEdit");
        router.push(`/update-prompt?id=${post._id}`)
    }


    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`,
                    {
                        method: "DELETE"
                    })

                const filterPosts = posts.filter((p) => p._id !== post._id);
                setPosts(filterPosts);
            }
            catch (err) {
                console.log(err);
            }
        }
    }


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/users/${session?.user?.id}/posts`);
                const data = await response.json();
                console.log(data);
                setPosts(data);
            }
            catch (err) {
                console.log(err);
            }
        }

        session?.user?.id && fetchPosts();
    }, [])


    return (
        <Profile
            name="My"
            desc="Welcome to your personalized profiled page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete} />
    )
}

export default MyProfile