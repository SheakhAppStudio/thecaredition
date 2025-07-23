"use client";

import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

interface AdminFormData {
  name: string;
  mobile: string;
  email: string;
  adminPhoto?: string | string[] | null;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { register: profileRegister, handleSubmit: handleProfileSubmit, setValue: setProfileValue, formState: { errors: profileErrors } } = useForm<AdminFormData>();
  const { register: passwordRegister, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm<PasswordFormData>();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tutorial");
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

  // Fixed tutorial data
  const tutorialData = {
    title: "How to Use the Admin Dashboard",
    youtubeVideo: "https://www.youtube.com/embed/MlubS7KX0YQ?si=HxpY2lbkoRria5ag", // Replace with your video ID
    description: "This tutorial will guide you through all the features of the admin dashboard. Learn how to manage users, settings, and other important functions."
  };

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(`/api/users/6856cf42f58b92803e13931b`);
        const adminData = res.data;
        
        setProfileValue("name", adminData.name);
        setProfileValue("mobile", adminData.mobile);
        setProfileValue("email", adminData.email);
        setAdminPhoto(adminData.profilePhoto);
        
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch admin data");
        console.error(error);
      }
    };

    fetchAdminData();
  }, [setProfileValue]);

  const onSubmitProfile = async (data: AdminFormData) => {
    setLoadingProfile(true);
    
    try {
      const res = await axios.patch(`/api/users/profile-update/profile-info/6856cf42f58b92803e13931b`, data);
      if (res.data?.result?.modifiedCount > 0) {
        toast.success("Profile Updated Successfully");
        setIsEditMode(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      toast.error(
        `${axiosError.response?.status}, ${axiosError.response?.data?.error || "An error occurred"}`
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setLoadingPassword(true);
    
    try {
      const res = await axios.patch(`/api/users/profile-update/update-password/6856cf42f58b92803e13931b`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      if (res?.data?.modifiedCount > 0) {
        toast.success("Password Updated Successfully");
        resetPasswordForm();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      toast.error(
        axiosError.response?.data?.error || "Failed to update password"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAdminPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile, security settings, and view tutorials
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("tutorial")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "tutorial" ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Tutorial
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "profile" ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "password" ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Password
              </button>
            </nav>
          </div>

          {/* Tutorial Tab Content */}
          {activeTab === "tutorial" && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900">{tutorialData.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Watch this tutorial to learn how to use the admin dashboard
                </p>
              </div>

              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-96 rounded-lg"
                    src={tutorialData.youtubeVideo}
                    title="Admin Dashboard Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{tutorialData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Profile Details</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {isEditMode ? "Update your personal information" : "View your profile information"}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {isEditMode ? "Cancel" : "Edit"}
                </button>
              </div>

              <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <div className="flex items-center justify-center">
                      {adminPhoto ? (
                        <img src={adminPhoto} alt="Profile" className="h-32 w-32 rounded-full object-cover" />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Photo</span>
                        </div>
                      )}
                    </div>
                    {isEditMode && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...profileRegister("name", { required: "Name is required" })}
                      disabled={!isEditMode}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        !isEditMode ? "bg-gray-100" : ""
                      } ${profileErrors.name ? "border-red-500" : "border-gray-700"}`}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      {...profileRegister("mobile", { required: "Mobile is required" })}
                      disabled={!isEditMode}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        !isEditMode ? "bg-gray-100" : ""
                      } ${profileErrors.mobile ? "border-red-500" : "border-gray-700"}`}
                    />
                    {profileErrors.mobile && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.mobile.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...profileRegister("email", { required: "Email is required" })}
                      disabled={!isEditMode}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        !isEditMode ? "bg-gray-100" : ""
                      } ${profileErrors.email ? "border-red-500" : "border-gray-700"}`}
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>
                </div>

                {isEditMode && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        loadingProfile ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loadingProfile}
                    >
                      {loadingProfile ? (
                        <>
                          <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Password Tab Content */}
          {activeTab === "password" && (
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure your account is using a strong, unique password
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      {...passwordRegister("currentPassword", { required: "Current password is required" })}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        passwordErrors.currentPassword ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      {...passwordRegister("newPassword", { 
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        }
                      })}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        passwordErrors.newPassword ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...passwordRegister("confirmPassword", { required: "Please confirm your new password" })}
                      className={`w-full px-5 py-3 bg-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500 transition-all duration-200 ${
                        passwordErrors.confirmPassword ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => resetPasswordForm()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={`ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      loadingPassword ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={loadingPassword}
                  >
                    {loadingPassword ? (
                      <>
                        <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Settings;