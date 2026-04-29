import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1' }),
  tagTypes: ['Recipe', 'Category', 'Search'],
  endpoints: (builder) => ({
    /**
     * Search Recipes by Name
     */
    searchRecipes: builder.query({
      query: (term) => `/search.php?s=${term}`,
      transformResponse: (response) => response.meals || [],
      providesTags: (result) => 
        result 
          ? [...result.map(({ idMeal }) => ({ type: 'Search', id: idMeal })), { type: 'Search', id: 'LIST' }]
          : [{ type: 'Search', id: 'LIST' }],
    }),

    /**
     * Get Recipe Details
     */
    getRecipeDetails: builder.query({
      query: (id) => `/lookup.php?i=${id}`,
      transformResponse: (response) => response.meals ? response.meals[0] : null,
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
    }),

    /**
     * Get All Categories
     */
    getCategories: builder.query({
      query: () => '/categories.php',
      transformResponse: (response) => response.categories || [],
      providesTags: ['Category'],
    }),

    /**
     * Get Recipes by Category
     */
    getRecipesByCategory: builder.query({
      query: (category) => `/filter.php?c=${category}`,
      transformResponse: (response) => response.meals || [],
    }),

    /**
     * Get Recipes by Region
     */
    getRecipesByRegion: builder.query({
      query: (region) => `/filter.php?a=${region}`,
      transformResponse: (response) => response.meals || [],
    }),

    /**
     * Get Latest Recipes (Simulated)
     */
    getLatestRecipes: builder.query({
      query: () => '/search.php?s=',
      transformResponse: (response) => response.meals ? response.meals.slice(0, 10) : [],
    }),

    /**
     * Get Random Recipe
     */
    getRandomRecipe: builder.query({
      query: () => '/random.php',
      transformResponse: (response) => response.meals ? response.meals[0] : null,
    }),
  }),
});

export const {
  useSearchRecipesQuery,
  useLazySearchRecipesQuery,
  useGetRecipeDetailsQuery,
  useGetCategoriesQuery,
  useGetRecipesByCategoryQuery,
  useLazyGetRecipesByCategoryQuery,
  useGetRecipesByRegionQuery,
  useLazyGetRecipesByRegionQuery,
  useGetLatestRecipesQuery,
  useGetRandomRecipeQuery,
} = apiSlice;
