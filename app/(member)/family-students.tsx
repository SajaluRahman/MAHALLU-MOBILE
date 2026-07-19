import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import api from '../../lib/api';
import { Avatar } from '../../components/ui/Avatar';

// Theme colors
const TEAL_DARK = '#0B4A42';
const TEAL = '#0F6B5C';
const GOLD = '#C9972E';
const CREAM = '#FBF8F2';

type TabType = 'overview' | 'exams' | 'homework' | 'notices';

export default function FamilyStudentsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentsData, setStudentsData] = useState<any[]>([]);

  // Selection states
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const fetchStudents = async () => {
    try {
      const res = await api.get('/mobile/member/family-students');
      const data = res.data.data || [];
      setStudentsData(data);
      if (data.length > 0 && !activeStudentId) {
        setActiveStudentId(data[0].studentInfo._id);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch family student details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={TEAL} />
        <Text style={{ marginTop: 12, color: TEAL_DARK, fontWeight: '600' }}>Loading students progress...</Text>
      </View>
    );
  }

  const selectedStudent = studentsData.find(s => s.studentInfo._id === activeStudentId);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: CREAM }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f1ebd9', backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <Ionicons name="arrow-back" size={20} color={TEAL_DARK} />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: TEAL_DARK, letterSpacing: -0.5 }}>Madrasa Portal</Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Track children's academic performance</Text>
        </View>
      </View>

      {studentsData.length === 0 ? (
        <ScrollView 
          contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="school" size={40} color={GOLD} />
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: TEAL_DARK, textAlign: 'center', marginBottom: 8 }}>No Students Enrolled</Text>
          <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 }}>
            Contact your Madrasa Sadar Mualim (Headmaster) to enroll your children and assign them to your family.
          </Text>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Horizontally scrollable student selector if multiple children */}
          {studentsData.length > 1 && (
            <View style={{ backgroundColor: 'white', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e2e8f0' }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
                {studentsData.map((s) => {
                  const sInfo = s.studentInfo;
                  const isActive = sInfo._id === activeStudentId;
                  return (
                    <TouchableOpacity
                      key={sInfo._id}
                      onPress={() => setActiveStudentId(sInfo._id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isActive ? TEAL : '#f1f5f9',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isActive ? TEAL_DARK : '#e2e8f0',
                      }}
                    >
                      <Avatar uri={sInfo.memberId?.photo?.url} name={sInfo.memberId?.name} size={28} />
                      <Text style={{ marginLeft: 8, color: isActive ? 'white' : TEAL_DARK, fontWeight: 'bold', fontSize: 14 }}>
                        {sInfo.memberId?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Child Profile summary & stats */}
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {selectedStudent && (
              <View>
                {/* Profile Header */}
                <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#ebdcb9', marginBottom: 20, alignItems: 'center' }}>
                  <Avatar uri={selectedStudent.studentInfo.memberId?.photo?.url} name={selectedStudent.studentInfo.memberId?.name} size={64} />
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: TEAL_DARK, marginTop: 12 }}>
                    {selectedStudent.studentInfo.memberId?.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: GOLD, fontWeight: '700', marginTop: 4 }}>
                    Class: {selectedStudent.studentInfo.classId?.name || 'Unassigned'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Admission ID: {selectedStudent.studentInfo.admissionNo}
                  </Text>

                  {/* Attendance Pct Card */}
                  <View style={{ flexDirection: 'row', marginTop: 20, borderTopWidth: 1, borderColor: '#f1ebd9', paddingTop: 16, width: '100%', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: '900', color: TEAL }}>
                        {selectedStudent.attendance.percentage}%
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Attendance</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#f1ebd9' }} />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: '900', color: GOLD }}>
                        {selectedStudent.attendance.present}/{selectedStudent.attendance.total}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Classes Marked</Text>
                    </View>
                  </View>
                </View>

                {/* Sub tabs selectors */}
                <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 16, padding: 4, marginBottom: 20 }}>
                  {(['overview', 'exams', 'homework', 'notices'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: activeTab === tab ? 'white' : 'transparent',
                        alignItems: 'center',
                        shadowColor: activeTab === tab ? '#000' : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: activeTab === tab ? 2 : 0,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: activeTab === tab ? TEAL_DARK : '#64748b', textTransform: 'capitalize' }}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tab content rendering */}
                {activeTab === 'overview' && (
                  <View style={{ gap: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK, marginBottom: 4 }}>Recent Attendance Log</Text>
                    {selectedStudent.attendance.logs.length === 0 ? (
                      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                        <Text style={{ color: '#64748b', fontSize: 14 }}>No attendance records found yet.</Text>
                      </View>
                    ) : (
                      selectedStudent.attendance.logs.slice(0, 10).map((log: any, idx: number) => {
                        const isPresent = log.status === 'present';
                        return (
                          <View key={idx} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#f1ebd9' }}>
                            <View>
                              <Text style={{ fontWeight: 'bold', color: TEAL_DARK }}>
                                {dayjs(log.date).format('dddd, DD MMM YYYY')}
                              </Text>
                              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Daily Session</Text>
                            </View>
                            <View style={{ backgroundColor: isPresent ? '#dcfce7' : '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                              <Text style={{ color: isPresent ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>
                                {log.status}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>
                )}

                {activeTab === 'exams' && (
                  <View style={{ gap: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK, marginBottom: 4 }}>Madrasa Exams</Text>
                    {selectedStudent.exams.length === 0 ? (
                      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                        <Text style={{ color: '#64748b', fontSize: 14 }}>No exams scheduled for this class.</Text>
                      </View>
                    ) : (
                      selectedStudent.exams.map((exam: any) => (
                        <View key={exam._id} style={{ backgroundColor: 'white', padding: 18, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: GOLD, borderWidth: 1, borderColor: '#ebdcb9' }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK }}>{exam.title}</Text>
                          <Text style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Subject: {exam.subject}</Text>
                          <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Date: {dayjs(exam.date).format('DD MMM YYYY')}</Text>
                          {exam.maxMarks && (
                            <View style={{ marginTop: 12, borderTopWidth: 1, borderColor: '#f1ebd9', paddingTop: 10 }}>
                              <Text style={{ fontSize: 12, fontWeight: 'bold', color: GOLD }}>Maximum Marks: {exam.maxMarks}</Text>
                            </View>
                          )}
                        </View>
                      ))
                    )}
                  </View>
                )}

                {activeTab === 'homework' && (
                  <View style={{ gap: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK, marginBottom: 4 }}>Class Homework Tasks</Text>
                    {selectedStudent.homeworks.length === 0 ? (
                      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                        <Text style={{ color: '#64748b', fontSize: 14 }}>No homework tasks assigned yet.</Text>
                      </View>
                    ) : (
                      selectedStudent.homeworks.map((hw: any) => (
                        <View key={hw._id} style={{ backgroundColor: 'white', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#f1ebd9' }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK }}>{hw.title}</Text>
                          <Text style={{ fontSize: 13, color: '#475569', marginTop: 6, lineHeight: 18 }}>{hw.description}</Text>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderColor: '#f1ebd9', paddingTop: 10 }}>
                            <Text style={{ fontSize: 12, color: '#64748b' }}>Subject: {hw.subject}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ef4444' }}>Due: {dayjs(hw.dueDate).format('DD MMM')}</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {activeTab === 'notices' && (
                  <View style={{ gap: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEAL_DARK, marginBottom: 4 }}>Recent Notice Broadcasts</Text>
                    {selectedStudent.notices.length === 0 ? (
                      <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                        <Text style={{ color: '#64748b', fontSize: 14 }}>No notifications sent yet.</Text>
                      </View>
                    ) : (
                      selectedStudent.notices.map((n: any) => (
                        <View key={n._id} style={{ backgroundColor: 'white', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#f1ebd9' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <Ionicons name="notifications" size={16} color={GOLD} />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: TEAL_DARK }}>{n.title}</Text>
                          </View>
                          <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18 }}>{n.body}</Text>
                          <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>{dayjs(n.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
