import baseApi from "../api/baseApi"

const serviceApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getServices : builder.query({
            query : ({search, page,limit}) => `/filter-services?search=${search}&page=${page}&limit=${limit}`,
            providesTags : "Services",
        }),
        updateService : builder.mutation({
               query : ({id,data }) => ({
        url : `/services/${id}`,
        method:"PATCH",
        body : data
      }),  
         invalidatesTags : "Services",
        }),
        createService : builder.mutation({
               query : (data ) => ({
        url : `/services`,
        method:"POST",
        body : data
      }),
            invalidatesTags : "Services",
        }),
        deleteService : builder.mutation({
                query : (id) => ({
        url : `/services/${id}`,
        method:"DELETE"
      }),
            invalidatesTags : "Services",
        }),
    })
})

export const  {useGetServicesQuery,useDeleteServiceMutation,useUpdateServiceMutation,useCreateServiceMutation} = serviceApi