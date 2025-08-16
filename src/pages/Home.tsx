// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CartesianChart, Line, Bar } from 'victory-native';

// Helper function to generate random integers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

interface Alert {
  id: string;
  time: number;
  type: string;
  risk: number;
  entity: string;
  handled: boolean;
  autoBlocked: boolean;
}

export default function Home() {
  // State
  const [riskData, setRiskData] = useState<{ x: number; y: number }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulate adding a risk point
  const pushRiskPoint = (value: number) => {
    setRiskData(prev => {
      const newData = [...prev, { x: prev.length + 1, y: value }];
      if (newData.length > 50) newData.shift();
      return newData;
    });
  };

  // Simulate adding an alert
  const addAlert = () => {
    const typeOptions = ['Payment', 'Account', 'Chargeback', 'Velocity', 'Other'];
    const newAlert: Alert = {
      id: 'A' + Math.random().toString(36).substr(2, 6),
      time: Date.now(),
      type: typeOptions[randomInt(0, typeOptions.length - 1)],
      risk: randomInt(5, 95),
      entity: 'user_' + randomInt(1000, 9999),
      handled: false,
      autoBlocked: false,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    pushRiskPoint(newAlert.risk);
  };

  // Metrics
  const overallScore = Math.round(riskData.reduce((a, b) => a + b.y, 0) / Math.max(1, riskData.length));
  const activeAlerts = alerts.filter(a => !a.handled).length;

  // Render single alert
  const renderAlert = ({ item }: { item: Alert }) => (
    <View style={styles.alertRow}>
      <Text style={styles.alertCell}>{new Date(item.time).toLocaleTimeString()}</Text>
      <Text style={styles.alertCell}>{item.type}</Text>
      <Text style={styles.alertCell}>{item.risk}</Text>
      <Text style={styles.alertCell}>{item.entity}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => markHandled(item.id)}>
        <Text style={styles.btnText}>Mark</Text>
      </TouchableOpacity>
    </View>
  );

  const markHandled = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, handled: true } : a)));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CG</Text>
        <View>
          <Text style={styles.title}>Corepay Guardian AI</Text>
          <Text style={styles.lead}>Real-time risk monitoring · Fraud alerts · Suggested next steps</Text>
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Overall risk score</Text>
          <Text style={styles.metricValue}>{overallScore}</Text>
          <Text style={styles.metricLabel}>Active alerts: {activeAlerts}</Text>
        </View>
      </View>

      {/* Charts */}
      <View style={styles.charts}>
        <Text style={styles.chartTitle}>Risk Score</Text>
        <CartesianChart width={350} height={200}>
          <Line data={riskData} />
        </CartesianChart>

        <Text style={styles.chartTitle}>Alert Categories</Text>
        <CartesianChart width={350} height={150}>
          <Bar
            data={[
              { x: 'Payment', y: alerts.filter(a => a.type === 'Payment').length },
              { x: 'Account', y: alerts.filter(a => a.type === 'Account').length },
              { x: 'Chargeback', y: alerts.filter(a => a.type === 'Chargeback').length },
              { x: 'Velocity', y: alerts.filter(a => a.type === 'Velocity').length },
              { x: 'Other', y: alerts.filter(a => a.type === 'Other').length },
            ]}
          />
        </CartesianChart>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Simulate Event" onPress={addAlert} />
      </View>

      {/* Alerts Table */}
      <Text style={styles.sectionTitle}>Recent Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={renderAlert}
        ListEmptyComponent={<Text style={{ color: '#aaa' }}>No alerts yet.</Text>}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#071023' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#06b6d4', textAlign: 'center', lineHeight: 48, fontWeight: '800', color: '#021627', marginRight: 12 },
  title: { fontSize: 20, color: '#e6eef6', fontWeight: '700' },
  lead: { fontSize: 12, color: '#9aa4b2' },
  metrics: { flexDirection: 'row', marginBottom: 16 },
  metricCard: { flex: 1, backgroundColor: '#0b1220', padding: 12, borderRadius: 12 },
  metricLabel: { color: '#9aa4b2', fontSize: 12 },
  metricValue: { fontSize: 32, fontWeight: '800', color: '#06b6d4' },
  charts: { marginBottom: 16 },
  chartTitle: { color: '#e6eef6', marginVertical: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  sectionTitle: { color: '#e6eef6', fontWeight: '700', marginVertical: 8 },
  alertRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  alertCell: { color: '#e6eef6', width: 60 },
  btn: { backgroundColor: '#06b6d4', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  btnText: { color: '#021627', fontWeight: '700' },
});
