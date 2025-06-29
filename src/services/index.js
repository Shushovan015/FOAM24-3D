import axios from "axios";

axios
  .get("http://127.0.0.1:5000/")
  .then((response) => {
    // Handle the response data
    console.log(response.data);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error fetching data:", error);
  });
