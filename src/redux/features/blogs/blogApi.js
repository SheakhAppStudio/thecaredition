import baseApi from "../api/baseApi"

const blogApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getBlogs : builder.query({
            query : ({search, page,limit}) => `/filter-blogs?search=${search}&page=${page}&limit=${limit}`,
            providesTags : "Blogs",
        }),
        updateBlog : builder.mutation({
               query : ({id,data }) => ({
        url : `/blogs/${id}`,
        method:"PATCH",
        body : data
      }),
            invalidatesTags : "Blogs",
        }),
        deleteBlog : builder.mutation({
                query : (id) => ({
        url : `/blogs/${id}`,
        method:"DELETE"
      }),
            invalidatesTags : "Blogs",
        }),
    })
})

export const  {useGetBlogsQuery,useDeleteBlogMutation,useUpdateBlogMutation} = blogApi