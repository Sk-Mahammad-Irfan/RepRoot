import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import {
  User,
  MapPin,
  GraduationCap,
  Plus,
  Trash2,
  Upload,
  Award,
  X,
} from "lucide-react";

const currentYear = new Date().getFullYear();

const levels = ["School", "Undergraduate", "Postgraduate"];

const predefinedDegrees = [
  "BTech",
  "BA",
  "BBA",
  "Diploma",
  "MTech",
  "MA",
  "MBA",
];

const defaultEdu = {
  level: "Undergraduate",
  institutionName: "",
  institutionLocation: "",
  startYear: currentYear,
  endYear: currentYear,
  degree: "",
  degreeSource: "predefined",
};

const UserProfileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    userBio: "",
    userLocation: "",
    profile_img: "",
    education: [defaultEdu],
    skillSet: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { ...defaultEdu }],
    }));
  };

  const removeEducation = (index) => {
    if (form.education.length === 1) {
      toast.error("At least one education entry is required.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.education];
      const edu = { ...updated[index] };

      if (field === "degreeSource") {
        edu.degreeSource = value;
      } else {
        edu[field] = value;
      }

      if (field === "level" && value === "School") {
        edu.degree = "";
        edu.degreeSource = "predefined";
      }

      updated[index] = edu;
      return { ...prev, education: updated };
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      toast.error("Please enter a skill.");
      return;
    }

    if (skill.length > 50) {
      toast.error("Skill name must be 50 characters or less.");
      return;
    }

    if (form.skillSet.length >= 20) {
      toast.error("Maximum 20 skills allowed.");
      return;
    }

    if (form.skillSet.includes(skill)) {
      toast.error("This skill is already added.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      skillSet: [...prev.skillSet, skill],
    }));
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skillSet: prev.skillSet.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
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
        return "Degree is required for non-school entries.";
      }

      if (edu.endYear < edu.startYear) {
        return "End year cannot be before start year.";
      }

      if (
        edu.startYear < 1900 ||
        edu.endYear < 1900 ||
        edu.startYear > currentYear ||
        edu.endYear > currentYear
      ) {
        return `Years must be between 1900 and ${currentYear}.`;
      }
    }

    if (form.skillSet.length > 20) {
      return "Maximum 20 skills allowed.";
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

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("userBio", form.userBio);
    formData.append("userLocation", form.userLocation);
    formData.append("education", JSON.stringify(cleanEducation));
    formData.append("skillSet", JSON.stringify(form.skillSet));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    setLoading(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-user/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (err) {
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

        const edu =
          userDetails?.education?.length > 0
            ? userDetails.education.map((e) => ({
                ...e,
                degreeSource: predefinedDegrees.includes(e.degree)
                  ? "predefined"
                  : "custom",
              }))
            : [defaultEdu];

        setForm({
          username: user?.username || "",
          userBio: userDetails?.userBio || "",
          userLocation: userDetails?.userLocation || "",
          profile_img: user?.profile_img || "",
          education: edu,
          skillSet: userDetails?.skillSet || [],
        });

        if (user?.profile_img) {
          setImgPreview(user.profile_img);
        }
      } catch (err) {
        toast.error("Failed to load user.");
      }
    };

    if (id) fetchUser();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <User className="w-6 h-6" />
              Update Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-slate-200">Profile Image</Label>
              <div className="flex items-center gap-4">
                {imgPreview && (
                  <div className="relative">
                    <img
                      src={imgPreview}
                      alt="Profile preview"
                      className="w-24 h-24 object-cover rounded-full border-2 border-slate-700"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md cursor-pointer transition-colors border border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Username</Label>
              <Input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                required
                disabled={loading}
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Bio</Label>
              <textarea
                value={form.userBio}
                onChange={(e) => handleChange("userBio", e.target.value)}
                maxLength={150}
                required
                disabled={loading}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                rows={3}
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-slate-400">
                {form.userBio.length}/150 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                value={form.userLocation}
                onChange={(e) => handleChange("userLocation", e.target.value)}
                required
                disabled={loading}
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                placeholder="City, Country"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-slate-200">Add Your Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  disabled={loading || form.skillSet.length >= 20}
                  placeholder="e.g., JavaScript, Python, Design"
                  maxLength={50}
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  disabled={loading || form.skillSet.length >= 20}
                  variant="outline"
                  className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-slate-100 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Press Enter or click + to add. Max 20 skills (
                {form.skillSet.length}/20)
              </p>
            </div>

            {form.skillSet.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-slate-800 rounded-md border border-slate-700">
                {form.skillSet.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-slate-700 text-slate-100 hover:bg-slate-600 px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      disabled={loading}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {form.skillSet.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-800 rounded-md border border-slate-700">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No skills added yet. Start adding your skills above!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
              <Button
                type="button"
                onClick={addEducation}
                disabled={loading}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.education.map((edu, index) => (
              <Card
                key={index}
                className="bg-slate-800 border-slate-700 relative"
              >
                <CardContent className="pt-6 space-y-4">
                  {form.education.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEducation(index)}
                      disabled={loading}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-200">Level</Label>
                    <Select
                      value={edu.level}
                      onValueChange={(v) => updateEducation(index, "level", v)}
                      disabled={loading}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {levels.map((level) => (
                          <SelectItem
                            key={level}
                            value={level}
                            className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
                          >
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Institution Name</Label>
                    <Input
                      value={edu.institutionName}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          "institutionName",
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500"
                      placeholder="University or School name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">
                      Institution Location
                    </Label>
                    <Input
                      value={edu.institutionLocation}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          "institutionLocation",
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Start Year</Label>
                      <Input
                        type="number"
                        min="1900"
                        max={currentYear}
                        value={edu.startYear}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "startYear",
                            Number(e.target.value)
                          )
                        }
                        disabled={loading}
                        className="bg-slate-900 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">End Year</Label>
                      <Input
                        type="number"
                        min="1900"
                        max={currentYear}
                        value={edu.endYear}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "endYear",
                            Number(e.target.value)
                          )
                        }
                        disabled={loading}
                        className="bg-slate-900 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  {edu.level !== "School" && (
                    <div className="space-y-2">
                      <Label className="text-slate-200">Degree</Label>

                      <Select
                        value={
                          edu.degreeSource === "custom" ? "custom" : edu.degree
                        }
                        onValueChange={(v) => {
                          if (v === "custom") {
                            updateEducation(index, "degreeSource", "custom");
                            updateEducation(index, "degree", "");
                          } else {
                            updateEducation(
                              index,
                              "degreeSource",
                              "predefined"
                            );
                            updateEducation(index, "degree", v);
                          }
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-100">
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          {predefinedDegrees.map((deg) => (
                            <SelectItem
                              key={deg}
                              value={deg}
                              className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
                            >
                              {deg}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value="custom"
                            className="text-slate-100 focus:bg-slate-800 focus:text-slate-100 border-t border-slate-700"
                          >
                            Other (Enter manually)
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {edu.degreeSource === "custom" && (
                        <Input
                          placeholder="Enter your degree (e.g., BSc Computer Science)"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                          disabled={loading}
                          className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 text-base font-semibold bg-slate-700 hover:bg-slate-600 text-slate-100 disabled:bg-slate-800 disabled:text-slate-500"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfileForm;
