import baseApi from "../api/baseApi"

const bookingApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getBookings : builder.query({
            query : ({search, status,page,limit}) => `/bookings/filter-bookings?search=${search}&status=${status}&page=${page}&limit=${limit}`,
            providesTags : "Bookings",
        }),
        updateBookingStatus : builder.mutation({
            query : ({id,status }) => ({
        url : `/bookings/update-booking-status/${id}`,
        method:"PATCH",
        body : {status}
      }),
      invalidatesTags : "Bookings"
        }),
        deleteBooking : builder.mutation({
            query : (id) => ({
        url : `/bookings/${id}`,
        method:"DELETE"
      }),
      invalidatesTags : "Bookings"
        })
    })
})

export const  {useGetBookingsQuery,useUpdateBookingStatusMutation,useDeleteBookingMutation} = bookingApi