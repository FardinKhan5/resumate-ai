import { Feather } from '@expo/vector-icons'; // Import Feather
import React, { useState } from 'react';
import { LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';
import { QuestionCard } from './QuestionCard';

interface AccordionSectionProps {
  title: string;
  questions: string[];
  iconName: React.ComponentProps<typeof Feather>['name']; // Type-safe icon names
  isTips?: boolean;
}

export function AccordionSection({
  title,
  questions,
  iconName,
  isTips = false,
}: AccordionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-4 shadow-sm">
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.8}
        className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center gap-3">
          <Feather name={iconName} color="#4f46e5" size={22} />
          <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</Text>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'} // Change icon based on state
          size={24}
          color="#64748b"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-4 pb-2">
          {questions.map((q, idx) => (
            <QuestionCard key={idx} text={q} index={idx} isTip={isTips} />
          ))}
        </View>
      )}
    </View>
  );
}
