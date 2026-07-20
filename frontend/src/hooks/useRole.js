import { useSelector } from "react-redux";

const useRole = () => {
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || null;

  return {
    role,

    isAdmin: role === "admin",

    isGuru: role === "guru",

    isOrangTua: role === "orangtua",
  };
};

export default useRole;
