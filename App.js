import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, TouchableOpacity, ScrollView, SafeAreaView
} from 'react-native';

const API_URL = 'https://web-production-9d882.up.railway.app/outages';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        if (json.data.length > 0) {
          setSelectedDate(json.data[0].date);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={styles.loadingText}>Loading outages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const selectedData = data.find(d => d.date === selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Power Outages</Text>
        <Text style={styles.headerSubtitle}>Armenia - ENA</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateTabs}>
        {data.map(item => (
          <TouchableOpacity
            key={item.date}
            style={[styles.dateTab, selectedDate === item.date && styles.dateTabActive]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text style={[styles.dateTabText, selectedDate === item.date && styles.dateTabTextActive]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={selectedData?.outages || []}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.district}>{item.district}</Text>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  errorText: { color: '#E63946', fontSize: 16 },
  header: { backgroundColor: '#E63946', padding: 20, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#ffccd0', fontSize: 14, marginTop: 2 },
  dateTabs: {
    backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 12,
    maxHeight: 55, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  dateTab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: '#F0F0F0' },
  dateTabActive: { backgroundColor: '#E63946' },
  dateTabText: { color: '#666', fontSize: 14, fontWeight: '500' },
  dateTabTextActive: { color: '#fff' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  district: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1, marginRight: 8 },
  timeBadge: { backgroundColor: '#FFF0F1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  timeText: { color: '#E63946', fontSize: 12, fontWeight: '600' },
  address: { fontSize: 13, color: '#666', lineHeight: 18 },
});
