import baseApi from "../api/baseApi"

const customerApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getCustomers : builder.query({
            query : ({search, page,limit}) => `/customers?search=${search}&page=${page}&limit=${limit}`,
            providesTags : "Customers",
        })
    })
})

export const  {useGetCustomersQuery} = customerApi