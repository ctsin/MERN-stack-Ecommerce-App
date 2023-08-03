import axios from "axios";
import { isNil, isNull } from "lodash";
import { ChangeEventHandler, useState } from "react";
import { useAuth } from "./AuthProvider";

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
  const { auth } = useAuth();

  const [response, setResponse] = useState<Record<
    "alias" | "avatar",
    string
  > | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  if (isNull(auth)) return null;

  const { id } = auth;

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (isNil(event.target.files)) return;

    const base64 = await convertToBase64(event.target.files[0]);
    setAvatar(base64);
  };

  const onUpload = () => {
    if (isNil(avatar)) return;

    axios
      .post(`/api/v1/profile/create`, {
        id,
        avatar,
      })
      .then(({ data }) => {
        setResponse(data.profile);
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
          <div>{response.alias ?? "Anonymous"}</div>
          <img src={response.avatar} alt="" />
        </div>
      )}
    </>
  );
};
