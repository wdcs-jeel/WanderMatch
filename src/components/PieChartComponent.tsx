import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { moderateScale, scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;

interface PieChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  height?: number;
  showLegend?: boolean;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  height = 220,
  showLegend = true,
}) => {
  // Transform data for pie chart
  const pieData = data.labels.map((label, index) => ({
    name: label,
    population: data.datasets[0].data[index],
    color: [
      '#F43F5E', // Transport - Main pink
      '#FB7185', // Stay - Light pink
      '#E11D48', // Food - Dark pink
      '#FCA5A5', // Activities - Very light pink
      '#BE123C', // Shopping - Deep pink
      '#F87171', // Other - Medium pink
    ][index],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <PieChart
        data={pieData}
        width={screenWidth - scale(32)}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
        hasLegend={showLegend}
        style={styles.chart}
        center={[0, 0]}
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
    padding: scale(8),
    borderWidth: 1,
    borderColor: '#F43F5E',
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

export default PieChartComponent; 