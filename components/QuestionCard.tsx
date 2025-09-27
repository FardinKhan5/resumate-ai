import { Feather } from '@expo/vector-icons'; // Import Feather
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface QuestionCardProps {
  text: string;
  index: number;
  isTip?: boolean;
}

export function QuestionCard({ text, index, isTip = false }: QuestionCardProps) {
  const [isPracticed, setIsPracticed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setStringAsync(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <View className="flex-row items-start gap-3 py-3 border-b border-slate-200/80 dark:border-slate-800/80 last:border-b-0">
      {!isTip ? (
        <Pressable onPress={() => setIsPracticed(!isPracticed)} className="mt-1">
          <View
            className={`w-6 h-6 rounded-md justify-center items-center border-2 ${
              isPracticed
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-transparent border-slate-300 dark:border-slate-600'
            }`}>
            {isPracticed && <Feather name="check" color="white" size={16} />}
          </View>
        </Pressable>
      ) : (
        <Text className="text-indigo-500 font-bold text-base mt-0.5">•</Text>
      )}

      <Text className="flex-1 text-base text-slate-700 dark:text-slate-300 leading-6">{text}</Text>

      {!isTip && (
        <Pressable
          onPress={handleCopy}
          className="p-2 -mr-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Feather
            name={isCopied ? 'check' : 'copy'}
            color={isCopied ? '#16a34a' : '#64748b'}
            size={18}
          />
        </Pressable>
      )}
    </View>
  );
}
