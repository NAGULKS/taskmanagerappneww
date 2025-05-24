import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TaskChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })),
    datasets: [
      {
        label: "Tasks Completed",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(67, 97, 238, 0.6)",
        borderColor: "rgba(67, 97, 238, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tasks Completed in Last 7 Days",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

export default TaskChart
