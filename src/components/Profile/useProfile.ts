import { usePatchUsersByIdMutation } from "../../redux/users/apiUsers";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import { usePostValidateDiscountCodeMutation } from "../../redux/DiscountCodes/apiDiscountCodes";
import { AuthContext } from "../../context/AuthContext";
import { EGYPTIAN_PHONE_REGEX } from "../../utils/validators";
/**
 * useProfile hook manages the user's profile information, validation, and completion rewards.
 * هوك useProfile يدير معلومات الملف الشخصي للمستخدم، عمليات التحقق، ومكافآت إكمال البيانات.
 */
export default function useProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    PROFILE: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthday: "",
  });

  const [validateDiscountCode] = usePostValidateDiscountCodeMutation();
  const [progress, setProgress] = useState(20);
  const [rewardVisible, setRewardVisible] = useState(false);
  const [reward, setReward] = useState({ code: "", discount: 0 });

  /**
   * Syncs internal state with the global user context on mount or change.
   * يقوم بمزامنة الحالة الداخلية مع سياق المستخدم العام عند التحميل أو التغيير.
   */
  useEffect(() => {
    if (user) {
      setUserData({
        id: String(user.id) || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        birthday: user.birthday || "",
        PROFILE: user.PROFILE || false,
      });
    }
  }, [user]);

  // Completion check variables
  // ... (keeping comments if needed, but these are unused now)

  /**
   * Effect to calculate profile completion percentage and check for eligible rewards.
   * تأثير برمجي لحساب نسبة اكتمال الملف الشخصي والتحقق من الاستحقاق للمكافأة.
   */
  useEffect(() => {
    const { firstName, lastName, phone, birthday, PROFILE } = userData;

    // Calculate progress based on filled fields | حساب التقدم بناءً على الحقول المكتملة
    const fields = { firstName, lastName, phone, birthday };
    const filledCount = Object.values(fields).filter(Boolean).length;
    const completion = 20 + filledCount * 20;
    setProgress(completion);

    /**
     * Checks if the profile is fully complete to offer a "PROFILE" discount code.
     * يتحقق مما إذا كان الملف الشخصي مكتملاً تماماً لعرض كود الخصم.
     */
    const checkReward = async () => {
      const isProfileComplete =
        firstName && lastName && phone && birthday && PROFILE === true;

      if (!isProfileComplete) {
        setRewardVisible(false);
        return;
      }

      // Avoid redundant calls if already visible | تجنب المكالمات المتكررة إذا كان المكافأة مرئية بالفعل
      if (rewardVisible) return;

      try {
        const response = await validateDiscountCode({
          code: "PROFILE",
        }).unwrap();

        if (response?.discountCode) {
          setReward({
            code: response.discountCode.code,
            discount: response.discountCode.discount,
          });
          setRewardVisible(true);
        }
      } catch {
        setRewardVisible(false);
      }
    };

    checkReward();
  }, [userData, validateDiscountCode, rewardVisible]);

  const [patchUsers, { isLoading }] = usePatchUsersByIdMutation();

  /**
   * Handles saving the profile updates after validation.
   * يدير عملية حفظ تحديثات الملف الشخصي بعد التحقق من صحتها.
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { firstName: "", lastName: "", phone: "", birthday: "" };
    let isValid = true;

    // Validation logic for name and phone | منطق التحقق للاسم والهاتف
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

    if (userData.phone && !EGYPTIAN_PHONE_REGEX.test(userData.phone)) {
      newErrors.phone = "Phone number must be 11 valid digits";
      isValid = false;
    }

    // Age validation (minimum 10 years old) | التحقق من العمر (على الأقل 10 سنوات)
    if (userData.birthday) {
      const birthday = new Date(userData.birthday);
      const today = new Date();
      if (birthday >= today) {
        newErrors.birthday = "Birthday must be a valid past date";
        isValid = false;
      } else {
        let age = today.getFullYear() - birthday.getFullYear();
        const monthDiff = today.getMonth() - birthday.getMonth();
        const dayDiff = today.getDate() - birthday.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
        if (age < 10) {
          newErrors.birthday =
            "Birthday indicates an age below the allowed minimum";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    if (!isValid) return;

    const id = Number(userData.id);
    try {
      // Patching the user data via API | تحديث بيانات المستخدم عبر الواجهة البرمجية
      await patchUsers({
        id,
        data: {
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          phone: userData.phone || null,
          birthday: userData.birthday || null,
        },
      }).unwrap();

      toast.success("Profile saved successfully");

      // Update the global auth context with new data | تحديث السياق العالمي بالبيانات الجديدة
      setUser({
        ...user!,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        birthday: userData.birthday,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Error saving profile");
    }
  };

  /**
   * Generic handler for input field changes.
   * وظيفة عامة لمعالجة التغييرات في حقول الإدخال.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    userData,
    handleChange,
    handleSave,
    progress,
    errors,
    isLoading,
    rewardVisible,
    reward,
  };
}
