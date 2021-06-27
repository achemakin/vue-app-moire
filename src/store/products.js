import axios from 'axios';
import { API_BASE_URL } from '../config';

export default {
  actions: {
    getProducts(context, values) {
      return axios
        .get(`${API_BASE_URL}/api/products`, {
          params: { ...values },
        })
        .then((res) => res.data)
        .catch((error) => {
          throw (error);
        });
    },
    getProduct(context, productId) {
      return axios
        .get(`${API_BASE_URL}/api/products/${productId}`)
        .then((res) => {
          const { data } = res;

          data.colors.forEach((element, index) => {
            if (!element.gallery) {
              data.colors[index].gallery = [{ file: { url: 'https://via.placeholder.com/570/0000FF/808080?text=Test_Image' } }];
            }
            element.gallery.push(
              {
                file: { url: 'https://via.placeholder.com/570/0000FF/808080?text=Test_Image_1' },
              },
              {
                file: { url: 'https://via.placeholder.com/570/FFFF00/000000?text=Test_Image_2' },
              },
            );
          });

          return data;
        })
        .catch((error) => {
          throw (error);
        });
    },
    getCategories() {
      return axios
        .get(`${API_BASE_URL}/api/productCategories`)
        .then((res) => res.data);
    },
    getColors() {
      return axios.get(`${API_BASE_URL}/api/colors`)
        .then((res) => res.data);
    },
    getMaterials() {
      return axios
        .get(`${API_BASE_URL}/api/materials`)
        .then((res) => res.data);
    },
    getSeasons() {
      return axios
        .get(`${API_BASE_URL}/api/seasons`)
        .then((res) => res.data);
    },
  },
};
