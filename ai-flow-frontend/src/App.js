import React, { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const nodes = [
    {
      id: "1",
      position: { x: 100, y: 150 },
      data: {
        label: (
          <div className="node-box">
            <h3>Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt..."
              className="textarea"
            />
          </div>
        )
      }
    },
    {
      id: "2",
      position: { x: 450, y: 150 },
      data: {
        label: (
          <div className="node-box">
            <h3>Output</h3>
            <div className="output-box">
              {loading ? "Thinking..." : output || "Result will appear here"}
            </div>
          </div>
        )
      }
    }
  ];

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true
    }
  ];

  const runFlow = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/ask-ai", {
        prompt: input
      });

      setOutput(res.data.answer);
    } catch (err) {
      alert("Error fetching AI response");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await axios.post("http://localhost:5000/api/save", {
        prompt: input,
        response: output
      });

      alert("Saved successfully!");
    } catch {
      alert("Save failed");
    }
  };

  return (
    <div className="container">
      <h1 className="title">AI Flow App</h1>

      <div className="button-group">
        <button className="btn run-btn" onClick={runFlow} disabled={loading}>
          Run Flow
        </button>

        <button className="btn save-btn" onClick={saveData}>
          Save
        </button>
      </div>

      <div className="flow-container">
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
    </div>
  );
}

export default App;