import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const currentYear = new Date().getFullYear();
const levels = ["School", "Undergraduate", "Postgraduate"];
const degrees = [
  "BTech",
  "BA",
  "BBA",
  "Diploma",
  "MTech",
  "MA",
  "MBA",
  "Other",
];

const UserProfileForm = () => {
  const { id } = useParams();

  const [form, setForm] = useState({
    username: "",
    userBio: "",
    userLocation: "",
    education: [
      {
        level: "Undergraduate",
        institutionName: "",
        institutionLocation: "",
        startYear: currentYear,
        endYear: currentYear,
        degree: "",
        degreeSource: "predefined",
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          level: "Undergraduate",
          institutionName: "",
          institutionLocation: "",
          startYear: currentYear,
          endYear: currentYear,
          degree: "",
          degreeSource: "predefined",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setForm((prev) => {
      if (prev.education.length === 1) {
        toast.error("At least one education entry is required.");
        return prev;
      }
      return {
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      };
    });
  };

  const updateEducation = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.education];

      if (field === "degree") {
        if (value === "Other") {
          updated[index].degree = "";
          updated[index].degreeSource = "custom";
        } else if (updated[index].degreeSource === "custom") {
          updated[index].degree = value;
        } else {
          updated[index].degree = value;
          updated[index].degreeSource = "predefined";
        }
      } else {
        updated[index][field] = value;
        if (field === "level" && value === "School") {
          updated[index].degree = "";
          updated[index].degreeSource = "predefined";
        }
      }

      return { ...prev, education: updated };
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.userBio.trim()) return "Bio is required.";
    if (!form.userLocation.trim()) return "Location is required.";

    if (!Array.isArray(form.education) || form.education.length === 0)
      return "At least one education entry is required.";

    for (const edu of form.education) {
      if (
        !edu.level ||
        !edu.institutionName.trim() ||
        !edu.institutionLocation.trim() ||
        !edu.startYear ||
        !edu.endYear
      ) {
        return "All education fields are required.";
      }
      if (edu.level !== "School" && !edu.degree.trim()) {
        return "Degree is required for non-School education levels.";
      }
      if (edu.endYear < edu.startYear) {
        return "End year cannot be before start year in education.";
      }
      if (
        edu.startYear < 1900 ||
        edu.startYear > currentYear ||
        edu.endYear < 1900 ||
        edu.endYear > currentYear
      ) {
        return `Education years must be between 1900 and ${currentYear}.`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
    if (!token) {
      toast.error("No auth token found.");
      return;
    }

    const cleanEducation = form.education.map(
      ({ degreeSource, ...edu }) => edu
    );

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-user/${id}`,
        {
          username: form.username,
          userBio: form.userBio,
          userLocation: form.userLocation,
          education: cleanEducation,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Submitting:", {
        username: form.username,
        userBio: form.userBio,
        userLocation: form.userLocation,
        education: cleanEducation,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/get-user/${id}`
        );
        const { user, userDetails } = res.data;
        // console.log(userDetails);

        setForm({
          username: user?.username || "",
          userBio: userDetails?.userBio || "",
          userLocation: userDetails?.userLocation || "",
          education:
            userDetails?.education && userDetails.education.length > 0
              ? userDetails.education.map((edu) => ({
                  ...edu,
                  degreeSource: degrees.includes(edu.degree)
                    ? "predefined"
                    : "custom",
                }))
              : [
                  {
                    level: "Undergraduate",
                    institutionName: "",
                    institutionLocation: "",
                    startYear: currentYear,
                    endYear: currentYear,
                    degree: "",
                    degreeSource: "predefined",
                  },
                ],
        });
      } catch (err) {
        toast.error("Failed to load user");
      }
    };

    if (id) fetchUser();
  }, [id]);
  console.log(form.education);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4 p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-xl font-semibold">Update Profile</h2>

      <div>
        <Label>Username</Label>
        <Input
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label>Bio</Label>
        <textarea
          value={form.userBio}
          onChange={(e) => handleChange("userBio", e.target.value)}
          maxLength={150}
          required
          disabled={loading}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input
          value={form.userLocation}
          onChange={(e) => handleChange("userLocation", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <button
          type="button"
          onClick={addEducation}
          disabled={loading}
          className="text-blue-600 hover:underline text-sm"
        >
          + Add Education
        </button>
      </div>

      {form.education.map((edu, index) => (
        <div key={index} className="p-4 border rounded space-y-4 relative">
          <button
            type="button"
            className="absolute right-2 top-2 text-red-500 text-sm"
            onClick={() => removeEducation(index)}
            disabled={loading || form.education.length === 1}
          >
            Remove
          </button>

          <div>
            <Label>Level</Label>
            <Select
              value={edu.level}
              onValueChange={(v) => updateEducation(index, "level", v)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Institution Name</Label>
            <Input
              value={edu.institutionName}
              onChange={(e) =>
                updateEducation(index, "institutionName", e.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label>Institution Location</Label>
            <Input
              value={edu.institutionLocation}
              onChange={(e) =>
                updateEducation(index, "institutionLocation", e.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Year</Label>
              <Input
                type="number"
                min="1900"
                max={currentYear}
                value={edu.startYear}
                onChange={(e) =>
                  updateEducation(index, "startYear", Number(e.target.value))
                }
                required
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <Label>End Year</Label>
              <Input
                type="number"
                min="1900"
                max={currentYear}
                value={edu.endYear}
                onChange={(e) =>
                  updateEducation(index, "endYear", Number(e.target.value))
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          {edu.level !== "School" && (
            <>
              <Label>Degree</Label>
              <Select
                value={
                  edu.degreeSource === "custom"
                    ? "Other"
                    : edu.degree || "Other"
                }
                onValueChange={(v) => updateEducation(index, "degree", v)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree or choose Other" />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((deg) => (
                    <SelectItem key={deg} value={deg}>
                      {deg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {edu.degreeSource === "custom" && (
                <Input
                  placeholder="Enter your degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  required
                  disabled={loading}
                />
              )}
            </>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-md transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Submit"}
      </button>
    </form>
  );
};

export default UserProfileForm;
