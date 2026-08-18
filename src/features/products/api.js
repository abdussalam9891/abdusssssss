import { productService } from "../../services/productService.js";
import { productsState } from "./state.js";


export async function fetchProducts() {

  const price =
    productsState.filters.price;


  const response =
    await productService.getPublicProducts({

      page:
        productsState.page,

      limit:
        productsState.limit,

      categories:
        productsState.filters.categories,

      badges:
        productsState.filters.badges,

      minPrice:
        price?.min,

      maxPrice:
        price?.max,

      sort:
        productsState.sort,

      search:
        productsState.search,

    });


  const data =
    response?.data || {};


  productsState.products =
    Array.isArray(data.products)
      ? data.products
      : [];


  productsState.total =
    Number(data.total) || 0;


  productsState.totalPages =
    Number(data.totalPages) || 0;


  return data;
}
