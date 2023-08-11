import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useAuth } from "./AuthProvider";
import { isEmpty, isNull } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { Post, Prisma } from "@prisma/client";
import { QueryBase } from "./interface";
import { useCategories } from "./CategorySession";

const postWithRelation = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { author: true, category: true },
});
type PostWithRelation = Prisma.PostGetPayload<typeof postWithRelation>;
type PostsWithRelation = PostWithRelation[];
export interface PostQuery extends QueryBase {
  post: PostWithRelation;
}
interface PostsQuery extends QueryBase {
  posts: PostsWithRelation;
}

type Values = Pick<PostWithRelation, "title" | "content" | "categoryID">;

const useUpdatePostCategory = () => {
  const { auth } = useAuth();
  const [response, setResponse] = useState<PostQuery | null>(null);

  const updatePostCategory = async (postID: string, categoryID: string) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const { data } = await axios.patch<PostQuery>(
        `/api/v1/posts/update/${postID}-${categoryID}`
      );

      if (!data.success) throw new Error(data.message);

      setResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  return { response, updatePostCategory };
};

const useCreatePost = () => {
  const { auth } = useAuth();
  const [post, setPost] = useState<Post | null>(null);

  const create = async (post: Values) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const { id } = auth;
      const { data } = await axios.post<Post>("/api/v1/posts/create", {
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
  categoryID: "",
};

const Create = () => {
  const categories = useCategories();
  const { create } = useCreatePost();

  const onSubmit = async (values: Values) => {
    create(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <Field name="title" placeholder="title" />
        <Field name="content" placeholder="content" />
        <Field name="categoryID" as="select">
          <option value=""> = Empty = </option>
          {categories.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Field>
        <button type="submit">Create</button>
      </Form>
    </Formik>
  );
};

const useLatestPost = () => {
  const [post, setPost] = useState<PostWithRelation | null>(null);

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
  const categories = useCategories();

  const { updatePostCategory } = useUpdatePostCategory();

  if (isNull(latest)) return <>Loading</>;

  const onCategoryChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    updatePostCategory(latest.id, event.target.value);
  };

  return (
    <h4>
      {latest.title} by {latest.author?.username} in{" "}
      <select onChange={onCategoryChanged} value={latest.category?.id}>
        <option value=""> = Empty = </option>
        {categories.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </h4>
  );
};

interface SingleProps {
  post: PostWithRelation;
}
const Single = ({ post }: SingleProps) => {
  return (
    <div>
      {post.title} by {post.author?.username}
    </div>
  );
};

const usePosts = () => {
  const [posts, setPosts] = useState<PostsWithRelation>([]);

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

  if (isEmpty(posts)) return <p>There are no posts yet.</p>;

  return (
    <>
      {posts.map((post) => (
        <Single key={post.id} post={post} />
      ))}
    </>
  );
};

export const PostSection = () => {
  return (
    <>
      <h4>Post</h4>

      <Create />
      <LatestOne />
      <List />
    </>
  );
};
