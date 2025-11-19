import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});

  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const handleAnalyze = async () => {
    try {
      if (!query.trim()) {
        setSummary("Please enter at least one location.");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/realestate/?location=${query}`
      );

      const data = Array.isArray(response.data.realestate)
        ? response.data.realestate
        : [];

      const areas = query
        .split(",")
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a.length > 0);

      const datasets = areas.map((area) => {
        const filtered = data.filter(
          (item) =>
            String(item["final location"] || "").trim().toLowerCase() === area
        );

        const years = filtered.map((i) => i.year);
        const prices = filtered.map((i) =>
          Number(i["flat - weighted average rate"] || 0)
        );

        return {
          label: area.toUpperCase(),
          data: prices,
          borderColor: getRandomColor(),
          backgroundColor: "transparent",
        };
      });

      const allYears = [...new Set(data.map((i) => i.year))].sort();

      setChartData({
        labels: allYears,
        datasets: datasets,
      });

      setTableData(data);
      setSummary(response.data.summary || "Analysis completed.");

    } catch (error) {
      console.error(error);
      setSummary("Error fetching data from backend.");
      setTableData([]);
      setChartData({});
    }
  };

  const downloadCSV = () => {
    if (tableData.length === 0) return;

    const csvRows = [
      ["Year", "Area", "Price", "Demand", "Size (sqft)"],
      ...tableData.map((item) => [
        item.year,
        item["final location"],
        item["flat - weighted average rate"],
        item["total sold - igr"],
        item["total carpet area supplied (sqft)"],
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "realestate_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-5">
      <h2>Real Estate Analysis Chatbot</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter areas (comma-separated)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="btn btn-primary mb-3 me-2" onClick={handleAnalyze}>
        Analyze
      </button>

      <button className="btn btn-success mb-3" onClick={downloadCSV}>
        Download CSV
      </button>

      {summary && <div className="alert alert-info">{summary}</div>}

      {chartData.labels && chartData.labels.length > 0 && (
        <Line data={chartData} />
      )}

      {tableData.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Year</th>
              <th>Area</th>
              <th>Price</th>
              <th>Demand</th>
              <th>Size (sqft)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item["final location"]}</td>
                <td>{item["flat - weighted average rate"]}</td>
                <td>{item["total sold - igr"]}</td>
                <td>{item["total carpet area supplied (sqft)"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
