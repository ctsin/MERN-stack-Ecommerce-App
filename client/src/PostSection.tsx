import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useAuth } from "./AuthProvider";
import { isEmpty, isNull } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { Category, Post, Prisma } from "@prisma/client";
import { QueryBase } from "./interface";
import { useCategories } from "./CategorySession";

const postWithRelation = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { author: true, categories: { select: { label: true, id: true } } },
});
type PostWithRelation = Prisma.PostGetPayload<typeof postWithRelation>;
type PostsWithRelation = PostWithRelation[];
export interface PostQuery extends QueryBase {
  post: PostWithRelation;
}
interface PostsQuery extends QueryBase {
  posts: PostsWithRelation;
}

type Values = Pick<PostWithRelation, "title" | "content" | "categoryIDs">;

const useRemovePostCategory = () => {
  const { auth } = useAuth();

  return async (postID: Post["id"], categoryID: Category["id"]) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const { data } = await axios.patch<PostQuery>(
        `/api/v1/posts/remove/${postID}-${categoryID}`
      );

      if (!data.success) throw new Error(data.message);

      return data;
    } catch (error) {
      console.error(error);
    }
  };
};

const useAddPostCategory = () => {
  const { auth } = useAuth();

  return async (postID: Post["id"], category: Category["label"]) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const { data } = await axios.patch<PostQuery>(
        `/api/v1/posts/add/${postID}-${category}`
      );

      if (!data.success) throw new Error(data.message);

      return data;
    } catch (error) {
      console.error(error);
    }
  };
};

const useCreatePost = () => {
  const { auth } = useAuth();
  if (isNull(auth)) throw new Error("Invalid token");

  return async (post: Values) => {
    try {
      const { id } = auth;

      const {
        data: { success, message },
      } = await axios.post<PostQuery>("/api/v1/posts/create", {
        ...post,
        id,
      });

      if (!success) throw new Error(message);
    } catch (error) {
      console.error(error);
    }
  };
};

const useDeletePost = () => {
  const { auth } = useAuth();
  if (isNull(auth)) throw new Error("Invalid token");

  return async (postID: Post["id"]) => {
    try {
      const {
        data: { success, message },
      } = await axios.post<PostQuery>(`/api/v1/posts/delete/${postID}`);

      if (!success) throw new Error(message);
    } catch (error) {
      console.error(error);
    }
  };
};

const initialValues: Values = {
  title: "",
  content: "",
  categoryIDs: [],
};

const Create = () => {
  const categories = useCategories();
  const create = useCreatePost();

  const onSubmit = async (values: Values) => {
    await create(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <Field name="title" placeholder="title" />
        <Field name="content" placeholder="content" />
        <div>
          {categories.map(({ id, label }) => (
            <label key={id}>
              <Field name="categoryIDs" type="checkbox" value={id} />
              {label}
            </label>
          ))}
        </div>

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

interface InstantCategoryValues {
  category: Category["id"];
}

const LatestOne = () => {
  const latest = useLatestPost();

  const removePostCategory = useRemovePostCategory();
  const addPostCategory = useAddPostCategory();

  if (isNull(latest)) return <>Loading</>;

  const {
    id: postID,
    title,
    categories,
    author: { username },
  } = latest;

  const onCategoryChanged = (categoryID: Category["id"]) => async () => {
    await removePostCategory(postID, categoryID);
  };

  const initialValues: InstantCategoryValues = {
    category: "",
  };

  const onSubmit = async ({ category }: InstantCategoryValues) => {
    const encoded = encodeURIComponent(category);
    await addPostCategory(postID, encoded);
  };

  return (
    <h4>
      {title} by {username}
      <div>
        {categories.map(({ id, label }) => (
          <Fragment key={id}>
            {label}
            <button
              name="categories"
              id={`category-${id}`}
              onClick={onCategoryChanged(id)}
            >
              &times;
            </button>
          </Fragment>
        ))}
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Field name="category" placeholder="category" />
            <button type="submit">Add</button>
          </Form>
        </Formik>
      </div>
    </h4>
  );
};

interface SingleProps {
  post: PostWithRelation;
}
const Single = ({ post }: SingleProps) => {
  return (
    <>
      {post.title} by {post.author?.username}
    </>
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
  const deletePost = useDeletePost();

  if (isEmpty(posts)) return <p>There are no posts yet.</p>;

  const onDelete = (postID: Post["id"]) => async () => {
    await deletePost(postID);
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post.id}>
          <Single post={post} />
          <button onClick={onDelete(post.id)}>Delete</button>
        </div>
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
