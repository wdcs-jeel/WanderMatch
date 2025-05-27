import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;

interface BarChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  height?: number;
  showYAxisLabel?: boolean;
  yAxisLabel?: string;
  yAxisSuffix?: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  height = 220,
  showYAxisLabel = true,
  yAxisLabel = "₹",
  yAxisSuffix = "",
}) => {
  // Calculate dynamic width based on number of labels
  const chartWidth = useMemo(() => {
    const baseWidth = screenWidth - scale(32); // Full screen width minus margins
    const minWidth = moderateScale(340); // Minimum width
    const labelCount = data.labels.length;
    const widthPerLabel = moderateScale(80); // Width needed per label
    const calculatedWidth = Math.max(minWidth, labelCount * widthPerLabel);
    return Math.min(calculatedWidth, baseWidth);
  }, [data.labels.length]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`, // F43F5E - pink color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
    barPercentage: 0.6,
    propsForLabels: {
      fontSize: 12,
    },
    fillShadowGradient: '#F43F5E',
    fillShadowGradientOpacity: 0.3,
  };

  return (
    <View style={styles.chartContainer}>
      <BarChart
        data={data}
        width={chartWidth}
        height={verticalScale(height)}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        fromZero
        yAxisLabel={showYAxisLabel ? yAxisLabel : ""}
        yAxisSuffix={yAxisSuffix}
        style={styles.chart}
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

export default BarChartComponent; 