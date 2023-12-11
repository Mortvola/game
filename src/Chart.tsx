import React from 'react';
import { Chart } from "react-google-charts";

type PropsType = {
  data: unknown[],
}

const RewardChart: React.FC<PropsType> = ({
  data,
}) => {
  return (
    <Chart
      chartType='LineChart'
      width="100%"
      height="100%"
      data={data}
    />
  )
}

export default RewardChart;
