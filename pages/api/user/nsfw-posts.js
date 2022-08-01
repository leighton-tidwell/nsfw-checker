import axios from "axios";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    await axios
      .post(`${process.env.API}/user`, body)
      .then((response) => {
        const { data } = response;

        return res.status(200).json(data);
      })
      .catch((err) => {
        const { status, data } = err.response;

        return res.status(status).json(data);
      });
  }
}
