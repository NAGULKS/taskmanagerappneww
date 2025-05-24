import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const CategoryChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Tasks",
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(67, 97, 238, 0.6)",
          "rgba(46, 204, 113, 0.6)",
          "rgba(243, 156, 18, 0.6)",
          "rgba(231, 76, 60, 0.6)",
          "rgba(52, 152, 219, 0.6)",
        ],
        borderColor: [
          "rgba(67, 97, 238, 1)",
          "rgba(46, 204, 113, 1)",
          "rgba(243, 156, 18, 1)",
          "rgba(231, 76, 60, 1)",
          "rgba(52, 152, 219, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Popular Task Categories",
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

export default CategoryChart
