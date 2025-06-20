import baseApi from "../api/baseApi"

const videoApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getVideos : builder.query({
            query : ({search, page,limit}) => `/filter-videos?search=${search}&page=${page}&limit=${limit}`,
            providesTags : "Videos",
        }),
        updateVideo : builder.mutation({
               query : ({id,data }) => ({
        url : `/videos/${id}`,
        method:"PATCH",
        body : data
      }),
            invalidatesTags : "Videos",
        }),
        deleteVideo : builder.mutation({
                query : (id) => ({
        url : `/videos/${id}`,
        method:"DELETE"
      }),
            invalidatesTags : "Videos",
        }),
    })
})

export const  {useGetVideosQuery,useDeleteVideoMutation,useUpdateVideoMutation} = videoApi