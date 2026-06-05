
'use client';

import { useState, useMemo } from 'react';
import { Search, Bell, Ghost, MessageSquare, Camera, X, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const INITIAL_CHATS = [
  { id: '1', name: 'Jhonny Bairstow', status: '37 Min ago', distance: '1.2 mi', avatar: 'https://picsum.photos/seed/b1/100/100', lastMsg: 'Yo, are you heading to the mixer?' },
  { id: '2', name: 'John Smith', status: 'Active Now', distance: '1.2 mi', avatar: 'https://picsum.photos/seed/b2/100/100', lastMsg: 'That spot is amazing!' },
  { id: '3', name: 'Jane Cooper', status: 'Active Now', distance: '1.2 mi', avatar: 'https://picsum.photos/seed/b3/100/100', lastMsg: 'Sent a photo' },
  { id: '4', name: 'Sara Jonson', status: '40 Min ago', distance: '1.2 mi', avatar: 'https://picsum.photos/seed/b4/100/100', lastMsg: 'See you there!' },
  { id: '5', name: 'Emma', status: 'Active Now', distance: '1.2 mi', avatar: 'https://picsum.photos/seed/b5/100/100', lastMsg: 'Haha sounds good' },
];

export default function ChatListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<typeof INITIAL_CHATS[0] | null>(null);
  const { toast } = useToast();

  const filteredChats = useMemo(() => {
    return INITIAL_CHATS.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOpenChat = (chat: typeof INITIAL_CHATS[0]) => {
    setSelectedChat(chat);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black flex flex-col text-white pb-24 relative overflow-hidden">
      <header className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white/10">
              <AvatarImage src="https://picsum.photos/seed/me/100/100" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <Ghost className="h-6 w-6" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <Bell className="h-6 w-6" />
              </Button>
              <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input 
            placeholder="Search messages..." 
            className="bg-white/5 border-none rounded-2xl pl-12 h-12 text-sm focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]"
              onClick={() => handleOpenChat(chat)}
            >
              <div className="relative">
                <Avatar className="h-14 w-14 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.id === '1' && (
                  <div className="absolute -bottom-1 -left-1 bg-primary px-1.5 py-0.5 rounded-full text-[8px] font-black italic">NEW</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                  <span className="text-[9px] text-white/30 uppercase font-bold">{chat.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate font-medium">
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm text-white/40 font-bold italic uppercase tracking-widest">No signals found</p>
              <Button variant="link" className="text-primary text-[10px] uppercase font-black" onClick={() => setSearchQuery('')}>Clear Search</Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Mock Chat Window Overlay */}
      {selectedChat && (
        <div className="absolute inset-0 z-50 bg-black animate-in slide-in-from-right duration-300 flex flex-col">
          <header className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)} className="h-10 w-10">
                <X className="h-6 w-6" />
              </Button>
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-black italic uppercase">{selectedChat.name}</h3>
                <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Signal Locked</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white/60"><Camera className="h-5 w-5" /></Button>
          </header>
          
          <ScrollArea className="flex-1 p-6 space-y-6">
            <div className="bg-white/5 rounded-2xl p-4 max-w-[80%] text-[11px] leading-relaxed">
              {selectedChat.lastMsg}
            </div>
            <div className="bg-primary/20 border border-primary/20 rounded-2xl p-4 max-w-[80%] ml-auto text-[11px] leading-relaxed text-right">
              On my way! Just checking the Map Lab for the fastest route.
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-black">
            <div className="flex-1 relative">
              <Input placeholder="Send a snap..." className="bg-white/5 border-none rounded-full h-12 pr-12 text-xs" />
              <Button size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary" onClick={() => toast({ title: "Message Sent", description: "Your signal has been transmitted." })}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
