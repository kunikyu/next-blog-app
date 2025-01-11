"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PostSummary from "@/app/_components/PostSummary";

import DOMPurify from "isomorphic-dompurify";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { name } = useParams() as { name: string };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const requestPostsUrl = `/api/posts`;
        const Postsresponse = await fetch(requestPostsUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!Postsresponse.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postResponse: PostApiResponse[] = await Postsresponse.json();
        setPosts(
          postResponse.map((rawPost) => ({
            id: rawPost.id,
            title: rawPost.title,
            content: rawPost.content,
            coverImage: {
              url: rawPost.coverImageURL,
              width: 1000,
              height: 1000,
            },
            createdAt: rawPost.createdAt,
            categories: rawPost.categories.map((category) => ({
              id: category.category.id,
              name: category.category.name,
            })),
          }))
        );
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }
  return (
    <main>
      <div className="text-2xl font-bold">
        カテゴリ「{decodeURI(name)}」の投稿
      </div>
      <div className="space-y-3">
        {posts.map((post) =>
          post.categories.map(
            (c) =>
              c.name === decodeURI(name) && (
                <PostSummary key={post.id} post={post} />
              )
          )
        )}
      </div>
    </main>
  );
};

export default Page;
