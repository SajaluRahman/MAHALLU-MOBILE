import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';

export default function ServicesScreen() {
  const router = useRouter();

  const serviceCategories = [
    {
      title: 'Finance & Dues',
      items: [
        { icon: 'card-outline', label: 'Payments', desc: 'Pay dues and fees', route: '/(member)/payments', color: '#10b981', bg: 'bg-emerald-500/20' },
        { icon: 'heart-outline', label: 'Donations', desc: 'Donate to causes', route: '/(member)/donations', color: '#f43f5e', bg: 'bg-rose-500/20' },
        { icon: 'wallet-outline', label: 'Zakat', desc: 'Zakat applications', route: '/(member)/coming-soon?title=Zakat', color: '#3b82f6', bg: 'bg-blue-500/20' },
      ]
    },
    {
      title: 'Community',
      items: [
        { icon: 'calendar-outline', label: 'Events', desc: 'Upcoming events', route: '/(member)/events', color: '#a855f7', bg: 'bg-purple-500/20' },
        { icon: 'document-text-outline', label: 'Certificates', desc: 'Request certificates', route: '/(member)/certificates', color: '#f59e0b', bg: 'bg-amber-500/20' },
        { icon: 'people-outline', label: 'Nikah', desc: 'Marriage registry', route: '/(member)/coming-soon?title=Nikah', color: '#ec4899', bg: 'bg-pink-500/20' },
      ]
    },
    {
      title: 'Facilities',
      items: [
        { icon: 'business-outline', label: 'Properties', desc: 'Rentals & assets', route: '/(member)/properties', color: '#10b981', bg: 'bg-emerald-500/20' },
        { icon: 'moon-outline', label: 'Cemetery', desc: 'Burial records', route: '/(member)/cemetery', color: '#71717a', bg: 'bg-zinc-500/20' },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-5 pt-2 pb-4 border-b border-slate-200 bg-white">
        <Text className="text-slate-900 text-2xl font-extrabold">Services</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {serviceCategories.map((category, idx) => (
          <View key={idx} className="mb-6">
            <Text className="text-slate-800 text-sm font-bold mb-3 uppercase tracking-wider">{category.title}</Text>
            <View className="space-y-3">
              {category.items.map((item, i) => (
                <TouchableOpacity 
                  key={i} 
                  activeOpacity={0.7}
                  onPress={() => item.route && router.push(item.route as any)}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex-row items-center shadow-sm shadow-slate-200"
                >
                  <View className={`w-12 h-12 rounded-xl ${item.bg} items-center justify-center mr-4`}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold text-base">{item.label}</Text>
                    <Text className="text-slate-500 text-xs mt-0.5">{item.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
