import { useEffect, useRef, useState } from "react";
import { CreditCard } from "lucide-react";
import { usePostPaymentMutation } from "../../redux/Payment/apiPayment";

const paymentCache = new Map<
  string,
  { clientSecret: string; publicKey: string }
>();

interface PaymentData {
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
}

export default function PaymobPayment({
  paymentData,
  onCardValidityChange,
  triggerPayRef,
  setIsPaying,
  handlePayment,
}: {
  paymentData: PaymentData;
  onCardValidityChange: (isValid: boolean) => void;
  triggerPayRef: React.MutableRefObject<(() => void) | null>;
  setIsPaying: () => void;
  handlePayment: () => void;
}) {
  const effectRan = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [postPayment, { isError: apiError }] = usePostPaymentMutation();
  const [clientSecret, setClientSecret] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= Messages from iframe ================= */
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (data.type === "CARD_VALID") {
        onCardValidityChange(data.isValid);
      }

      if (data.result === "SUCCESS") {
        await handlePayment();
        setIsPaying();
        onCardValidityChange(false);
      }

      if (data.result === "ERROR") {
        setIsPaying();
        onCardValidityChange(false);
        setError("Payment failed. Please try again.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePayment, onCardValidityChange, setIsPaying]);

  /* ================= Init payment ================= */
  useEffect(() => {
    if (effectRan.current) return;

    const initPayment = async () => {
      try {
        const cacheKey = JSON.stringify(paymentData);
        if (paymentCache.has(cacheKey)) {
          const cached = paymentCache.get(cacheKey)!;
          setClientSecret(cached.clientSecret);
          setPublicKey(cached.publicKey);
          setIsLoading(false);
          return;
        }

        const res = await postPayment(paymentData).unwrap();

        setClientSecret(res.clientSecret);
        setPublicKey(res.publicKey);

        paymentCache.set(cacheKey, {
          clientSecret: res.clientSecret,
          publicKey: res.publicKey,
        });

        localStorage.setItem(
          "orderPaymentId",
          JSON.stringify(res.orderPaymentId),
        );

        setIsLoading(false);
      } catch {
        setError("Unable to initialize payment.");
        setIsLoading(false);
      }
    };

    if (paymentData?.amount > 0) initPayment();
    effectRan.current = true;
  }, [paymentData, postPayment]);

  /* ================= Trigger pay from parent ================= */
  useEffect(() => {
    triggerPayRef.current = () => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) return;
      iframeWindow.dispatchEvent(new Event("payFromOutside"));
    };
  }, [triggerPayRef]);

  /* ================= Render ================= */
  if (isLoading) {
    const dots = Array.from({ length: 4 });
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex gap-2">
          {dots.map((_, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-(--color-pakistan) animate-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></span>
          ))}
        </div>
      </div>
    );
  }

  if (error || apiError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-3xl">
        <p className="text-red-700 text-center font-bold">
          {error || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-2 md:p-4 sm:p-6 rounded-3xl shadow-xl bg-white/40 backdrop-blur-xl border border-white/60 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-(--color-pakistan)/5 text-(--color-pakistan)">
            <CreditCard size={24} />
          </div>
          <h2 className="text-2xl font-black text-(--color-pakistan)">
            Card Selection
          </h2>
        </div>

        <iframe
          ref={iframeRef}
          key={clientSecret + publicKey}
          style={{ width: "100%", height: "315px", border: "none" }}
          srcDoc={`
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <script type="module" src="https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.js"></script>

  
</head>
<body>
  <div id="paymob-elements">
    <label class="main-label">Card Information</label>
    
    <div class="field-container">
      <div class="card-number"></div>
    </div>
    
    <div class="row">
      <div class="field-container">
        <div class="expiry"></div>
      </div>
      <div class="field-container">
        <div class="cvv"></div>
      </div>
    </div>

    <div class="field-container">
      <div class="card-holder"></div>
    </div>
  </div>

  <script type="module">
    const pixel = new Pixel({
      publicKey: "${publicKey}",
      clientSecret: "${clientSecret}",
      paymentMethods: ["card"],

      elementId: "paymob-elements",
      cardNumber: ".card-number",
      cardExpiry: ".expiry",
      cardCvv: ".cvv",
      cardHolder: ".card-holder",

      disablePay: true,
      enableSpinner: false,
      redirect: true,
      redirectUrl: "${window.location.origin}/orders",
       customStyle: {
                        Font_Family: "Cairo, sans-serif",
                        Font_Size_Label: "18",
                        Font_Size_Input_Fields: "18",
                        Font_Size_Payment_Button: "16",
                        Font_Weight_Label: 500,
                        Font_Weight_Input_Fields: 500,
                        Font_Weight_Payment_Button: 300,
                        Color_Text: "#283618",
                        Color_Text_Headings: "#283618",
                        Color_Text_Payment_Button: "#FEFAE0",
                        Color_Background_Input_Fields: "rgba(255, 255, 255, 0.5)",
                        Color_Border_Input_Fields: "#000",
                        Color_Background_Payment_Button: "#BC6C25",
                        Color_Primary: "#BC6C25",
                        Radius_Border: "16",
                        Color_Input_Fields: "rgba(255, 255, 255, 0.5)",
                        Color_Border_Payment_Button: "rgba(188, 108, 37, 0.3)",
                      },

      cardValidationChanged: (isValid) => {
        window.parent.postMessage({ type: "CARD_VALID", isValid }, "*");
      },

      onSuccess: (data) => {
        window.parent.postMessage({ result: "SUCCESS", data }, "*");
      },

      onFailure: (error) => {
        window.parent.postMessage({ result: "ERROR", error }, "*");
      }
    });

    window.addEventListener("payFromOutside", () => {
      const btn = document.querySelector("#paymob-elements button");
      if (btn) btn.click();
    });
  </script>
</body>
</html>
`}
        />
      </div>
    </div>
  );
}
