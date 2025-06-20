import { collections, dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";


// Define interfaces for your collections
interface Admission extends Document {
  _id: ObjectId;
  studentPhoto?: string;
  studentName: string;

}






// Connect collections with types
const admissionCollection = dbConnect<Admission>(collections.services);


// GET — fetch admission by ID with related data
export async function GET(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

  
  


  } catch (error) {
    console.error("Error fetching admission with related data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission with related data" }, 
      { status: 500 }
    );
  }
}

// PATCH — update student details
export async function PATCH(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
    const update = await req.json();
    const admission = await admissionCollection.findOne(filter);

    if (!admission) {
      return NextResponse.json({ error: "Insittue not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
          studentPhoto: update.studentPhoto, // "name"
          studentName: update.studentName, // "fathersOrHusbandName" mapped to "fatherName"
          fathersOrHusbandName: update.fathersOrHusbandName, // "maritalStatus" mapped to "marital"
          motherName: update.motherName, // "nationalId"
          presentAddress: update.presentAddress, // "mobile" mapped to "telPersonal"
          permanentAddress: update.permanentAddress, // "studentSchool" mapped to "permanentAddress" (adjust if needed)
          dateOfBirth: update.dateOfBirth, // "studentSchoolRoll" mapped to "admissionName" (adjust if needed)
          gender: update.gender, // "service" mapped to "catgOrganization" (adjust if needed)
          occupation: update.occupation, // "batch" mapped to "position" (adjust if needed)
          bloodGroup: update.bloodGroup, // "guardiansMobile" mapped to "telOffice" (adjust if needed)
          maritalStatus: update.maritalStatus, // "email"
          email: update.email, // "url"
          studentMobile: update.studentMobile, // "presentAddress" mapped to "address"
          guardianMobile: update.guardianMobile, // "numberOfComputer"
          highestEducationQualification: update.highestEducationQualification, // "date"
          enrollDate: update.enrollDate, // "photoURL" mapped to "photo"
          certificateType: update.certificateType, // "tradeLic"
          courseName: update.courseName, // "photoURL" mapped to "profilePic"
          batchName: update.batchName, // "institutionIcon"
          rollNumber: update.rollNumber ,// "roleId"
          sessionStart: update.sessionStart, // "roleId"
          courseDuraton: update.courseDuraton, // "roleId"
          courseFee: update.courseFee, // "roleId"
          discount: update.discount, // "roleId"
          payableAmount: update.payableAmount, // "roleId"
          downPayment: update.downPayment, // "roleId"
          downPaymentDate: update.downPaymentDate, // "roleId"
          downPaymenttrxMode: update.downPaymenttrxMode, // "roleId"
          downPaymentTrxNo: update.downPaymentTrxNo, // "roleId"
          firstInstallment: update.firstInstallment, // "roleId"
          firstInstallmentDate: update.firstInstallmentDate, // "roleId"
          secondInstallment: update.secondInstallment, // "roleId"
          secondInstallmentDate: update.secondInstallmentDate, // "roleId"
          completedCourseDate: update.completedCourseDate, // "roleId"
          issueDate: update.issueDate, // "roleId"
          referenceMobile: update.referenceMobile, // "roleId"
          reference: update.reference, // "roleId"
          referenceAddress: update.referenceAddress, // "roleId"
          activeStatus: update.activeStatus, // "roleId"
      }
    };

    const result = await admissionCollection.updateOne(filter, updateDoc);
    return NextResponse.json({ message: "admission updated successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating admission:", error);
    return NextResponse.json({ error: "Failed to update admission" }, { status: 500 });
  }
}

// DELETE — soft delete by marking as "deleted"
export async function DELETE(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
 

    const result = await admissionCollection.updateOne(filter , {$set : {
      activeStatus : "deleted"
    }});

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "admission marked as deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "admission not found or already deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting admission:", error);
    return NextResponse.json({ error: "An error occurred while deleting the admission." }, { status: 500 });
  }
}
