"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Send, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

type Conversation = {
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  otherUser: { id: string; name: string | null; phone: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string | null };
};

export default function MensagensPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<{
    propertyId: string;
    userId: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Carregar conversas
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/messages")
        .then((res) => res.json())
        .then((data) => {
          setConversations(data.conversations || []);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  // Carregar mensagens da conversa selecionada
  useEffect(() => {
    if (selectedConversation) {
      fetch(
        `/api/messages/${selectedConversation.propertyId}/${selectedConversation.userId}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
        });
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedConversation.propertyId,
          receiverId: selectedConversation.userId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Mensagens</h1>
        <p className="text-gray-500 mb-4">Faça login para ver suas mensagens</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Mensagens
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Lista de conversas ou chat */}
          {!selectedConversation ? (
            <div className="divide-y dark:divide-gray-700">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma conversa ainda</p>
                  <p className="text-sm mt-1">
                    Inicie uma conversa a partir de um imóvel
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={`${conv.propertyId}-${conv.otherUser.id}`}
                    onClick={() =>
                      setSelectedConversation({
                        propertyId: conv.propertyId,
                        userId: conv.otherUser.id,
                      })
                    }
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Home className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {conv.otherUser.name || conv.otherUser.phone}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.propertyTitle} - {conv.propertyCity}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col h-[600px]">
              {/* Header do chat */}
              <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="font-medium">Conversa</p>
                  <Link
                    href={`/imoveis/${selectedConversation.propertyId}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Ver imóvel
                  </Link>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === session?.user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-xl ${
                          isMe
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input de mensagem */}
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
