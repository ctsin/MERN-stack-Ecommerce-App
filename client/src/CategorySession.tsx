import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useAuth } from "./AuthProvider";
import { isEmpty, isNull } from "lodash";
import { useEffect, useState } from "react";
import { Category, Prisma } from "@prisma/client";
import { QueryBase } from "./interface";

const categoryWithRelation = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  include: { posts: true },
});

type CategoryWithRelation = Prisma.CategoryGetPayload<
  typeof categoryWithRelation
>;

type CategoriesWithRelation = CategoryWithRelation[];

interface CategoryQuery extends QueryBase {
  categories: CategoryWithRelation;
}

interface CategoriesQuery extends QueryBase {
  categories: CategoriesWithRelation;
}

type Values = Pick<CategoryWithRelation, "label">;

const useCreateCategory = () => {
  const { auth } = useAuth();

  return async (category: Values) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const {
        data: { success, message },
      } = await axios.post<CategoryQuery>(
        "/api/v1/categories/create",
        category
      );

      if (!success) throw new Error(message);
    } catch (error) {
      console.error(error);
    }
  };
};

const useDeleteCategory = () => {
  const { auth } = useAuth();

  return async (categoryID: Category["id"]) => {
    try {
      if (isNull(auth)) throw new Error("Invalid token");

      const {
        data: { success, message },
      } = await axios.delete<CategoryQuery>(
        `/api/v1/categories/delete/${categoryID}`
      );

      if (!success) throw new Error(message);
    } catch (error) {
      console.error(error);
    }
  };
};

const initialValues: Values = {
  label: "",
};

const Create = () => {
  const create = useCreateCategory();

  const onSubmit = async (values: Values) => {
    create(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <Field name="label" placeholder="label" />
        <button type="submit">Create</button>
      </Form>
    </Formik>
  );
};

interface SingleProps {
  category: CategoryWithRelation;
}
const Single = ({ category }: SingleProps) => {
  return <>{category.label}</>;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoriesWithRelation>([]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { success, categories },
        } = await axios.get<CategoriesQuery>("/api/v1/categories");
        if (!success) throw new Error("Query Categories failed");

        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return categories;
};

const List = () => {
  const categories = useCategories();

  const deleteCategory = useDeleteCategory();

  if (isEmpty(categories)) return <p>There are no categories yet.</p>;

  const onDelete = (id: Category["id"]) => {
    deleteCategory(id);
  };

  return (
    <>
      {categories.map((category) => (
        <div key={category.id}>
          <Single category={category} />
          <button onClick={() => onDelete(category.id)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export const CategorySession = () => {
  return (
    <>
      <h4>Category</h4>

      <Create />
      <List />
    </>
  );
};
