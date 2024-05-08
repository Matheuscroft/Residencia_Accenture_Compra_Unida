import React from 'react';

const Posts = () => {

    const posts = [
        "Post 1", "Post 2", "Post 3"
    ]

    const listPosts = posts.map((post) => {
        return (
            <li>{post}</li>
        )
    })

    return (
        <div>
            <h1>Posts</h1>
            {posts.length ? listPosts : <p>Ainda não possui posts</p>}
        </div>
    )

    

}

export default Posts