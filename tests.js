import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const styleUrl = 'http://test.k6.io/products/:1/styles';
  const relatedUrl = 'http://test.k6.io/products/:1/related';
  const productUrl = 'http://test.k6.io/products/:1';
  const productsUrl = 'http://test.k6.io/products';

  http.get(styleUrl);
  http.get(relatedUrl);
  http.get(productUrl);
  http.get(productsUrl);
}