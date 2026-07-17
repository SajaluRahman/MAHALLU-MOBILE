import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

export default function CertificatesScreen() {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['mobile-certificates'],
    queryFn: () => api.get('/mobile/certificates').then(r => r.data.data),
  });

  const requests = data?.requests || [];
  const issuedCerts = data?.issuedCerts || [];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-emerald-600 px-6 pt-16 pb-6 rounded-b-3xl shadow-sm z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Certificates</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <TouchableOpacity 
          onPress={() => router.push('/(member)/certificates/request')}
          className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex-row items-center mb-6 shadow-sm"
        >
          <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center mr-4">
            <Ionicons name="add" size={24} color="#059669" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-slate-800 text-lg">Request New</Text>
            <Text className="text-slate-500 text-sm">Apply for a new certificate</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#059669" className="mt-10" />
        ) : (
          <>
            <Text className="font-bold text-slate-800 text-lg mb-4">Your Requests</Text>
            
            {requests.length === 0 && issuedCerts.length === 0 ? (
              <View className="bg-white p-8 rounded-2xl items-center shadow-sm">
                <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="document-text-outline" size={32} color="#94a3b8" />
                </View>
                <Text className="font-bold text-slate-700 text-base">No Certificates Yet</Text>
                <Text className="text-slate-500 text-center mt-1 text-sm">You haven't requested any certificates. Tap the button above to request one.</Text>
              </View>
            ) : null}

            {requests.map((req: any) => (
              <View key={req._id} className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-slate-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-bold text-slate-800 text-base capitalize">{req.type} Certificate</Text>
                  <View className={`px-2 py-1 rounded-md ${req.status === 'PENDING' ? 'bg-amber-100' : req.status === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <Text className={`text-xs font-bold ${req.status === 'PENDING' ? 'text-amber-700' : req.status === 'APPROVED' ? 'text-emerald-700' : 'text-red-700'}`}>
                      {req.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-slate-500 text-sm mb-3">Purpose: {req.purpose}</Text>
                
                {req.status === 'APPROVED' && req.certificateId ? (
                  <TouchableOpacity 
                    onPress={() => {
                      if (req.certificateId.pdfUrl) Linking.openURL(req.certificateId.pdfUrl);
                    }}
                    className="bg-emerald-600 py-2 rounded-xl flex-row justify-center items-center"
                  >
                    <Ionicons name="download-outline" size={18} color="white" className="mr-2" />
                    <Text className="text-white font-bold ml-2">Download PDF</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
