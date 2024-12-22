import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../assets/logo.png";
import { FaCheck, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import instance from "../utils";

const UserProfile = () => {
  // 使用 useSelector 钩子访问 Redux 中的用户状态
  const user = useSelector((state: RootState) => state.user.user);
  const [avatar, setAvatar] = useState(Avatar);
  const [name, setName] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      // 上传头像
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await instance.post("/users/change-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          setAvatar(url);
          setIsEditing(!isEditing);
        }
      } catch (error) {
        setError(String(error));
      }
    }
  };

  return (
    <section className="profile py-8 px-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <Link
          to="/myposts/sdfsdf"
          className="btn bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300 mb-4 inline-block"
        >
          My posts
        </Link>
        <div className="profile__details text-center relative">
          <div className="avatar__wrapper mb-4 w-32 h-32 mx-auto relative">
            <div className="profile__avatar rounded-full border-4 border-gray-300 relative overflow-hidden">
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 right-1">
              <label
                htmlFor="avatar"
                className="inline-block cursor-pointer bg-white p-2 rounded-full shadow-md text-orange-500 hover:text-orange-600 transition duration-300"
              >
                {isEditing ? <FaCheck /> : <FaEdit />}
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleAvatarChange}
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">{name || "User"}</h1>
          {error && (
            <p className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-center mb-4">
              {error}
            </p>
          )}
          <form action="" className="form space-y-4">
            <label className="block text-left">
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              />
            </label>
            <label className="block text-left">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              />
            </label>
            <label className="block text-left">
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              />
            </label>
            <label className="block text-left">
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              />
            </label>
            <label className="block text-left">
              Confirm New Password:
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
