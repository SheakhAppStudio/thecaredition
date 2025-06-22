import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


// 1. Define the Admission type
export interface Admission {
  _id  :string,
  registrationNumber: string;
    studentPhoto: string;
    studentName: string;
    fathersOrHusbandName: string;
    motherName: string;
    presentAddress: string;
    permanentAddress: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    bloodGroup: string;
    maritalStatus: string;
    email: string;
    studentMobile: string;
    guardianMobile: string;
    highestEducationQualification: string;
    
    // Course Information
    enrollDate: string;
    certificateType: string;
    courseName: string;
    batchName: string;
    rollNumber: string;
    sessionStart: string;
    sessionEnd: string;
    courseDuraton: string;
    
    // Fees Information
    courseFee: string;
    discount: string;
    payableAmount: string;
    downPayment: string;
    downPaymentDate: string;
    downPaymenttrxMode: string;
    downPaymentTrxNo: string;
    firstInstallment: string;
    firstInstallmentDate: string;
    secondInstallment: string;
    secondInstallmentDate: string;
    
    // Course Completed Information
    completedCourseDate: string;
    issueDate: string;
    referenceMobile: string;
    
    // Reference Information
    reference: string;
    referenceAddress: string;
    activeStatus: string;
    instituteId : string ,
    isCertified :string
}
export interface StudentInfo {
  _id  :string,
  registrationNumber: string;
    studentPhoto: string;
    studentName: string;
    fathersOrHusbandName: string;
    motherName: string;
    presentAddress: string;
    permanentAddress: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    bloodGroup: string;
    maritalStatus: string;
    email: string;
    studentMobile: string;
    guardianMobile: string;
    highestEducationQualification: string;
    
    // Course Information
    enrollDate: string;
    certificateType: string;
    courseName: string;
    batchName: string;
    rollNumber: string;
    sessionStart: string;
    sessionEnd: string;
    courseDuraton: string;
    
    // Fees Information
    courseFee: string;
    discount: string;
    payableAmount: string;
    downPayment: string;
    downPaymentDate: string;
    downPaymenttrxMode: string;
    downPaymentTrxNo: string;
    firstInstallment: string;
    firstInstallmentDate: string;
    secondInstallment: string;
    secondInstallmentDate: string;
    
    // Course Completed Information
    completedCourseDate: string;
    issueDate: string;
    referenceMobile: string;
    isCertified :string
    // Reference Information
    reference: string;
    referenceAddress: string;
    activeStatus: string;
    instituteId : string ,
    feesInfo?: Fee[] | null;
    batchInfo?: Batch | null;
    transactionInfo?:Transaction[] | null ;
}
export interface Transaction {
  _id: string;
  date: string;
  invoiceDate?: string;
  invoiceNumber: string;
  category: string;
  description: string;
  transactionMode: string;
  transactionType: string;
  amount: number;
  studentId?: string;
  batchName?: string;
  instituteId: string;
}
export interface Fee {
  _id: string;
  amount: string;
  invoiceNumber: string;
  invoiceDate: string;
  date: string;
  transactionMode: string;
  transactionNumber: string;
  remark: string;
  studentId: string;
  instituteId: string;
}
export interface Batch {
  _id: string;
  courseName?: string;
  batchName?: string;
  status?: string;
  startDate?: string ;
  instituteId?: string;
  studentCount?: number; // Add this property
}
// 2. Define the shape of your Redux state
interface AdmissionState {
  admissions: Admission[];
  courseCompleted: Admission[];
  certifiedStudents: Admission[];
  examPendingStudents: Admission[];
  status: boolean;
  studentInfo : StudentInfo | null ;
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}

// 3. Initial state
const initialState: AdmissionState = {
  admissions: [],
  courseCompleted: [],
  certifiedStudents: [],
  examPendingStudents: [],
  status: false,
  studentInfo : null,
  currentPage: 0,
  itemsPerPage: 50,
  totalCount: 0,
};

// 4. Payload structure for fetching admissions
type FetchAdmissionsPayload = {
  data: {
    searchTerm?: string;
    page: number;
    limit: number;
  };
};
type FetchInsitutesPayload = {
  data: {
    searchTerm?: string;
    page: number;
    limit: number;
    institute : string
  };
};

// 5. Async thunk for fetching admission data
export const fetchAdmissions = createAsyncThunk<
  { data: Admission[]; total: number },
  FetchAdmissionsPayload
>("admission/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-admissions?name=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}`
  );
  return response.data;
});
export const fetchAdmissionsExamPending = createAsyncThunk<
  { data: Admission[]; total: number },
  FetchAdmissionsPayload
>("admission-exam-pending/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-exam-pending-students?name=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}`
  );
  console.log(response?.data)
  return response.data;
});
export const fetchAdmissionInsitutesExamPending = createAsyncThunk<
  { data: Admission[]; total: number },
  FetchInsitutesPayload
>("institute-exam-pending/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-exam-pending-students?name=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}&insitute=${data.institute}`
  );
  return response.data;
});
export const fetchCertifiedStudents = createAsyncThunk<
  { data: Admission[]; total: number },
  FetchAdmissionsPayload
>("admission-certified-students/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-certified-students?name=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}`
  );
  return response.data;
});
export const fetchCourseCompleted = createAsyncThunk<
  { data: Admission[]; total: number },
  FetchAdmissionsPayload
>("completed-student/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-course-completed?name=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}`
  );
  console.log(response?.data)
  return response.data;
});
export const fetchTotalStudentLength = createAsyncThunk("total-student-length/total-student-length-fetch", async () => {
  const response = await axios.get(
    `/api/total-student-length`
  );
  return response.data;
});
export const fetchStudentInfo= createAsyncThunk(
  "student-info/fetchInstitute",  // Changed action type prefix to avoid conflicts
  async (studentId : string) => {
    const response = await axios.get(`/api/admissions/${studentId}`);
    return response.data;
  }
);


// 6. Slice definition
const admissionSlice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmissions.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchAdmissions.fulfilled,
        (state, action: PayloadAction<{ data: Admission[]; total: number }>) => {
          state.status = false;
          state.admissions = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchAdmissions.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchCertifiedStudents.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchCertifiedStudents.fulfilled,
        (state, action: PayloadAction<{ data: Admission[]; total: number }>) => {
          state.status = false;
          state.certifiedStudents = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchCertifiedStudents.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchAdmissionsExamPending.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchAdmissionsExamPending.fulfilled,
        (state, action: PayloadAction<{ data: Admission[]; total: number }>) => {
          state.status = false;
          state.examPendingStudents = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchAdmissionsExamPending.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchAdmissionInsitutesExamPending.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchAdmissionInsitutesExamPending.fulfilled,
        (state, action: PayloadAction<{ data: Admission[]; total: number }>) => {
          state.status = false;
          state.examPendingStudents = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchAdmissionInsitutesExamPending.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchCourseCompleted.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchCourseCompleted.fulfilled,
        (state, action: PayloadAction<{ data: Admission[]; total: number }>) => {
          state.status = false;
          state.courseCompleted = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchCourseCompleted.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchTotalStudentLength.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchTotalStudentLength.fulfilled,
        (state, action) => {
          state.status = false;
          state.totalCount = action.payload.total;

        }
      )
      .addCase(fetchTotalStudentLength.rejected, (state) => {
        state.status = false;
      });
    builder
      .addCase(fetchStudentInfo.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchStudentInfo.fulfilled,
        (state, action) => {
          state.status = false;
          state.studentInfo = action.payload;

        }
      )
      .addCase(fetchStudentInfo.rejected, (state) => {
        state.status = false;
      });
  },
});

// 7. Export actions and reducer
export const { setCurrentPage, setItemsPerPage } = admissionSlice.actions;
export default admissionSlice.reducer;
