import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

const CERTIFICATE_TYPES = [
  { id: 'residence', label: 'Residence Certificate' },
  { id: 'membership', label: 'Membership Certificate' },
  { id: 'nikah', label: 'Marriage (Nikah) Certificate' },
  { id: 'character', label: 'Character Certificate' },
];

export default function RequestCertificateScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [type, setType] = useState('residence');
  const [purpose, setPurpose] = useState('');

  const submitMutation = useMutation({
    mutationFn: (data: { type: string, purpose: string }) => api.post('/mobile/certificates/request', data),
    onSuccess: () => {
      Alert.alert('Success', 'Certificate request submitted successfully. It will be reviewed by the administration.');
      queryClient.invalidateQueries({ queryKey: ['mobile-certificates'] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit request');
    }
  });

  const handleSubmit = () => {
    if (!purpose.trim()) {
      Alert.alert('Required', 'Please enter the purpose for this certificate.');
      return;
    }
    submitMutation.mutate({ type, purpose });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-emerald-600 px-6 pt-16 pb-6 rounded-b-3xl shadow-sm z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Request Certificate</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="font-bold text-slate-800 text-base mb-3">Certificate Type</Text>
        <View className="space-y-3 mb-6">
          {CERTIFICATE_TYPES.map((ct) => (
            <TouchableOpacity 
              key={ct.id}
              onPress={() => setType(ct.id)}
              className={`p-4 rounded-xl border flex-row items-center justify-between shadow-sm ${
                type === ct.id ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`font-semibold ${type === ct.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                {ct.label}
              </Text>
              {type === ct.id && (
                <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-bold text-slate-800 text-base mb-3">Purpose of Request *</Text>
        <TextInput
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. For passport application, school admission, etc."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 shadow-sm min-h-[120px] mb-8"
        />

        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={submitMutation.isPending}
          className={`bg-emerald-600 py-4 rounded-xl items-center shadow-sm ${submitMutation.isPending ? 'opacity-70' : ''}`}
        >
          {submitMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
