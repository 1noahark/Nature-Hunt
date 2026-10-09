import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const Explanation = ({ title, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function generateResponse() {
      setLoading(true);
      setMessage("");
      setError("");

      const data = {
        model: "gemma3:1b-it-q4_K_M",
        messages: [
          {
            role: "user",
            content: `Don't use markdown. Explain this to me: ${title}`,
          },
        ],
        stream: false,
      };

      try {
        const res = await axios.post(
          "http://localhost:11434/api/chat",
          data,
          { signal: controller.signal }
        );

        setMessage(res.data.message.content);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError("Failed to generate an explanation. Check that Ollama is running.");
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (title) {
      generateResponse();
    }

    return () => controller.abort();
  }, [title]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <IoMdClose />
        </button>

        <h2>Explain</h2>

        <p>{title}</p>

        <div className="explanation">
          {loading && <p>Generating explanation...</p>}
          {error && <p>{error}</p>}
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Explanation;