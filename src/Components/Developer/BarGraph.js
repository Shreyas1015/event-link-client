import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const BarGraph = () => {
  const [barGraphData, setBarGraphData] = useState([]);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getBarGraph`,
          { headers }
        );
        setBarGraphData(response.data.barGraph);
      } catch (error) {
        console.error("Error fetching bar graph data:", error);
      }
    };

    fetchData();
  }, [storedToken]);

  const getColorForRating = (rating) => {
    if (rating >= 4) {
      return "rgba(0, 100, 100, 0.7)"; 
    } else if (rating >= 3) {
      return "rgba(150, 130, 0, 0.7)"; 
    } else {
      return "rgba(150, 0, 30, 0.7)"; 
    }
  };

  const data = {
    labels: barGraphData.map((item) => item.ratings),
    datasets: [
      {
        label: "App Rating Distributions",
        data: barGraphData.map((item) => item.count),
        backgroundColor: barGraphData.map((item) =>
          getColorForRating(item.ratings)
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    legend: {
      labels: {
        fontSize: 26,
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} height={150} />
    </>
  );
};

export default BarGraph;
