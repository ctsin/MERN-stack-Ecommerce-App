import axios from "axios";
import { isNil } from "lodash";
import { ChangeEventHandler, useState } from "react";

export const Avatar = () => {
  const [product, setProduct] = useState<any>(null);
  const [img, setImg] = useState<File | null>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event.target.files);
    if (isNil(event.target.files)) return;

    setImg(event.target.files[0]);
  };

  const onUpload = () => {
    if (isNil(img)) return;

    const formData = new FormData();
    formData.append("name", `Foo ${Date.now()}`);
    formData.append("photo", img);

    axios
      .post(`/api/v1/product/create-product`, formData)
      .then(({ data }) => {
        console.log("🚀 ~ .then ~ data:", data);
        setProduct(data.product);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ margin: "22px 0" }}>
      <label htmlFor="file">Upload</label>
      <input
        type="file"
        name="file"
        id="file"
        accept="image/*"
        onChange={onChange}
        hidden
      />
      {img && (
        <img
          style={{ display: "block", maxHeight: "100px" }}
          src={URL.createObjectURL(img)}
          alt=""
        />
      )}
      <button onClick={onUpload}>Upload</button>

      {!!product && (
        <div>
          <div>{product.name}</div>
          <img
            src={`/api/v1/product/product-photo/${product._id}?size=200`}
            alt=""
          />
        </div>
      )}
    </div>
  );
};
