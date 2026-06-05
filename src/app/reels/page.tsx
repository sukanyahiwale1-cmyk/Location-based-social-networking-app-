
'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Music, UserPlus, Check, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const REELS = [
  {
    id: 'r1',
    user: { name: 'Elena Fisher', avatar: 'https://picsum.photos/seed/user1/100/100', followed: false },
    content: 'https://picsum.photos/seed/reel1/1080/1920',
    caption: 'Chasing sunsets in Brooklyn 🌅 #citylife #vibes',
    likes: 12400,
    comments: 456,
    music: 'Midnight City - M83'
  },
  {
    id: 'r2',
    user: { name: 'Marcus Wright', avatar: 'https://picsum.photos/seed/user2/100/100', followed: true },
    content: 'https://picsum.photos/seed/reel2/1080/1920',
    caption: 'Morning brew perfection at The Local Grind ☕️',
    likes: 8200,
    comments: 231,
    music: 'Coffee Shop Jazz'
  }
];

export default function ReelsPage() {
  const { toast } = useToast();
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
    if (!likedReels[id]) {
      toast({ title: "Signal Pinned", description: "You liked this story." });
    }
  };

  const toggleFollow = (name: string) => {
    setFollowedUsers(prev => ({ ...prev, [name]: !prev[name] }));
    toast({ 
      title: followedUsers[name] ? "Connection Severed" : "Signal Locked", 
      description: followedUsers[name] ? `Stopped following ${name}` : `Now following ${name}` 
    });
  };

  return (
    <div className="max-w-md mx-auto bg-black h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {REELS.map((reel) => {
        const isLiked = likedReels[reel.id];
        const isFollowed = followedUsers[reel.user.name] || reel.user.followed;

        return (
          <div key={reel.id} className="h-screen w-full relative snap-start flex flex-col justify-end">
            <div className="absolute inset-0 -z-10">
              <Image 
                src={reel.content} 
                alt="Reel content" 
                fill 
                className="object-cover"
                priority
                data-ai-hint="lifestyle"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
            
            <div className="absolute top-6 left-6 z-20">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Stories</h2>
            </div>

            {/* Right Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
              <div className="flex flex-col items-center gap-1">
                <div className="relative mb-2">
                  <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-primary/20">
                    <AvatarImage src={reel.user.avatar} />
                    <AvatarFallback>{reel.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full p-0 border-2 border-black transition-colors",
                      isFollowed ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
                    )}
                    onClick={() => toggleFollow(reel.user.name)}
                  >
                    {isFollowed ? <Check className="h-2 w-2 text-white" /> : <UserPlus className="h-2 w-2 text-white" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-12 w-12 rounded-full backdrop-blur-md transition-all active:scale-90",
                    isLiked ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                  onClick={() => toggleLike(reel.id)}
                >
                  <Heart className={cn("h-7 w-7", isLiked && "fill-current")} />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">
                  {((reel.likes + (isLiked ? 1 : 0)) / 1000).toFixed(1)}K
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                  onClick={() => toast({ title: "Comments", description: "Feature deploying soon..." })}
                >
                  <MessageCircle className="h-7 w-7" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">{reel.comments}</span>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md text-white"
                onClick={() => toast({ title: "Shared", description: "Signal copied to clipboard." })}
              >
                <Share2 className="h-7 w-7" />
              </Button>
            </div>

            {/* Bottom Info */}
            <div className="p-6 pb-32 space-y-4 max-w-[80%]">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest drop-shadow-md">
                  @{reel.user.name.toLowerCase().replace(' ', '_')}
                </h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium drop-shadow-md">
                  {reel.caption}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit border border-white/10">
                <Music className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase italic tracking-widest text-white/80 overflow-hidden whitespace-nowrap max-w-[120px]">
                  {reel.music}
                </span>
              </div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
              <ChevronDown className="h-6 w-6 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
