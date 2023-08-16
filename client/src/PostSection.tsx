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

const useUpdatePostCategory = () => {
  const { auth } = useAuth();
  const [response, setResponse] = useState<PostQuery | null>(null);

  const updatePostCategory = async (
    postID: Post["id"],
    categoryID: Category["id"]
  ) => {
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

  return async (post: Values) => {
    if (isNull(auth)) throw new Error("Invalid token");

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

const LatestOne = () => {
  const latest = useLatestPost();

  const { updatePostCategory } = useUpdatePostCategory();

  if (isNull(latest)) return <>Loading</>;

  const {
    id: postID,
    title,
    categories,
    author: { username },
  } = latest;

  const onCategoryChanged = (categoryID: Category["id"]) => () => {
    updatePostCategory(postID, categoryID);
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
      </div>
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
