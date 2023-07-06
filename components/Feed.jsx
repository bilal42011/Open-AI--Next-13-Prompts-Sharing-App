"use client"

import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => {
  console.log(data);

  return <div className="mt-16 prompt_layout">
    {
      data.map((post) => {
        return <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick} />
      })
    }
  </div>
}


const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const handleSearchChange = (e) => {

  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        console.log(data);
        setPosts(data);
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchPosts();
  }, [])

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer" />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={() => { }} />
    </section>
  )
}

export default Feed