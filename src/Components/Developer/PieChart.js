import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getPieChart`,
          { headers }
        );
        setPieChartData(response.data.pieChart);
      } catch (error) {
        console.error("Error fetching Pie Chart data:", error);
      }
    };

    fetchData();
  }, [storedToken]);

  const data = {
    labels: pieChartData.map((item) => item.feedback_name),
    datasets: [
      {
        label: "Feedback Distribution",
        data: pieChartData.map((item) => item.count),
        backgroundColor: [
          "rgba(0, 100, 100, 0.7)",
          "rgba(150, 130, 0, 0.7)",
          "rgba(150, 0, 30, 0.7)",
          "rgba(30, 90, 160, 0.7)",
          "rgba(90, 30, 120, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", 
        labels: {
          fontSize: 26,
        },
      },
    },
  };

  return (
    <>
      <Pie data={data} options={options} height={150} />
    </>
  );
};

export default PieChart;
