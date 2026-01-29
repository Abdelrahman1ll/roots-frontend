import { useState } from "react";
import { motion } from "framer-motion";
import { useSendEmailMutation } from "../../redux/Email/apiEmail";
import { toast } from "react-toastify";
import { Mail, MessageSquareText, Send, Megaphone } from "lucide-react";

export default function AllUsersMessages() {
  const [sendEmail, { isLoading }] = useSendEmailMutation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!subject || !message) {
      setError("Please enter a subject and message.");
      return;
    }

    setSuccess(false);
    setError("");

    try {
      await sendEmail({ subject, message }).unwrap();
      setSuccess(true);
      setMessage("");
      setSubject("");
      toast.success("Email sent successfully!");
    } catch {
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen py-10 px-4">
      {/* Dynamic Radial Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(188,108,37,0.1)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(96,108,56,0.05)_0%,transparent_50%)]" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-(--color-tiger) font-black text-xs uppercase tracking-widest mb-4">
            <Megaphone size={14} />
            Communication Hub
          </div>
          <h1 className="text-4xl font-black text-(--color-pakistan) tracking-tight mb-2">
            Broadcast Message
          </h1>
          <p className="text-(--color-pakistan)/60 font-medium font-['Outfit']">
            Send important updates and newsletters to all your customers
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl p-8 sm:p-10"
        >
          <div className="flex flex-col gap-6">
            {/* Subject Input */}
            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Subject Line
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Big Summer Sale Starts Now!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner"
                />
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-(--color-pakistan)/60 ml-2">
                Message Content
              </label>
              <div className="relative">
                <textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-white/60 focus:bg-white/80 focus:border-(--color-tiger) outline-none transition-all font-bold text-(--color-pakistan) placeholder:text-(--color-pakistan)/30 shadow-inner resize-none"
                />
                <MessageSquareText
                  size={20}
                  className="absolute left-4 top-6 text-(--color-pakistan)/40 group-focus-within:text-(--color-tiger) transition-colors"
                />
              </div>
            </div>

            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-500/10 text-green-700 p-4 rounded-xl text-center font-bold border border-green-500/20"
              >
                Message sent successfully to all customers!
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 text-red-600 p-4 rounded-xl text-center font-bold border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {/* Send Button */}
            <motion.button
              onClick={handleSendMessage}
              disabled={isLoading || !subject || !message}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-(--color-tiger) to-(--color-earth) text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-(--color-tiger)/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Sending Broadcast..."
              ) : (
                <>
                  <Send size={16} />
                  Send to All Customers
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
