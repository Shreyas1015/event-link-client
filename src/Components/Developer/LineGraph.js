import React, { useEffect, useState } from "react";
import {
  Chart as CharJs,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

CharJs.register(LineElement, PointElement, CategoryScale, LinearScale);
const LineGraph = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getLineChart`,
          { headers }
        );
        setLineChartData(response.data.lineChartData);
      } catch (error) {
        console.error("Error fetching Line Chart data:", error);
      }
    };

    fetchData();
  }, [storedToken]);

  const data = {
    labels: lineChartData.map((item) => item.category_name),
    datasets: [
      {
        label: "Posts based on Categories",
        data: lineChartData.map((item) => item.post_count),
        borderColor: "rgba(0, 100, 100, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Posts",
          fontSize: 16,
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories",
          fontSize: 16,
        },
      },
    },
  };

  return (
    <>
      <Line data={data} options={options} height={150} />
    </>
  );
};

export default LineGraph;
