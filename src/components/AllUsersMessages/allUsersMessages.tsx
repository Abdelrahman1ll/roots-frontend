import { useState } from "react";
import { motion } from "framer-motion";
import { useSendEmailMutation } from "../../redux/Email/apiEmail";
import { toast } from "react-toastify";
import { Send, Megaphone } from "lucide-react";

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
    <div className="relative min-h-screen py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Megaphone size={18} className="text-black" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/70">
              Communication Hub
            </span>
          </div>
          <h1 className="text-5xl font-light text-black tracking-tight mb-4">
            Broadcast message
          </h1>
          <p className="text-black/70 text-base max-w-lg leading-relaxed">
            Send important updates and newsletters to all your customers. Ensure
            your message aligns with the brand voice.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-black/10 p-8 md:p-12 shadow-sm"
        >
          <div className="flex flex-col gap-10">
            {/* Subject Input */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Subject line
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. New Collection Available"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-0 py-4 border-b-2 border-black/10 focus:border-black outline-none transition-all text-xl text-black placeholder:text-black/30 bg-transparent font-medium"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-black uppercase tracking-wider">
                Message content
              </label>
              <div className="relative">
                <textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-0 py-4 border-b-2 border-black/10 focus:border-black outline-none transition-all text-lg text-black placeholder:text-black/30 bg-transparent resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-black text-lg font-bold py-3 border-l-4 border-black pl-6 bg-black/5"
              >
                Message sent successfully to all customers.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-lg font-bold py-3 border-l-4 border-red-600 pl-6 bg-red-50"
              >
                {error}
              </motion.div>
            )}

            {/* Send Button */}
            <div className="pt-6">
              <motion.button
                onClick={handleSendMessage}
                disabled={isLoading || !subject || !message}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="px-12 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} />
                    Send broadcast
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
