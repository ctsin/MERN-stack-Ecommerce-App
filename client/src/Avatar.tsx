import axios from "axios";
import { isNil } from "lodash";
import { ChangeEventHandler, useState } from "react";

const convertToBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error: any) => {
      reject(error);
    };
  });
};

export const Avatar = () => {
  const [response, setResponse] = useState<Record<
    "name" | "avatar",
    string
  > | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (isNil(event.target.files)) return;

    const base64 = await convertToBase64(event.target.files[0]);
    setAvatar(base64);
  };

  const onUpload = () => {
    if (isNil(avatar)) return;

    axios
      .post(`/api/v1/profile/create`, {
        name: `Foo ${Date.now()}`,
        avatar,
      })
      .then(({ data }) => {
        setResponse(data.product);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h4>Profile</h4>
      <input
        style={{ margin: "22px 0", display: "block" }}
        type="file"
        name="file"
        id="file"
        accept="image/*"
        placeholder="Upload avatar"
        onChange={onChange}
      />

      <button onClick={onUpload}>Upload</button>

      {!!response && (
        <div>
          <div>{response.name}</div>
          <img src={response.avatar} alt="" />
        </div>
      )}
    </>
  );
};
