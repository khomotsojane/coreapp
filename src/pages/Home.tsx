import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
} from "victory";

interface Alert {
  id: string;
  time: number;
  type: string;
  risk: number;
  entity: string;
  handled: boolean;
  autoBlocked: boolean;
}

const types = ["Payment", "Account", "Chargeback", "Velocity", "Other"];

export default function Home() {
  const [riskData, setRiskData] = useState<{ x: number; y: number }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pushRiskPoint = (value: number) => {
    setRiskData((prev) => {
      const newData = [...prev, { x: prev.length + 1, y: value }];
      if (newData.length > 50) newData.shift();
      return newData;
    });
  };

  const addAlert = () => {
    const newAlert: Alert = {
      id: "A" + Math.random().toString(36).substr(2, 6),
      time: Date.now(),
      type: types[randomInt(0, types.length - 1)],
      risk: randomInt(5, 95),
      entity: "user_" + randomInt(1000, 9999),
      handled: false,
      autoBlocked: false,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
    pushRiskPoint(newAlert.risk);
  };

  const markHandled = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, handled: true } : a))
    );
  };

  const overallScore = riskData.length
    ? Math.round(riskData.reduce((sum, p) => sum + p.y, 0) / riskData.length)
    : 0;
  const activeAlerts = alerts.filter((a) => !a.handled).length;

  const categoryData = types.map((type) => ({
    x: type,
    y: alerts.filter((a) => a.type === type).length,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Corepay Guardian AI</Text>
      <Text style={styles.subtitle}>
        Overall risk: {overallScore} | Active alerts: {activeAlerts}
      </Text>
      <Button title="Simulate Event" onPress={addAlert} />

      <Text style={styles.chartTitle}>Risk Chart</Text>
      <View style={{ height: 220, backgroundColor: "#0a1733", borderRadius: 8, marginBottom: 8 }}>
        <VictoryChart
          width={350}
          height={200}
          theme={VictoryTheme.material}
          domainPadding={10}
        >
          <VictoryAxis style={{ tickLabels: { fill: "#e6eef6" }, axis: {stroke: "#e6eef6"} }} />
          <VictoryAxis dependentAxis style={{ tickLabels: { fill: "#e6eef6" }, axis: {stroke: "#e6eef6"} }} />
          <VictoryLine
            data={riskData}
            style={{
              data: { stroke: "#06b6d4", strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </View>

      <Text style={styles.chartTitle}>Alert Categories</Text>
      <View style={{ height: 220, backgroundColor: "#0a1733", borderRadius: 8, marginBottom: 8 }}>
        <VictoryChart
          width={350}
          height={200}
          theme={VictoryTheme.material}
          domainPadding={30}
        >
          <VictoryAxis style={{ tickLabels: { fill: "#e6eef6" }, axis: {stroke: "#e6eef6"} }} />
          <VictoryAxis dependentAxis style={{ tickLabels: { fill: "#e6eef6" }, axis: {stroke: "#e6eef6"} }} />
          <VictoryBar
            data={categoryData}
            style={{
              data: { fill: "#06b6d4" },
            }}
            barWidth={20}
          />
        </VictoryChart>
      </View>

      <Text style={styles.chartTitle}>Recent Alerts</Text>
      <View style={styles.alertHeader}>
        <Text style={[styles.alertText, styles.headerText]}>Type</Text>
        <Text style={[styles.alertText, styles.headerText]}>Risk</Text>
        <Text style={[styles.alertText, styles.headerText]}>Entity</Text>
        <Text style={{ width: 60 }} />
      </View>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.alertRow}>
            <Text
              style={[
                styles.alertText,
                item.handled && styles.handledText,
              ]}
            >
              {item.type}
            </Text>
            <Text
              style={[
                styles.alertText,
                item.handled && styles.handledText,
              ]}
            >
              {item.risk}
            </Text>
            <Text
              style={[
                styles.alertText,
                item.handled && styles.handledText,
              ]}
            >
              {item.entity}
            </Text>
            {!item.handled && (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => markHandled(item.id)}
              >
                <Text style={styles.btnText}>Mark</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#071023" },
  title: { color: "#e6eef6", fontSize: 20, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#9aa4b2", marginBottom: 12 },
  chartTitle: { color: "#e6eef6", marginTop: 12, marginBottom: 4 },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1a233a",
    marginBottom: 2,
  },
  headerText: { color: "#9aa4b2", fontWeight: "700" },
  alertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  alertText: { color: "#e6eef6", width: 80 },
  handledText: { textDecorationLine: "line-through", color: "#6c7a89" },
  btn: {
    backgroundColor: "#06b6d4",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnText: { color: "#021627", fontWeight: "700" },
});