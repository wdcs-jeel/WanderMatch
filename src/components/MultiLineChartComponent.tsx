import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { moderateScale, scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;

interface MultiLineChartComponentProps {
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

const MultiLineChartComponent: React.FC<MultiLineChartComponentProps> = ({
  data,
  height = 220,
  showLegend = true,
}) => {
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
      r: '4',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5,5', // dashed background lines
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  // Create a modified data object without the legend property
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      data: dataset.data,
      color: dataset.color,
    })),
  };

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={screenWidth - scale(32)}
        height={height}
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
        yAxisSuffix=""
        yAxisInterval={1}
        segments={5}
        verticalLabelRotation={30}
        getDotColor={(dataPoint, dataPointIndex) => data.datasets[dataPointIndex].color()}
        renderDotContent={({ x, y, index, indexData }) => null}
        formatYLabel={(value) => `₹${value}`}
        formatXLabel={(value) => value}
      />
      <View style={styles.legendContainer}>
        {data.legend.map((label, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: data.datasets[index].color() }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
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
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: scale(16),
    gap: scale(16),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  legendColor: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(2),
  },
  legendText: {
    fontSize: moderateScale(12),
    color: '#4B5563',
  },
});

export default MultiLineChartComponent; 