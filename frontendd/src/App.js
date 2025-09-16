import { useState, useEffect } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [debouncedText, setDebouncedText] = useState("");

  // 🔹 Debounce input (wait 500ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(inputText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputText]);

  // 🔹 Call API whenever debounced text changes
  useEffect(() => {
    const fetchPassive = async () => {
      if (!debouncedText.trim()) {
        setResult("");
        return;
      }

      try {
        const res = await fetch("https://voice-converter-omega.vercel.app/api/rephrase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: debouncedText }),
        });

        const data = await res.json();
        if (data.passiveText) {
          setResult(data.passiveText);
        } else {
          setResult("No passive form found.");
        }
      } catch (err) {
        console.error("Error fetching passive text:", err);
        setResult("Error contacting server.");
      }
    };

    fetchPassive();
  }, [debouncedText]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Active → Passive Converter</h2>
      <textarea
        rows="4"
        cols="50"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter active voice sentence"
      />
      <h3>Passive Voice:</h3>
      <p>{result}</p>
    </div>
  );
}

export default App;
