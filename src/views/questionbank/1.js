import axios from "axios";
let data = JSON.stringify({
  "bankId": 56
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://60.204.136.225:6000/brt/question/list',
  headers: { 
    'Content-Type': 'application/json', 
    'Cookie': 'jwt=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM1NTUzMjA1LCJleHAiOjE3MzU2Mzk2MDV9.q4EfwN78GkLFTsLmvG7cBmxnd8xvrdMFbwgBlZT0evs'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
