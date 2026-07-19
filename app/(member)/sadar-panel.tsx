import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../lib/api';

// Theme colors
const TEAL_DARK = '#0B4A42';
const TEAL = '#0F6B5C';
const GOLD = '#C9972E';
const CREAM = '#FBF8F2';

export default function SadarPanelScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  // Dropdown options lists
  const [families, setFamilies] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Modal UI visibility states
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [familiesRes, classesRes] = await Promise.all([
          api.get('/mobile/sadar/families'),
          api.get('/mobile/sadar/classes'),
        ]);
        setFamilies(familiesRes.data.data || []);
        setClasses(classesRes.data.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch classes or families for enrollment.');
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !selectedFamilyId || !selectedClassId) {
      Alert.alert('Missing Fields', 'Please fill in the Student Name, Family selection, and Class selection.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/mobile/sadar/students', {
        name: name.trim(),
        admissionNo: admissionNo.trim() || undefined,
        classId: selectedClassId,
        familyId: selectedFamilyId,
      });

      Alert.alert('Success', 'Student enrolled and added to family successfully!', [
        {
          text: 'Great',
          onPress: () => {
            // Reset form
            setName('');
            setAdmissionNo('');
            setSelectedFamilyId('');
            setSelectedClassId('');
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to enroll student.');
    } finally {
      setLoading(false);
    }
  };

  const selectedFamily = families.find(f => f._id === selectedFamilyId);
  const selectedClass = classes.find(c => c._id === selectedClassId);

  if (fetchingData) {
    return (
      <View style={{ flex: 1, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={TEAL} />
        <Text style={{ marginTop: 12, color: TEAL_DARK, fontWeight: '600' }}>Fetching families and classes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: CREAM }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f1ebd9' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#94a3b8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="arrow-back" size={20} color={TEAL_DARK} />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: TEAL_DARK, letterSpacing: -0.5 }}>Sadar Mualim Panel</Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Enroll new Madrasa students</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ gap: 20 }}>
          {/* Student Name */}
          <View>
            <Text style={{ color: TEAL_DARK, marginBottom: 8, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Student Name *</Text>
            <TextInput
              style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#ebdcb9', borderRadius: 16, padding: 18, color: '#0f172a', fontSize: 16 }}
              placeholder="Enter full name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Admission Number */}
          <View>
            <Text style={{ color: TEAL_DARK, marginBottom: 8, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Admission Number (Optional)</Text>
            <TextInput
              style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#ebdcb9', borderRadius: 16, padding: 18, color: '#0f172a', fontSize: 16 }}
              placeholder="e.g. ADM-2026-XXXX"
              placeholderTextColor="#94a3b8"
              value={admissionNo}
              onChangeText={setAdmissionNo}
            />
          </View>

          {/* Family Selection */}
          <View>
            <Text style={{ color: TEAL_DARK, marginBottom: 8, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Family *</Text>
            <TouchableOpacity
              onPress={() => setShowFamilyModal(true)}
              style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#ebdcb9', borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ color: selectedFamilyId ? '#0f172a' : '#94a3b8', fontSize: 16 }}>
                {selectedFamilyId 
                  ? `${selectedFamily?.headName} (${selectedFamily?.familyCode})`
                  : 'Select Family'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Class Selection */}
          <View>
            <Text style={{ color: TEAL_DARK, marginBottom: 8, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Class *</Text>
            <TouchableOpacity
              onPress={() => setShowClassModal(true)}
              style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#ebdcb9', borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ color: selectedClassId ? '#0f172a' : '#94a3b8', fontSize: 16 }}>
                {selectedClassId 
                  ? selectedClass?.name
                  : 'Select Class'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Submit button */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: TEAL, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16, opacity: loading ? 0.7 : 1, shadowColor: TEAL_DARK, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Enroll Student</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Family Select Modal */}
      <Modal visible={showFamilyModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: TEAL_DARK }}>Select Family</Text>
              <TouchableOpacity onPress={() => setShowFamilyModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={families}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFamilyId(item._id);
                    setShowFamilyModal(false);
                  }}
                  style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>{item.headName}</Text>
                  <Text style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Code: {item.familyCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Class Select Modal */}
      <Modal visible={showClassModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: TEAL_DARK }}>Select Class</Text>
              <TouchableOpacity onPress={() => setShowClassModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={classes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedClassId(item._id);
                    setShowClassModal(false);
                  }}
                  style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>{item.name}</Text>
                  <Text style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Level: {item.level}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
