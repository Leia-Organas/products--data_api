import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [{
    duration: '15s',
     target: 1000

},
{
  duration: '15s',
   target: 1000

},
{
  duration: '15s',
   target: 200

}],
  // vus: 100,
  // duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<50"],
  },
};

export default function () {
  const styleUrl = 'http://localhost:3000/products/5/styles';
  // const relatedUrl = 'http://localhost:3000/products/5/related';
  // const productUrl = 'http://localhost:3000/products/5';
  // const productsUrl = 'http://localhost:3000/products';

  http.get(styleUrl);
  sleep(1);
  // http.get(relatedUrl);
  // sleep(1);
  // http.get(productUrl);
  // sleep(1);
  // http.get(productsUrl);


}