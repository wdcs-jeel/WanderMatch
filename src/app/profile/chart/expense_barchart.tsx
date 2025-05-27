import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationProp } from '../../../utils/navigation/RootStackParamList';
import BarChartComponent from '../../../components/BarChartComponent';
import PieChartComponent from '../../../components/PieChartComponent';
import LineChartComponent from '../../../components/LineChartComponent';
import DonutChartComponent from '../../../components/DonutChartComponent';
import MultiLineChartComponent from '../../../components/MultiLineChartComponent';

const ExpenseBarChart = () => {
    const navigation = useNavigation<NavigationProp>();
    const data = {
      labels: ['Transport', 'Stay', 'Food', 'Activities','Shopping','Other'],
      datasets: [
        {
          data: [120, 350, 200, 150,100,50], // Customize this based on your trip data
        },
      ],
    };

    const comparisonData = {
      labels: ['Transport', 'Accommodation', 'Food', 'Activities','Shopping','Other'],
      datasets: [
        {
          data: [1200, 3000, 1500, 1000,100,50],
          color: () => '#F43F5E', // Main pink
          label: 'Goa',
        },
        {
          data: [800, 2500, 1200, 600,100,50],
          color: () => '#FB7185', // Light pink
          label: 'Manali',
        },
        {
          data: [900, 2800, 1300, 2500,2000,50],
          color: () => '#E11D48', // Dark pink
          label: 'Kerala',
        },
        {
          data: [1000, 3000, 2500, 1000,100,50],
          color: () => '#BE123C', // Deep pink
          label: 'Shimla',
        },
        {
          data: [1000,2000,1000,2000,100,50],
          color: () => '#FCA5A5', // Very light pink
          label: 'Mumbai',
        },
        {
          data: [1000,1000,1000,1000,100,50],
          color: () => '#F87171', // Medium pink
          label: 'Pune',
        },
        {
          data: [500,50,1600,1000,2000,50],
          color: () => '#EF4444', // Bright pink
          label: 'xx',
        },
      ],
      legend: ['Goa', 'Manali', 'Kerala','Shimla','Mumbai','Pune','Delhi'],
    };

    return (
      <View style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.titleScreen}>Chart</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>Trip Expense Distribution</Text>
            <BarChartComponent 
              data={data}
              height={220}
              yAxisLabel="₹"
            />
            <Text style={styles.title}>Expense Breakdown</Text>
            <PieChartComponent 
              data={data}
              height={210}
            />
            <Text style={styles.title}>Destination Comparison</Text>
            <LineChartComponent 
              data={comparisonData}
              height={220}
            />
            <Text style={styles.title}>Expense Overview</Text>
            <DonutChartComponent 
              data={data}
              height={220}
            />
            <Text style={styles.title}>Monthly Trend</Text>
            <MultiLineChartComponent 
              data={comparisonData}
              height={220}
            />
          </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  titleScreen: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#F43F5E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: scale(16),
    gap: scale(10),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: scale(16),
  },
});

export default ExpenseBarChart;
