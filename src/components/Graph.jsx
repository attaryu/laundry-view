import PropTypes from 'prop-types';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

export default function Graph({ data }) {
  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 30,
          bottom: 20,
          right: 40,
        }}
      >
        <Tooltip
          offset={30}
          itemStyle={{
            fontFamily: 'Outfit',
            fontWeight: 300,
            fontSize: '0.75rem',
            lineHeight: 1,
          }}
          labelStyle={{
            fontFamily: 'Outfit',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBlockEnd: '5px',
          }}
          contentStyle={{
            borderRadius: '10px',
            marginTop: '25px',
            borderColor: 'rgb(0, 0, 0)',
          }}
          wrapperStyle={{ outline: 0 }}
        />
        <Line
          type="natural"
          dataKey="thisWeeks"
          stroke="#42b068"
          dot={{ strokeWidth: 2 }}
          strokeWidth={2}
          name="Minggu Ini"
        />
        <Line
          type="natural"
          dataKey="lastWeek"
          stroke="#eeb735"
          dot={{ strokeWidth: 2 }}
          strokeWidth={2}
          name="Minggu Lalu"
        />
        <XAxis
          dataKey="name"
          tickSize={10}
          fontSize={15}
          tickMargin={10}
          style={{ fontWeight: 600 }}
        />
        <YAxis
          tickSize={10}
          fontSize={15}
          tickMargin={10}
          style={{ fontWeight: 600 }}
        />
        <CartesianGrid
          opacity={0.6}
          strokeWidth={1}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

Graph.propTypes = {
  data: PropTypes.array.isRequired,
};
