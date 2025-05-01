import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, SafeAreaView, Alert } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatScreen from './ChatScreen';


export default function MessageScreen() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [userName] = useState(`User_${userId.slice(-4)}`);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Emma",
      avatar: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
      lastMessage: "When do you arrive in Paris?",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "James",
      avatar: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
      lastMessage: "The beach here is amazing!",
      time: "1h ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Sophia",
      avatar: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740",
      lastMessage: "Let's meet at the Tokyo Tower",
      time: "5h ago",
      unread: 0,
      online: true,
    },
  ]);
  const ws = React.useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      try {
        setIsConnecting(true);
        ws.current = new WebSocket(`wss://ws.postman-echo.com/raw`);

        ws.current.onopen = () => {
          console.log('Connected to chat server');
          setIsConnecting(false);
          if (ws.current?.readyState === WebSocket.OPEN) {
            const joinMessage = {
              type: 'join',
              userId: userId,
              name: userName,
              timestamp: new Date().toISOString()
            };
            ws.current.send(JSON.stringify(joinMessage));
          }
          resolve();
        };

        ws.current.onmessage = (event) => {
          try {
            const receivedMessage = JSON.parse(event.data);
            console.log('MessageScreen received:', receivedMessage);

            switch (receivedMessage.type) {
              case 'join':
                setConnectedUsers(prev => new Set(prev).add(receivedMessage.userId));
                break;

              case 'chat':
                setConversations(prev => prev.map(conv => {
                  if (conv.id === parseInt(receivedMessage.recipient) || 
                      (receivedMessage.userId === userId && conv.id === parseInt(receivedMessage.recipient))) {
                    return {
                      ...conv,
                      lastMessage: receivedMessage.text,
                      time: 'Just now',
                      unread: conv.id === activeChat ? 0 : conv.unread + 1,
                      online: true
                    };
                  }
                  return conv;
                }));
                break;

              case 'leave':
                setConnectedUsers(prev => {
                  const updated = new Set(prev);
                  updated.delete(receivedMessage.userId);
                  return updated;
                });
                break;
            }
          } catch (error) {
            console.log('Error processing message:', error);
          }
        };

        ws.current.onerror = (error) => {
          console.log('WebSocket error:', error);
          setIsConnecting(false);
          reject(error);
        };

        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
          setIsConnecting(false);
          // Attempt to reconnect after a delay
          setTimeout(() => connectWebSocket().catch(console.error), 3000);
        };
      } catch (error) {
        console.log('Error creating WebSocket:', error);
        setIsConnecting(false);
        reject(error);
      }
    });
  }, [userId, userName, activeChat]);

  const handleChatPress = async (chatId: number) => {
    try {
      if (ws.current?.readyState !== WebSocket.OPEN) {
        await connectWebSocket();
      }
      setActiveChat(chatId);
    } catch (error) {
      console.log('Error connecting to chat:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to chat. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const selectedChat = conversations.find(chat => chat.id === activeChat);

  if (activeChat && selectedChat) {
    return (
      <ChatScreen
        recipient={selectedChat}
        onBack={() => setActiveChat(null)}
        ws={ws.current}
        userId={userId}
        userName={userName}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView style={styles.conversationList}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => handleChatPress(conversation.id)}
            disabled={isConnecting}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
              {conversation.online && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.name}>{conversation.name}</Text>
                <Text style={styles.time}>{conversation.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>

            {conversation.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{conversation.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '600',
    color: '#EC4899',
  },
  searchContainer: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(12),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(45),
  },
  searchIcon: {
    marginRight: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#1F2937',
  },
  conversationList: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
  },
  time: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  lastMessage: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#EC4899',
    borderRadius: moderateScale(12),
    minWidth: moderateScale(24),
    height: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(8),
    paddingHorizontal: moderateScale(8),
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: moderateScale(12),
    fontWeight: '600',
  }
}); 