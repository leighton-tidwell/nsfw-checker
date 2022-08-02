import axios from "axios";

export const getNsfwPosts = (username) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API}/user`, { username })
      .then((response) => {
        const { data } = response;
        console.log(data);
        resolve(data);
      })
      .catch((e) => {
        reject(e);
      });
  });
