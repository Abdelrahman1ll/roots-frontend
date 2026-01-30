import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Crown,
  Check,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  usePatchUsersOwnerByIdMutation,
} from "../../redux/users/apiUsers";
import type { UserType } from "../../types/UserType";

/**
 * EditUserOwner: Administrative interface for editing user details from the owner's perspective.
 * تعديل المستخدم (المالك): واجهة إدارية لتعديل بيانات المستخدمين من قِبل مالك الموقع.
 */
export default function EditUserOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
    role: "",
  });

  const { data: getUsers, isLoading: isUsersLoading } = useGetUsersQuery({});
  const users: UserType[] = useMemo(() => {
    return Array.isArray(getUsers) ? getUsers : getUsers?.users || [];
  }, [getUsers]);

  useEffect(() => {
    const user = users.find((u: UserType) => Number(u.id) === Number(id));
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        birthday: user.birthday || "",
        role: user.role || "",
      });
    }
  }, [users, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [PatchUsersOwnerById, { isLoading }] = usePatchUsersOwnerByIdMutation();
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      birthday: "",
      role: "",
    };
    let isValid = true;

    if (
      userData.firstName &&
      (userData.firstName.length < 2 || userData.firstName.length > 50)
    ) {
      newErrors.firstName = "First name must be between 2 and 50 characters";
      isValid = false;
    }

    if (
      userData.lastName &&
      (userData.lastName.length < 2 || userData.lastName.length > 50)
    ) {
      newErrors.lastName = "Last name must be between 2 and 50 characters";
      isValid = false;
    }

    if (userData.phone && userData.phone.trim().length !== 11) {
      newErrors.phone = "Phone number must be 11 digits";
      isValid = false;
    }

    if (userData.birthday && new Date(userData.birthday) > new Date()) {
      newErrors.birthday = "Birthday must be a valid past date";
      isValid = false;
    }

    const validRoles = ["admin", "owner", "user"];
    if (userData.role && !validRoles.includes(userData.role)) {
      newErrors.role = "Role must be 'admin', 'owner', or 'user'";
      isValid = false;
    }

    if (userData.email && !/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await PatchUsersOwnerById({
        id,
        data: {
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          phone: userData.phone || null,
          birthday: userData.birthday || null,
          role: userData.role || null,
        },
      }).unwrap();
      toast.success("User updated successfully");
      setTimeout(() => navigate("/all-users"), 1500);
    } catch {
      toast.error("Error saving profile");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (isUsersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-(--color-pakistan) animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4 md:px-8 mt-18 overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-left mb-16 border-b border-(--color-border) pb-8"
        >
          <div className="flex items-center gap-3 text-(--color-pakistan) mb-6">
            <User size={20} />
            <span className="text-[10px] font-black tracking-widest">
              Administration Panel
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-(--color-dark) tracking-tighter mb-4">
            Edit Profile
          </h1>
          <p className="text-(--color-pakistan) font-bold tracking-widest uppercase text-[10px] opacity-60">
            Modify user credentials and system access permissions with ease.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-(--color-border) p-8 md:p-12 rounded-none"
        >
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
              {/* Role Selection - Priority Full Width */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                  System Role
                </label>
                <RoleDropdown
                  value={userData.role}
                  onChange={(val) => {
                    setUserData((prev) => ({ ...prev, role: val }));
                    if (errors.role)
                      setErrors((prev) => ({ ...prev, role: "" }));
                  }}
                />
                {errors.role && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Main Fields - Pairs Grid (2x2x1) */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-black text-(--color-dark) text-sm tracking-widest placeholder:text-gray-300"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-black text-(--color-dark) text-sm tracking-widest placeholder:text-gray-300"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark) opacity-20" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-16 pr-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-black text-(--color-dark) text-sm tracking-widest placeholder:text-gray-300"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark) opacity-20" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      placeholder="01234567890"
                      className="w-full pl-16 pr-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-black text-(--color-dark) text-sm tracking-widest placeholder:text-gray-300"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-(--color-pakistan) tracking-[0.2em] opacity-40">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-dark) opacity-20" />
                    <input
                      type="date"
                      name="birthday"
                      value={
                        userData.birthday ? userData.birthday.split("T")[0] : ""
                      }
                      onChange={handleChange}
                      className="w-full pl-16 pr-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-black text-(--color-dark) text-sm tracking-widest"
                    />
                  </div>
                  {errors.birthday && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.birthday}
                    </p>
                  )}
                </div>
              </div>

              {/* Secure Footer Info */}
              <div className="p-6 bg-(--color-gray-soft) border border-(--color-border) text-[10px] font-bold text-(--color-pakistan) leading-loose tracking-widest text-center opacity-40">
                Confirming changes will update the user's primary credentials
                across our entire boutique network.
              </div>
            </div>

            {/* Submit Section */}
            <motion.div variants={itemVariants} className="pt-8">
              <motion.button
                whileHover={!isLoading ? { opacity: 0.9 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                type="submit"
                className={`w-full flex items-center justify-center gap-3 text-white font-black tracking-widest text-[11px] py-6 rounded-none shadow-none transition-all relative overflow-hidden group
                 ${
                   isLoading
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-(--color-dark) hover:bg-black cursor-pointer"
                 }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>SAVE USER PROFILE</>
                )}
              </motion.button>

              <p className="text-center mt-8 text-[9px] font-black text-(--color-pakistan) tracking-widest opacity-20">
                Secure Administrative Action
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * RoleDropdown: Custom dropdown for role selection with icons and descriptions.
 */
const RoleDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: "user",
      label: "Standard User",
      desc: "Browsing & Ordering",
      icon: <User size={18} />,
    },
    {
      id: "admin",
      label: "System Admin",
      desc: "Resource Management",
      icon: <ShieldCheck size={18} />,
    },
    {
      id: "owner",
      label: "Platform Owner",
      desc: "Financial Control",
      icon: <Crown size={18} />,
    },
  ];

  const selectedRole = roles.find((r) => r.id === value) || roles[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white border border-(--color-border) rounded-none focus:outline-none focus:border-(--color-dark) transition-all font-bold text-(--color-dark) text-sm tracking-widest cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="text-(--color-dark)">{selectedRole.icon}</div>
          <span className="uppercase">{selectedRole.label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-(--color-dark) transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-(--color-border) rounded-none shadow-2xl p-2"
            >
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-none transition-all text-left group ${
                    value === role.id
                      ? "bg-(--color-dark) text-white"
                      : "hover:bg-(--color-gray-soft) text-(--color-dark)"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-none transition-colors ${
                        value === role.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-(--color-dark) group-hover:bg-white"
                      }`}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <p className="font-bold text-xs tracking-widest uppercase">
                        {role.label}
                      </p>
                      <p
                        className={`text-[9px] font-bold tracking-widest mt-0.5 ${
                          value === role.id ? "text-white/60" : "opacity-40"
                        }`}
                      >
                        {role.desc}
                      </p>
                    </div>
                  </div>
                  {value === role.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white/20 p-1 rounded-none text-white"
                    >
                      <Check size={14} strokeWidth={4} />
                    </motion.div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
