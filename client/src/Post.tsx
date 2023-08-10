import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useAuth } from "./AuthProvider";
import { isEmpty, isNull } from "lodash";
import { useEffect, useState } from "react";
import { Post as PostType, Prisma } from "@prisma/client";

interface PostQueryBase {
  success: boolean;
  message: string;
}

const postWithUser = Prisma.validator<Prisma.PostArgs>()({
  include: { author: true },
});
type PostWithAuthor = Prisma.PostGetPayload<typeof postWithUser>;
type PostsWithAuthor = PostWithAuthor[];
interface PostQuery extends PostQueryBase {
  post: PostWithAuthor;
}
interface PostsQuery extends PostQueryBase {
  posts: PostsWithAuthor;
}

type Values = Pick<PostType, "title" | "content">;

export const useCreatePost = () => {
  const { auth } = useAuth();
  const [post, setPost] = useState<PostType | null>(null);

  const create = async (post: Values) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const { id } = auth;
      const { data } = await axios.post<PostType>("/api/v1/posts/create", {
        ...post,
        id,
      });

      setPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  return { post, create };
};

const initialValues: Values = {
  title: "",
  content: "",
};

const Create = () => {
  const { create } = useCreatePost();

  const onSubmit = async (values: Values) => {
    create(values);
  };

  return (
    <div>
      <h4>Post</h4>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Field name="title" placeholder="title" />
          <Field name="content" placeholder="content" />
          <button type="submit">Create</button>
        </Form>
      </Formik>
    </div>
  );
};

export const useLatestPost = () => {
  const [post, setPost] = useState<PostWithAuthor | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<PostQuery>(`/api/v1/posts/latest`);

        const { success, post } = data;
        if (!success) return setPost(null);

        setPost(post);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return post;
};

const LatestOne = () => {
  const latest = useLatestPost();

  if (isNull(latest)) return <>Loading</>;

  return (
    <h4>
      {latest.title} by {latest.author?.username}
    </h4>
  );
};

interface SingleProps {
  post: PostWithAuthor;
}
const Single = ({ post }: SingleProps) => {
  return (
    <div>
      {post.title} by {post.author?.username}
    </div>
  );
};

export const usePosts = () => {
  const [posts, setPosts] = useState<PostsWithAuthor>([]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { success, posts },
        } = await axios.get<PostsQuery>("/api/v1/posts");
        if (!success) throw new Error("Query posts failed");

        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return posts;
};

const List = () => {
  const posts = usePosts();

  if (isEmpty(posts)) return <p>There is no posts yet.</p>;

  return (
    <>
      {posts.map((post) => (
        <Single key={post.id} post={post} />
      ))}
    </>
  );
};

export const Post = () => {
  return (
    <>
      <Create />
      <LatestOne />
      <List />
    </>
  );
};
