import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const BarGraph = () => {
  const [barGraphData, setBarGraphData] = useState([]);
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getBarGraph`,
          { decryptedUID }
        );
        setBarGraphData(response.data.barGraph);
      } catch (error) {
        console.error("Error fetching bar graph data:", error);
      }
    };

    fetchData();
  }, [decryptedUID]);

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
