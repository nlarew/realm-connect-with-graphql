import axios from "axios";

// type Mode = "stitch" | "stitch-dev";

export default async function getAccessToken(mode = "stitch") {
  console.log("getAccessToken");
  const result = await axios({
    method: "post",
    url: `https://${mode}.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      FooBar: "asdfasdfasdf"
    },
    data: {
      username: "CFSEPXSJ",
      apiKey: "42f54c8d-ea4d-460a-8fcc-031136ca3bfe",
    },
  });
  console.log("result", result);
  return result;
}
