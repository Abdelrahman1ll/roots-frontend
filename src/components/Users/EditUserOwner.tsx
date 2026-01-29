import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  CheckCircle,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,var(--color-tiger-10),transparent),radial-gradient(circle_at_bottom_left,var(--color-pakistan-10),transparent)]">
        <Loader2 className="w-12 h-12 text-(--color-tiger) animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--color-tiger-10),transparent),radial-gradient(circle_at_bottom_left,var(--color-pakistan-10),transparent)] flex flex-col items-center py-12 px-4 md:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Navigation */}

        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-6 md:mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-(--color-pakistan)/5 border border-(--color-pakistan)/10 text-(--color-pakistan) mb-4">
            <User size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Administration Panel
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-(--color-pakistan) tracking-tight mb-4">
            Edit Profile
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium max-w-lg mx-auto leading-relaxed">
            Modify user credentials and system access permissions with ease.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-2xl border border-white/60 p-5 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
        >
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
              {/* Role Selection - Priority Full Width */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
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
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Main Fields - Pairs Grid (2x2x1) */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-4 pr-10 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                    />
                    <CheckCircle
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${
                        userData.firstName.length >= 2
                          ? "opacity-100 scale-100 text-green-500"
                          : "opacity-0 scale-50"
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-4 pr-10 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                    />
                    <CheckCircle
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${
                        userData.lastName.length >= 2
                          ? "opacity-100 scale-100 text-green-500"
                          : "opacity-0 scale-50"
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-tiger)" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-tiger)" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      placeholder="01234567890"
                      className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="col-span-2 space-y-1.5 focus-within:z-10">
                  <label className="text-xs font-black text-(--color-pakistan)/70 uppercase tracking-widest ml-1">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-tiger)" />
                    <input
                      type="date"
                      name="birthday"
                      value={
                        userData.birthday ? userData.birthday.split("T")[0] : ""
                      }
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) shadow-sm appearance-none"
                    />
                  </div>
                  {errors.birthday && (
                    <p className="text-red-500 text-[10px] font-bold ml-1">
                      {errors.birthday}
                    </p>
                  )}
                </div>
              </div>

              {/* Secure Footer Info */}
              <div className="p-4 bg-(--color-pakistan)/5 border border-(--color-pakistan)/10 rounded-2xl text-[11px] font-medium text-(--color-pakistan)/60 leading-relaxed italic text-center">
                "Confirming changes will update the user's primary credentials
                across our entire boutique network."
              </div>
            </div>

            {/* Submit Section */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={
                  !isLoading
                    ? {
                        scale: 1.01,
                        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
                      }
                    : {}
                }
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                type="submit"
                className={`w-full flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl shadow-xl transition-all relative overflow-hidden group
                 ${
                   isLoading
                     ? "bg-(--color-earth) cursor-not-allowed"
                     : "bg-linear-to-r from-(--color-tiger) to-(--color-earth) hover:opacity-90 cursor-pointer"
                 }`}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Save User Profile</>
                )}
              </motion.button>

              <p className="text-center mt-6 text-[10px] font-bold text-(--color-pakistan)/30 uppercase tracking-[0.3em]">
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
      desc: "Can browse products & place orders",
      icon: <User size={18} />,
    },
    {
      id: "admin",
      label: "System Admin",
      desc: "Can manage products & basic user data",
      icon: <ShieldCheck size={18} />,
    },
    {
      id: "owner",
      label: "Platform Owner",
      desc: "Full administrative & financial access",
      icon: <Crown size={18} />,
    },
  ];

  const selectedRole = roles.find((r) => r.id === value) || roles[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-4 pr-4 py-2.5 sm:py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-tiger)/20 focus:bg-white transition-all font-bold text-(--color-pakistan) shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-(--color-tiger)">{selectedRole.icon}</div>
          <span>{selectedRole.label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-(--color-tiger) transition-transform ${
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
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl p-2 overflow-hidden"
            >
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                    value === role.id
                      ? "bg-(--color-tiger) text-white shadow-md shadow-(--color-tiger)/20"
                      : "hover:bg-white text-(--color-pakistan)/80"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        value === role.id
                          ? "bg-white/20 text-white"
                          : "bg-(--color-pakistan)/5 text-(--color-pakistan) group-hover:bg-(--color-tiger) group-hover:text-white"
                      }`}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <p
                        className={`font-black text-sm tracking-tight ${
                          value === role.id
                            ? "text-white"
                            : "text-(--color-pakistan)"
                        }`}
                      >
                        {role.label}
                      </p>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          value === role.id
                            ? "text-white/60"
                            : "text-(--color-pakistan)/40"
                        }`}
                      >
                        {role.desc}
                      </p>
                    </div>
                  </div>
                  {value === role.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/20 p-1 rounded-full text-white"
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
