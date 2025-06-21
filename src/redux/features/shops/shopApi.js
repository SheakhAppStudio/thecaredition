import baseApi from "../api/baseApi"

const shopApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getShops : builder.query({
            query : ({search, page,limit}) => `/filter-shops?search=${search}&page=${page}&limit=${limit}`,
            providesTags : "Shops",
        }),
        updateShop : builder.mutation({
            query : ({id,data }) => ({
        url : `/shops/${id}`,
        method:"PATCH",
        body : data
      }),
      invalidatesTags : "Shops"
        }),
        deleteShop : builder.mutation({
            query : (id) => ({
        url : `/shops/${id}`,
        method:"DELETE"
      }),
      invalidatesTags : "Shops"
        })
    })
})

export const  {useDeleteShopMutation,useGetShopsQuery,useUpdateShopMutation} = shopApi