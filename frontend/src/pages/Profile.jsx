import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    email: user.email || '',
    skills: Array.isArray(user.skills) ? user.skills : [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
    setNewSkill('');
  };

  const handleSkillRemove = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/self-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: form.email.trim(),
          skills: form.skills,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated!");
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
  <Navbar />
  <div className="bg-slate-100 text-white flex-1 p-6">
    <div className="flex flex-col items-center gap-30">
      <h2 className="text-3xl font-semibold text-gray-700">Role: {user?.role}</h2>

      <form
        onSubmit={handleSubmit}
        className="card-body items-center gap-8 rounded-xl shadow-xl bg-white text-gray-800 w-full max-w-md"
      >
        <div className="w-full">
          <label className="label font-bold text-md text-gray-700 mb-2">EMAIL :</label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email"
            className="w-full bg-white border border-gray-400 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
            required
          />
        </div>

        {/* Skill Input */}
        <div className="w-full">
          <label className="label font-bold text-md mb-1 text-gray-700 mb-2">SKILLS :</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSkillAdd(e)}
              className="w-full bg-white border border-gray-400 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
            />
            <button className="btn btn-md w-1/4 btn-accent" onClick={handleSkillAdd}>
              Add
            </button>
          </div>

          {/* Display added skills */}
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, idx) => (
              <span key={idx} className="badge badge-secondary">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="ml-1 text-white hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button className="btn btn-primary w-full mt-4" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  </div>
</div>

  );
}

export default Profile;
