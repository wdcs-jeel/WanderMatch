import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { moderateScale, scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;

interface LineChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color: () => string;
      label: string;
    }[];
    legend: string[];
  };
  height?: number;
  showLegend?: boolean;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  height = 220,
  showLegend = true,
}) => {
  const chartWidth = useMemo(() => {
    const baseWidth = screenWidth - scale(32);
    const minWidth = moderateScale(340);
    const labelCount = data.labels.length;
    const widthPerLabel = moderateScale(120);
    const calculatedWidth = Math.max(minWidth, labelCount * widthPerLabel);
    return Math.min(calculatedWidth, baseWidth);
  }, [data.labels.length]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={data}
        width={chartWidth}
        height={height + 80} // Increased height to accommodate legend
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={true}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        // yAxisLabel="₹"
        yAxisSuffix=""
        yAxisInterval={1}
        segments={5}
        verticalLabelRotation={30}
        getDotColor={(dataPoint, dataPointIndex) => data.datasets[dataPointIndex].color()}
        renderDotContent={({ x, y, index, indexData }) => null}
        formatYLabel={(value) => `₹${value}`}
        formatXLabel={(value) => value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
  },
  chart: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#F43F5E',
    marginTop: scale(16),
    shadowColor: '#F43F5E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default LineChartComponent; 