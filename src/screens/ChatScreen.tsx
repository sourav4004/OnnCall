import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatThread } from '../types';
import { AppIcon } from '../components/AppIcon';

interface ChatScreenProps {
  thread: ChatThread;
  onBack: () => void;
  onSendMessage: (proId: string, text: string) => void;
  onCallPro: (name: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  thread,
  onBack,
  onSendMessage,
  onCallPro,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(thread.proId, inputText.trim());
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <AppIcon name="arrow-left" size={20} className="text-[#111111]" />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{thread.proName[0]}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{thread.proName}</Text>
            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online · {thread.proRole}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onCallPro(thread.proName)}
          style={styles.callButton}
        >
          <AppIcon name="phone" size={17} className="text-[#111111]" />
        </TouchableOpacity>
      </View>

      {/* Messages Feed */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.securityBadgeWrapper}>
          <Text style={styles.securityBadge}>
            All messages are end-to-end coordinated
          </Text>
        </View>

        {thread.messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowOther,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.messageTextUser : styles.messageTextOther,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    isUser ? styles.timeTextUser : styles.timeTextOther,
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Message Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Message ${thread.proName.split(' ')[0]}...`}
          placeholderTextColor="#888888"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
        >
          <AppIcon name="send" size={16} className="text-white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 6,
    marginLeft: -4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E7A34',
  },
  onlineText: {
    fontSize: 11,
    color: '#1E7A34',
    fontWeight: '600',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  securityBadgeWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  securityBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#111111',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: '#111111',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  timeTextUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  timeTextOther: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
