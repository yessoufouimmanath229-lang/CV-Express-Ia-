import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDocumentsHistory, SavedDocument } from '../services/storage.service';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { generatePDF } from '../services/pdf.service';
import { useTranslation } from 'react-i18next';
import { trackScreenView } from '../services/analytics.service';

export default function HistoryScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<SavedDocument[]>([]);
  const isFocused = useIsFocused();

  const loadHistory = async () => {
    const data = await getDocumentsHistory();
    setHistory(data);
  };

  useEffect(() => {
    if (isFocused) {
      trackScreenView('History');
      loadHistory();
    }
  }, [isFocused]);

  const handleReDownload = async (item: SavedDocument) => {
    try {
      await generatePDF(item.formData, item.cvData);
    } catch (error) {
      Alert.alert(t('common.error_generating'));
    }
  };

  const renderItem = ({ item }: { item: SavedDocument }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Creation', { 
        screen: 'Preview', 
        params: { formData: item.formData, cvData: item.cvData } 
      })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.formData.jobTitle}</Text>
        <Text style={styles.cardDate}>{t('common.generated_on')} {new Date(item.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</Text>
      </View>
      <TouchableOpacity onPress={() => handleReDownload(item)}>
        <Ionicons name="download-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.my_documents')}</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('common.no_documents')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
