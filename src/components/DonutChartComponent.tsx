import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { moderateScale, scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface DonutChartComponentProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  height?: number;
  showLegend?: boolean;
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({
  data,
  height = 220,
  showLegend = true,
}) => {
  // Calculate total for percentage
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

  // Transform data for pie chart with a hole in the center
  const pieData = [
    ...data.labels.map((label, index) => ({
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
    })),
    // Add a center hole
    {
      name: 'center',
      population: total * 0.0, // Increased hole size
      color: 'transparent',
      legendFontColor: 'transparent',
      legendFontSize: 0,
    }
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={pieData}
          width={screenWidth - scale(32)}
          height={height}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
          style={styles.chart}
          avoidFalseZero
          center={[screenWidth / 5, 0]}
        />
        <View style={[styles.centerTextContainer,{
          left: (screenWidth - scale(32)) / 2 - scale(50),
          top: screenHeight / 2 - scale(335)
        }]}>
          <Text style={styles.totalAmount}>₹{total}</Text>
          <Text style={styles.totalLabel}>Total Expenses</Text>
        </View>
      </View>
      <View style={styles.legendContainer}>
        {pieData.slice(0, -1).map((item, index) => {
          const percentage = ((item.population / total) * 100).toFixed(1);
          return (
            <View key={index} style={styles.legendItem}>
              <View style={styles.legendColorContainer}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
              <View style={styles.legendValueContainer}>
                <Text style={styles.legendValue}>₹{item.population}</Text>
                <Text style={styles.legendPercentage}>{percentage}%</Text>
              </View>
            </View>
          );
        })}
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
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
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
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalAmount: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: scale(2),
  },
  totalLabel: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  legendContainer: {
    width: '100%',
    marginTop: scale(24),
    gap: scale(12),
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(4),
  },
  legendColorContainer: {
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
    fontSize: moderateScale(14),
    color: '#4B5563',
  },
  legendValueContainer: {
    alignItems: 'flex-end',
  },
  legendValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1F2937',
  },
  legendPercentage: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
});

export default DonutChartComponent; 