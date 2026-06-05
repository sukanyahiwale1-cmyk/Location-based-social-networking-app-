
'use client';

import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Loader2, Plus, Bell, Camera, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { recommendConnections, RecommendConnectionsOutput } from '@/ai/flows/recommend-connections';
import { MOCK_USERS } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<RecommendConnectionsOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(true);
  const [showSnapUI, setShowSnapUI] = useState(false);
  const { toast } = useToast();
  
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-event');

  useEffect(() => {
    async function getAiRecommendations() {
      setIsLoadingAi(true);
      try {
        const result = await recommendConnections({
          userInterests: ['Tech', 'Coffee', 'Design'],
          nearbyProfiles: MOCK_USERS.map(u => ({
            id: u.id,
            name: u.name,
            bio: u.bio,
            interests: u.interests,
            distance: u.distance
          }))
        });
        setRecommendations(result);
      } catch (err) {
        console.error('AI Flow error:', err);
      } finally {
        setIsLoadingAi(false);
      }
    }
    getAiRecommendations();
  }, []);

  const handleQuickSnap = () => {
    setShowSnapUI(true);
  };

  const captureSnap = () => {
    toast({ title: "Snap Captured", description: "Uploading to your Story signal..." });
    setShowSnapUI(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 min-h-screen pb-24 bg-background overflow-x-hidden relative">
      {/* Dynamic Header */}
      <header className="px-4 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter italic text-primary uppercase leading-none">GEOSOCIAL</h1>
          <p className="text-[8px] uppercase font-black tracking-[0.3em] text-white/40 mt-1">Reality Unlocked</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full relative text-white/60 hover:text-primary transition-all active:scale-90"
            onClick={() => toast({ title: "Notifications", description: "No new activity nearby." })}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
          <Link href="/profile">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary transition-all active:scale-90">
              <AvatarImage src="https://picsum.photos/seed/me/100/100" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Stories Row */}
      <div className="px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={handleQuickSnap}
            className="flex flex-col items-center gap-2 min-w-[70px] group transition-transform active:scale-90"
          >
            <div className="relative h-16 w-16 rounded-[2rem] border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5 group-hover:border-primary group-hover:bg-primary/10 transition-all">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 italic">Snap Story</span>
          </button>
          {MOCK_USERS.map((user) => (
            <div key={user.id} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer active:scale-95 transition-transform group">
              <div className="h-16 w-16 rounded-[2rem] p-[3px] bg-gradient-to-tr from-primary via-purple-500 to-pink-500 group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[1.8rem] border-2 border-background overflow-hidden bg-secondary relative">
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
              <span className="text-[8px] font-black uppercase italic truncate w-full text-center tracking-widest text-white/60">{user.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Intelligence Card */}
      <div className="px-4">
        <Card className="bg-gradient-to-br from-primary/30 to-purple-600/20 border-none glass overflow-hidden relative rounded-[2.5rem]">
          <div className="absolute top-4 right-4 animate-pulse">
            <Zap className="h-6 w-6 text-primary fill-primary" />
          </div>
          <CardHeader className="pb-2 pt-8">
            <CardTitle className="text-xl font-black italic uppercase flex items-center gap-2 tracking-tighter text-white">
              Neural Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingAi ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary italic">Analyzing Neighborhood Mesh...</p>
              </div>
            ) : recommendations && recommendations.recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.recommendations.slice(0, 2).map((rec) => {
                  const user = MOCK_USERS.find(u => u.id === rec.id);
                  if (!user) return null;
                  return (
                    <div 
                      key={rec.id} 
                      className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] glass border-none transition-all active:scale-[0.98] cursor-pointer group"
                      onClick={() => toast({ title: `Neural Match: ${rec.compatibilityScore}%`, description: rec.matchReason })}
                    >
                      <Avatar className="h-12 w-12 rounded-[1rem] ring-2 ring-white/10 group-hover:ring-primary transition-all">
                        <AvatarImage src={user.avatar} className="object-cover" />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-black italic uppercase truncate text-white tracking-tight">{user.name}</p>
                          <Badge className="text-[8px] h-4 px-2 bg-primary/20 text-primary border-none font-black italic">
                            {rec.compatibilityScore}%
                          </Badge>
                        </div>
                        <p className="text-[9px] text-white/40 truncate font-bold uppercase tracking-widest italic">{user.distance} away</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-[10px] font-black uppercase italic text-white/40">No neural signals detected nearby</p>
              </div>
            )}
            <Button className="w-full h-12 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[11px] font-black uppercase italic tracking-widest text-white" asChild>
              <Link href="/map">Establish Proximity <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Featured Location */}
      <div className="px-4">
        <Card className="relative h-72 overflow-hidden rounded-[3rem] border-none glass group transition-all cursor-pointer active:scale-[0.98]" onClick={() => toast({ title: "Signal Locked", description: "Redirecting to Trending Zone..." })}>
          {heroImage && (
            <Image 
              src={heroImage.imageUrl} 
              alt={heroImage.description} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <CardContent className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full space-y-4">
            <div className="space-y-2">
              <Badge className="bg-primary/90 text-white border-none text-[8px] font-black uppercase italic px-4 py-1 tracking-[0.2em]">Live Pulse Zone</Badge>
              <h2 className="text-3xl font-black text-white leading-none uppercase italic tracking-tighter">Bushwick Collective Art Walk</h2>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-black">
                      <AvatarImage src={`https://picsum.photos/seed/a${i}/50/50`} />
                    </Avatar>
                  ))}
                </div>
                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest italic">+142 active nodes</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-8 right-8 rounded-full bg-white text-black h-14 w-14 shadow-2xl flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110">
            <ArrowRight className="h-7 w-7" />
          </div>
        </Card>
      </div>

      {/* Safety Status */}
      <div className="px-4">
        <div className="bg-green-500/5 border border-green-500/20 glass rounded-[2rem] py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-[10px] font-black text-green-500 uppercase italic tracking-widest">Network Secure</p>
              <p className="text-[8px] font-bold text-green-200/40 uppercase tracking-[0.1em]">256-bit Node Encryption Active</p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-500 border-none font-black uppercase italic text-[8px] tracking-widest">Safe</Badge>
        </div>
      </div>

      {/* Simulated Snap UI Overlay */}
      {showSnapUI && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 flex flex-col items-center justify-center p-8 space-y-12">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-8 right-8 text-white h-12 w-12 rounded-full bg-white/10"
            onClick={() => setShowSnapUI(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-primary/20 bg-secondary/20 flex items-center justify-center">
             <Image src="https://picsum.photos/seed/viewfinder/800/1200" alt="Viewfinder" fill className="object-cover opacity-60" />
             <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-[10px] font-black uppercase italic tracking-widest text-white">Neural Viewfinder Active</p>
             </div>
          </div>

          <Button 
            onClick={captureSnap}
            className="h-24 w-24 rounded-full border-8 border-white bg-transparent p-0 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          >
            <div className="h-16 w-16 rounded-full bg-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
