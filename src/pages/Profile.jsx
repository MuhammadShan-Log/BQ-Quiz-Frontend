import { useEffect, useState } from "react";
import UpdateProfileForm from "../components/UpdateProfileForm";
import Loading from "../components/Loading";
import api from "../utils/api";
import { message } from "antd";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loading/>

  return <UpdateProfileForm user={user} />;
};

export default Profile;
