"use client"

import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {

  return <div className="mt-16 prompt_layout">
    {
      data.map((post) => {
        return <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={() => handleProfileClick && handleProfileClick(post)} />
      })
    }
  </div>
}


const Feed = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleProfileClick = (post) => {
    if (pathName !== "/profile") {
      session?.user?.id === post?.creator?._id ? router.push("/profile") :
        router.push(`/profile/${post?.creator?._id}?name=${post?.creator?.username}`);
    }
  }

  const handleTagClick = (tag) => {
    setSearchText(tag);
  }

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) => regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)

    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setPosts(data);
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchPosts();
  }, [])


  //Debouncing
  useEffect(() => {
    const getData = setTimeout(() => {
      const searchResult = filterPrompts(searchText);
      setSearchedResults(searchResult);
    }, 500)

    return () => clearTimeout(getData)
  }, [searchText])

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          required
          className="search_input peer" />
      </form>

      {searchText ?
        <PromptCardList
          data={searchedResults}
          handleTagClick={() => { }}
          handleProfileClick={handleProfileClick} /> :
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick} />}
    </section>
  )
}

export default Feed