import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SocketService from '../../services/SocketService';

type ChatMessage = {
  text: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string; // ISO or formatted string
};

interface ChatScreenProps {
  recipient: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  };
  onBack: () => void;
  ws: WebSocket | null;
  userId: string;
  userName: string;
}

export default function ChatScreen({ recipient, onBack, ws, userId, userName }: ChatScreenProps) {
  const [data, setData] = useState<ChatMessage[]>([
    {
      text: "Hi there! How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMine: false,
      status: 'delivered' as const
    },
    {
      text: "I'm interested in learning more about your services.",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMine: true,
      status: 'delivered' as const
    },
    {
      text: "Great! I'd be happy to tell you more. What specific aspects are you interested in?",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isMine: false,
      status: 'delivered' as const
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set([userId]));
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(()=>{
    SocketService.initializeSocket()
  },[]);

  useEffect(()=>{
    SocketService.on('received msg', (msg) => {
      const isMine = msg.userId === userId;
      const newMsg: ChatMessage = {
        text: msg.text,
        isMine,
        status: isMine ? 'sent' : 'delivered',
        timestamp: msg.timestamp || new Date().toISOString()
      };
      setData(prev => [...prev, newMsg]); // ✅ always works with latest state
      console.log('msg received in react-native', msg);
    });
  
    // Optional: clean up listener on unmount
    return () => {
      SocketService.removeListener('received msg');
    };
  },[])
  const sendMessage = () => {
    if(!!inputMessage){
      const newMessage: ChatMessage = {
        text: inputMessage,
        isMine: true,
        status: 'sent',
        timestamp: new Date().toISOString()
      };
      SocketService.emit('send msg',{
        text: inputMessage,
        userId, // Include sender info
        timestamp: newMessage.timestamp
      });
      setInputMessage('')
      return
    }
  };

  // Add this section to the JSX to show connected users
  const renderConnectedUsers = () => (
    <View style={styles.connectedUsers}>
      <Text style={styles.connectedTitle}>Connected Users:</Text>
      {Array.from(connectedUsers).map(id => (
        <View key={id} style={styles.connectedUser}>
          <View style={styles.onlineDot} />
          <Text style={styles.connectedUserName}>
            {id === userId ? `${userName} (You)` : `User_${id.slice(-4)}`}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: recipient.avatar }} style={styles.avatar} />
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientName}>{recipient.name}</Text>
            <Text style={styles.onlineText}>
              {isConnected ? `${connectedUsers.size} user${connectedUsers.size !== 1 ? 's' : ''} connected` : 'Connecting...'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => Alert.alert('User Info', `Your ID: ${userId}\nYour Name: ${userName}`)}
        >
          <Ionicons name="information-circle" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {renderConnectedUsers()}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {data.map((message) => (
          <View
            key={Math.random()}
            style={[
              styles.messageWrapper,
              message.isMine ? styles.myMessageWrapper : styles.theirMessageWrapper
            ]}
          >
            {!message.isMine && (
              <Image source={{ uri: recipient.avatar }} style={styles.messageAvatar} />
            )}
            <View
              style={[
                styles.messageBubble,
                message.isMine ? styles.myMessageBubble : styles.theirMessageBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isMine ? styles.myMessageText : styles.theirMessageText
              ]}>
                {message.text}
              </Text>
              {/* <View style={styles.messageFooter}>
                <Text style={[
                  styles.messageTime,
                  message.isMine ? styles.myMessageTime : styles.theirMessageTime
                ]}>
                  {message.timestamp}
                </Text>
                {message.isMine && (
                  <Text style={styles.messageStatus}>
                    {message.status === 'delivered' ? '✓✓' : '✓'}
                  </Text>
                )}
              </View> */}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="#6B7280" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !inputMessage.trim() && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputMessage.trim() ? "#FFFFFF" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  backButton: {
    padding: moderateScale(8),
    minWidth: moderateScale(40),
    minHeight: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(8),
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  recipientInfo: {
    marginLeft: moderateScale(12),
  },
  recipientName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111827',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#10B981',
    marginRight: moderateScale(4),
  },
  onlineText: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  moreButton: {
    padding: moderateScale(8),
  },
  messagesContainer: {
    flex: 1,
    padding: moderateScale(16),
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  messageAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(8),
  },
  messageBubble: {
    padding: moderateScale(12),
    borderRadius: moderateScale(20),
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessageBubble: {
    backgroundColor: '#EC4899',
    borderBottomRightRadius: moderateScale(4),
  },
  theirMessageBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(4),
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: moderateScale(10),
  },
  myMessageTime: {
    color: '#FBCFE8',
  },
  theirMessageTime: {
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    padding: moderateScale(8),
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(8),
    padding: moderateScale(12),
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(20),
    fontSize: moderateScale(14),
    maxHeight: moderateScale(100),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  connectedUsers: {
    padding: moderateScale(8),
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  connectedTitle: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginBottom: moderateScale(4),
  },
  connectedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(2),
  },
  connectedUserName: {
    fontSize: moderateScale(12),
    color: '#111827',
    marginLeft: moderateScale(4),
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageStatus: {
    fontSize: moderateScale(10),
    color: '#FBCFE8',
    marginLeft: moderateScale(4),
  },
}); 