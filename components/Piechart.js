import {
  PieChart as PieC,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Circle } from "@mui/icons-material";
import { Link, Paper, Typography } from "@mui/material";

const COLORS = [
  "#003057",
  "#1A5A8F",
  "#357AB5",
  "#6CACE4",
  "#A1D2FE",
  "#C7E4FE",
  "#E1EFFB",
];

const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index,
// }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

const RenderCustomLegend = (props) => {
  // console.log(props);
  const { payload } = props;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        transform: "translateX(200px)",
        alignItems: "center",
        columnGap: "20px",
      }}
    >
      {payload.map((item) => {
        const { payload: innerPayload, color } = item;
        const { name, value } = innerPayload;

        return (
          <>
            <div
              style={{
                width: "300px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div>
                <Circle style={{ color: color, height: "10px" }} />
                <Link href={`https://reddit.com/r/${name}`} target="_blank">
                  {name}
                </Link>
              </div>
              <div style={{ textAlign: "right" }}>%{value}</div>
            </div>
          </>
        );
      })}
    </div>
  );
};

const PieChart = ({ width, height, data }) => {
  if (!data) return null;

  const CustomTooltip = ({ payload }) => {
    return (
      <Paper sx={{ padding: "1em" }}>
        <Typography variant="caption" component="div" color="text.secondary">
          <b>{payload[0]?.name}</b>: %{payload[0]?.value}
        </Typography>
      </Paper>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieC width={width} height={height}>
        <Legend
          layout="horizontal"
          verticalAlign="middle"
          align="top"
          content={RenderCustomLegend}
        />
        <Pie
          data={data}
          cx={100}
          cy={100}
          labelLine={false}
          // label={renderCustomizedLabel}
          startAngle={-270}
          outerRadius={80}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieC>
    </ResponsiveContainer>
  );
};

export default PieChart;
