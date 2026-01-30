import { useGetCartQuery } from "../../redux/Cart/apiCart";
import { useNavigate } from "react-router-dom";
import { usePostValidateDiscountCodeMutation } from "../../redux/DiscountCodes/apiDiscountCodes";
import { useGetDeliveryQuery } from "../../redux/Delivery/apiDelivery";
import {
  useGetUserOrdersQuery,
  usePostOrdersMutation,
} from "../../redux/Orders/apiOrders";
import { toast } from "react-toastify";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import egyptGovernorates from "../../data/egyptGovernorates.json";
import { AuthContext } from "../../context/AuthContext";
import { EGYPTIAN_PHONE_REGEX } from "../../utils/validators";
import { detectUserGovernorate } from "../../utils/location";
import ttsMP3 from "/ttsMP3.com_VoiceText_2025-11-19_2-28-51.mp3";
const audio = new Audio(ttsMP3);
const close = [
  "Cairo",
  "Giza",
  "Qalyubia",
  "Gharbia",
  "Monufia",
  "Dakahlia",
  "Sharqia",
  "Beheira",
  "Kafr El Sheikh",
  "Fayoum",
  "Beni Suef",
  "Ismailia",
  "Suez",
  "Damietta",
  "Port Said",
];
const farAway = [
  "Alexandria",
  "Matruh",
  "Red Sea",
  "New Valley",
  "North Sinai",
  "South Sinai",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
];
/**
 * useCheckout hook manages the complex multi-step checkout process.
 * هوك useCheckout يدير عملية الدفع المتعددة الخطوات والمعقدة.
 */
export default function useCheckout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // state variables for form inputs and process status
  // متغيرات الحالة لمدخلات النموذج وحالة العملية
  const [paymentMethod, setPaymentMethod] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openSection, setOpenSection] = useState(""); // Which checkout section is expanded | أي قسم في الدفع مفتوح حالياً
  const [saveAddress, setSaveAddress] = useState(false); // Should address be saved locally? | هل يجب حفظ العنوان محلياً؟
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for governorate dropdown | حالة قائمة المحافظات المنسدلة
  const [search, setSearch] = useState(""); // Search term for governorates | كلمة البحث للمحافظات
  const [isCardValid, setIsCardValid] = useState(false); // Validation for credit card | صحة بيانات البطاقة الائتمانية
  const [isPaying, setIsPaying] = useState(false); // Payment processing status | حالة معالجة الدفع
  const [isDetectingLocation, setIsDetectingLocation] = useState(false); // State for location detection | حالة الكشف عن الموقع
  const [isOrderCompleted, setIsOrderCompleted] = useState(false); // Flag for successful completion
  const payRef = useRef<(() => void) | null>(null); // Ref for triggering payment iframe | مرجع لتشغيل إطار الدفع

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    state: "",
    addressDetails: "",
    phone1: "",
    phone2: "",
    paymentMethod: "",
  });

  // Sync user email if available
  // مزامنة البريد الإلكتروني للمستخدم إذا كان موجوداً
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: user?.role !== "user",
  });
  const { data: delivery } = useGetDeliveryQuery(undefined);
  const [validateDiscountCode] = usePostValidateDiscountCodeMutation();
  const [postOrders, { isLoading: orderLoading }] = usePostOrdersMutation();
  const { refetch } = useGetUserOrdersQuery(undefined);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [rawDeliveryFee, setRawDeliveryFee] = useState(0);

  /**
   * Internal check for form validity without updating UI errors.
   * تحقق داخلي من صحة النموذج دون تحديث أخطاء واجهة المستخدم.
   */
  const checkIsValid = useCallback(() => {
    const isFirstNameValid = !!firstName;
    const isLastNameValid = !!lastName;
    const isStateValid = !!state;
    const isAddressValid = !!addressDetails;
    const isPhone1Valid = !!(phone1 && EGYPTIAN_PHONE_REGEX.test(phone1));
    const isPhone2Valid = !phone2 || EGYPTIAN_PHONE_REGEX.test(phone2);

    return (
      isFirstNameValid &&
      isLastNameValid &&
      isStateValid &&
      isAddressValid &&
      isPhone1Valid &&
      isPhone2Valid
    );
  }, [firstName, lastName, state, addressDetails, phone1, phone2]);

  /**
   * Validates the checkout form fields and updates the error state.
   * وظيفة للتحقق من صحة حقول نموذج الدفع وتحديث حالة الأخطاء.
   */
  const Validate = () => {
    const newErrors: typeof errors = { ...errors };
    if (!firstName) newErrors.firstName = "Please enter your first name";
    if (!lastName) newErrors.lastName = "Please enter your last name";
    if (!state) newErrors.state = "Please select your state or city";
    if (!addressDetails)
      newErrors.addressDetails = "Please enter address details";

    if (!phone1) {
      newErrors.phone1 = "Please enter your phone number";
    } else if (!EGYPTIAN_PHONE_REGEX.test(phone1)) {
      newErrors.phone1 = "Please enter a valid Egyptian phone number";
    }

    if (phone2 && !EGYPTIAN_PHONE_REGEX.test(phone2)) {
      newErrors.phone2 = "Please enter a valid Egyptian phone number";
    }

    setErrors(newErrors);
    return checkIsValid();
  };

  /**
   * Automatically detects the user's governorate and updates the state.
   * يقوم تلقائياً بالكشف عن محافظة المستخدم وتحديث الحالة.
   */
  const handleAutoLocation = useCallback(async () => {
    if (state && addressDetails) return; // Don't overwrite if both are already set
    setIsDetectingLocation(true);
    try {
      const result = await detectUserGovernorate();
      if (result) {
        if (!state && result.state) {
          setState(result.state);
          setErrors((prev) => ({ ...prev, state: "" }));
        }
      }
    } finally {
      setIsDetectingLocation(false);
    }
  }, [state, addressDetails]);

  /**
   * Loads saved address data from localStorage on component mount.
   * استعادة بيانات العنوان المحفوظة من التخزين المحلي عند تحميل المكون.
   */
  useEffect(() => {
    const saved = localStorage.getItem("checkoutAddress");
    if (saved) {
      const data = JSON.parse(saved);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setState(data.state || "");
      setAddressDetails(data.addressDetails || "");
      setPhone1(data.phone1 || "");
      setPhone2(data.phone2 || "");
      setSaveAddress(true);
    } else {
      // If no saved address, try to detect location
      handleAutoLocation();
    }
  }, [handleAutoLocation]);

  /**
   * Automatically saves or removes address data in localStorage based on 'saveAddress' state.
   * يقوم تلقائياً بحفظ أو حذف بيانات العنوان في التخزين المحلي بناءً على رغبة المستخدم.
   */
  useEffect(() => {
    if (saveAddress) {
      const isValid = checkIsValid();
      if (!isValid) return;
      localStorage.setItem(
        "checkoutAddress",
        JSON.stringify({
          firstName,
          lastName,
          state,
          addressDetails,
          phone1,
          phone2,
        }),
      );
    } else {
      localStorage.removeItem("checkoutAddress");
    }
  }, [
    saveAddress,
    checkIsValid,
    firstName,
    lastName,
    state,
    addressDetails,
    phone1,
    phone2,
  ]);

  const deliveryData = delivery?.deliveries?.find(
    (d: { id: number }) => d.id === 1,
  );
  const isFirstOrder: boolean = data?.carts?.thIsIsYourFirstOrder;
  const freeDelivery: boolean = deliveryData?.freeDelivery;
  const PROFILE: boolean = data?.carts?.user.PROFILE;
  const BIRTHDAY: boolean = data?.carts?.user.BIRTHDAY;
  const LIGHTMASTER: boolean = data?.carts?.user.LIGHTMASTER;

  /**
   * Calculates the final total amount after applying discounts and delivery fees.
   * حساب المبلغ الإجمالي النهائي بعد تطبيق الخصومات ومصاريف التوصيل.
   */
  const subtotal = data?.carts?.total || 0;
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount + deliveryFee;

  /**
   * Filters the list of Egyptian governorates based on user search input.
   * تصفية قائمة المحافظات المصرية بناءً على بحث المستخدم.
   */
  const filteredStates = egyptGovernorates.filter((gov) =>
    gov.toLowerCase().includes(search.toLowerCase()),
  );

  /**
   * Calculates delivery fee based on selected state (Cairo/Giza vs Far-away).
   * حساب مصاريف التوصيل بناءً على المحافظة المختارة (القاهرة والجيزة مقابل المحافظات البعيدة).
   */
  useEffect(() => {
    if (!deliveryData) return;

    let fee = 0;
    if (close.includes(state)) {
      fee = deliveryData.deliveryPriceClose;
    } else if (farAway.includes(state)) {
      fee = deliveryData.deliveryPriceFar;
    } else {
      fee = deliveryData.deliveryPriceClose;
    }

    setRawDeliveryFee(fee);

    if (isFirstOrder || freeDelivery) {
      setDeliveryFee(0);
    } else {
      setDeliveryFee(fee);
    }
  }, [state, deliveryData, isFirstOrder, freeDelivery]);

  /**
   * Applies a promo code and handles special rules for PROFILE and BIRTHDAY codes.
   * تطبيق كود الخصم والتعامل مع القواعد الخاصة لأكواد "PROFILE" و "BIRTHDAY".
   */
  const applyDiscount = async () => {
    try {
      const response = await validateDiscountCode({ code: promoCode }).unwrap();

      // Check if codes are restricted based on user status
      // التحقق من صلاحية الأكواد بناءً على حالة المستخدم (هل تم استخدامها من قبل؟)
      if (response?.discountCode.code === "PROFILE" && PROFILE === false) {
        setDiscount(0);
        setErrorMsg("The PROFILE code has already been used");
        return;
      }

      if (response?.discountCode.code === "BIRTHDAY" && BIRTHDAY === false) {
        setDiscount(0);
        setErrorMsg("The BIRTHDAY code has already been used");
        return;
      }

      if (
        response?.discountCode.code === "LIGHTMASTER" &&
        LIGHTMASTER === false
      ) {
        setDiscount(0);
        setErrorMsg("The LIGHTMASTER code has already been used");
        return;
      }

      setDiscount(response?.discountCode?.discount);
      setCode(response?.discountCode?.code);
      setErrorMsg("");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setErrorMsg(err?.data?.message || "Error applying discount");
    }
  };

  /**
   * Selects a payment method and manages section animations/visibility.
   * اختيار وسيلة الدفع وإدارة ظهور الأقسام المختلفة.
   */
  const handleSelectMethod = (method: string) => {
    setOpenSection((prev) => {
      if (prev === method) {
        setPaymentMethod("");
        setErrors((e) => ({ ...e, paymentMethod: "" }));
        return "";
      } else {
        setPaymentMethod(method);
        setErrors((e) => ({ ...e, paymentMethod: "" }));
        return method;
      }
    });
  };

  /**
   * Main function to handle order placement.
   * Validates form, checks cart status, and posts the order to the API.
   * وظيفة أساسية لمعالجة تأكيد الطلب.
   * تتحقق من النموذج، حالة السلة، وترسل الطلب للواجهة البرمجية.
   */
  const handlePayment = async () => {
    const isValid = Validate();
    if (!isValid) return;

    // Check if a payment method is selected | التأكد من اختيار وسيلة دفع
    if (!paymentMethod) {
      setErrors({ ...errors, paymentMethod: "Please select a payment method" });
      return;
    }

    // Ensure the cart is not empty | التأكد من أن السلة ليست فارغة
    if (data?.carts?.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create order via API | إنشاء الطلب عبر الواجهة البرمجية
      await postOrders({
        cart: data?.carts?.id,
        discountCode: code ? code : null,
        addresses: {
          fullName: firstName,
          lastName: lastName,
          address: addressDetails,
          city: state,
          country: "Egypt",
          phone: phone1,
          phoneOptional: phone2,
        },
        paymentMethod: paymentMethod,
        paymentId:
          paymentMethod === "credit_card"
            ? Number(localStorage.getItem("orderPaymentId"))
            : 0,
      }).unwrap();

      // Reset state and provide feedback | إعادة تعيين الحالة وتنبيه المستخدم
      setPaymentMethod("");
      setCode("");
      setIsOrderCompleted(true);
      toast.success("Order placed successfully");

      if (paymentMethod === "credit_card") {
        localStorage.removeItem("orderPaymentId");
      }

      // Navigate to orders page
      setTimeout(() => {
        navigate("/orders");
      }, 500);

      // Play success notification safely
      try {
        audio.play().catch(() => {});
      } catch (e) {}

      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      // Handle domain-specific errors like reused codes | معالجة أخطاء محددة كالأكواد المستعملة سابقاً
      if (err?.data?.message === "Discount code already used for PROFILE") {
        setErrorMsg("The PROFILE code has already been used");
        setDiscount(0);
        setCode("");
        return;
      } else if (
        err?.data?.message === "Discount code already used for BIRTHDAY"
      ) {
        setErrorMsg("The BIRTHDAY code has already been used");
        setDiscount(0);
        setCode("");
        return;
      }
      toast.error(err?.data?.message || "Error placing order");
    }
  };

  return {
    discount,
    errorMsg,
    openSection,
    errors,
    applyDiscount,
    handleSelectMethod,
    handlePayment,
    deliveryFee,
    finalTotal,
    setPromoCode,
    isLoading,
    orderLoading,
    paymentMethod,
    promoCode,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    state,
    setState,
    addressDetails,
    setAddressDetails,
    phone1,
    setPhone1,
    phone2,
    setPhone2,
    data,
    setErrors,
    navigate,
    isFirstOrder,
    filteredStates,
    setSearch,
    setIsDropdownOpen,
    isDropdownOpen,
    search,
    saveAddress,
    setSaveAddress,
    email,
    isCardValid,
    setIsCardValid,
    setIsPaying,
    isPaying,
    payRef,
    isDetectingLocation,
    handleAutoLocation,
    rawDeliveryFee,
    freeDelivery,
    isOrderCompleted,
  };
}
