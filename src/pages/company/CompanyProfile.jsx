import { useState, useEffect, useRef } from "react";
import CompanyDashboardLayout from "../../components/company/CompanyDashboardLayout";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import { getCompanyProfile, updateCompanyProfile } from "../../api/company/profile";
import { showToast } from "../../utils/toast";
import { Building2, Mail, Globe, BriefcaseBusiness, Save, X, Upload, Calendar, FileText } from "lucide-react";

export default function CompanyProfile() {
  const { token } = useCompanyAuth();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    industry: "",
    website: "",
    companySize: "",
    description: "",
    foundedYear: "",
    logoPreview: null, // for showing new upload before save
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCompanyProfile(token);
        setProfile(data);
        setFormData({
          companyName: data.companyName || "",
          email: data.email || "",
          industry: data.industry || "",
          website: data.website || "",
          companySize: data.companySize || "",
          description: data.description || "",
          foundedYear: data.foundedYear || "",
          logoPreview: null,
        });
      } catch (err) {
        console.error(err);
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type & size
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, logoPreview: previewUrl }));
    // We'll send the actual file in handleSave
    setFormData((prev) => ({ ...prev, logoFile: file }));
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "logoPreview" && key !== "logoFile" && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      });

      // Append logo file if changed
      if (formData.logoFile) {
        payload.append("logo", formData.logoFile);
      }

      await updateCompanyProfile(token, payload);

      // Refresh profile
      const updated = await getCompanyProfile(token);
      setProfile(updated);

      // Clean up preview URL
      if (formData.logoPreview) {
        URL.revokeObjectURL(formData.logoPreview);
      }

      setFormData((prev) => ({ ...prev, logoPreview: null, logoFile: null }));
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: profile?.companyName || "",
      email: profile?.email || "",
      industry: profile?.industry || "",
      website: profile?.website || "",
      companySize: profile?.companySize || "",
      description: profile?.description || "",
      foundedYear: profile?.foundedYear || "",
      logoPreview: null,
      logoFile: null,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="p-8 text-center text-gray-500">Loading profile...</div>
      </CompanyDashboardLayout>
    );
  }

  if (!profile) {
    return (
      <CompanyDashboardLayout>
        <div className="p-8 text-center text-red-600">Failed to load profile</div>
      </CompanyDashboardLayout>
    );
  }

  const currentLogo = formData.logoPreview || profile.logo;

  return (
    <CompanyDashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Profile</h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-[#086972] text-white rounded-lg hover:bg-[#086972]/90 transition font-medium"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1.5 font-medium"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#086972] text-white rounded-lg hover:bg-[#086972]/90 transition flex items-center gap-1.5 font-medium"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Header / Branding area */}
          <div className="bg-gradient-to-r from-[#086972]/10 to-[#086972]/5 px-8 py-10 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Logo */}
              <div className="relative group">
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Company logo"
                    className="h-24 w-24 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                    <Building2 size={40} />
                  </div>
                )}

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-[#086972] text-white p-2 rounded-full shadow-lg hover:bg-[#086972]/90 transition"
                    title="Change logo"
                  >
                    <Upload size={16} />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>

              {/* Company info */}
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded px-3 py-1.5 w-full max-w-md focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none"
                    placeholder="Company name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{profile.companyName}</h2>
                )}

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 text-gray-600 bg-white border border-gray-300 rounded px-3 py-1.5 w-full max-w-md focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none"
                    placeholder="company@email.com"
                  />
                ) : (
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {profile.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Industry / Focus
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none"
                      placeholder="e.g. Software Development, AI, FinTech..."
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">
                      {profile.industry || "—"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Founded Year
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none"
                      placeholder="YYYY"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      {profile.foundedYear || "—"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Company Size
                  </label>
                  {isEditing ? (
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none bg-white"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="201-500">201–500 employees</option>
                      <option value="501-1000">501–1,000 employees</option>
                      <option value="1001+">1,000+ employees</option>
                    </select>
                  ) : (
                    <div className="text-gray-900 font-medium">
                      {profile.companySize ? `${profile.companySize} employees` : "—"}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none"
                      placeholder="https://yourcompany.com"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#086972] hover:underline"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  )}
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Company Summary / About
                  </label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#086972] focus:ring-1 focus:ring-[#086972]/30 outline-none resize-y"
                      placeholder="Tell others about your company, mission, culture, what you build..."
                    />
                  ) : (
                    <div className="text-gray-700 whitespace-pre-line">
                      {profile.description || "No description yet."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change password notice */}
        <div className="mt-10 bg-white rounded-xl shadow border p-8">
          <h3 className="text-xl font-semibold mb-4">Security</h3>
          <p className="text-gray-600 mb-6">
            To change your password or update email verification settings, use the dedicated security section.
          </p>
          <button
            disabled
            className="px-6 py-2.5 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium"
          >
            Manage Password & Security (coming soon)
          </button>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}