import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseApi = createApi({
    reducerPath :"api",
      baseQuery: fetchBaseQuery({ 
        // baseUrl: 'https://thecaredition.vercel.app/api',
        baseUrl: 'http://localhost:3000/api',
       }),
      tagTypes: ["Bookings","Videos","Blogs","Customers","Shops"],
  endpoints: () => ({
  }),
})
export default baseApi;