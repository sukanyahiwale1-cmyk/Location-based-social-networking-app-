'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Navigation, Crosshair, X, MessageSquare, UserPlus, 
  List, Map as MapIcon, Sparkles, Activity, ShieldCheck, Wifi, 
  Globe, Zap, MapPin, Route, History, Bell, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_USERS, UserProfile, MOCK_PLACES, MOCK_HISTORY, GeoPlace } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { recommendConnections, RecommendConnectionsOutput } from '@/ai/flows/recommend-connections';

type ViewMode = 'map' | 'list' | 'history';

export default function MapPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<GeoPlace | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendConnectionsOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showRoute, setShowRoute] = useState(false);
  const { toast } = useToast();

  const filters = ['All', 'Users', 'Places', 'History', 'Alerts'];

  useEffect(() => {
    setIsLoaded(true);
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

    // Simulated Proximity Notification
    const timer = setTimeout(() => {
      toast({
        title: "Location Alert",
        description: "You just entered the 'Silicon Park' safe zone.",
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleRecenter = () => {
    toast({
      title: "User Location Detected",
      description: "Locked on current GPS coordinates. Accuracy: 2m.",
    });
  };

  const toggleRoute = () => {
    setShowRoute(!showRoute);
    if (!showRoute) {
      toast({
        title: "Route Mapping Initialized",
        description: "Calculating optimal path to Quantum Coffee...",
      });
    }
  };

  const handleMarkerClick = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedPlace(null);
    const match = recommendations?.recommendations.find(r => r.id === user.id);
    if (match && match.compatibilityScore > 70) {
      toast({
        title: `Neural Match: ${match.compatibilityScore}%`,
        description: match.matchReason,
      });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white font-mono">
      {/* REAL MAP LAYER */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        viewMode === 'map' ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 opacity-60">
          <div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125 brightness-50"
            style={{ filter: 'grayscale(1) brightness(0.4) contrast(1.5)' }}
          />
        </div>
        
        <div className="absolute inset-0 lab-grid opacity-30 pointer-events-none" />

        {/* MOCK ROUTE LINE */}
        {showRoute && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <path 
              d="M 200 300 Q 300 250 400 350 T 500 450" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="4" 
              strokeDasharray="8 8" 
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>
        )}
        
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full">
          <div className="absolute animate-scan-ping bg-primary/20 rounded-full w-[500px] h-[500px]" />
          <div className="absolute animate-scan-ping bg-primary/10 rounded-full w-[800px] h-[800px] delay-1000" />
        </div>
      </div>

      {/* LAB HUD OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none p-6">
        <div className="h-full w-full border border-white/5 rounded-[2rem] relative">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/60 rounded-tl-[2rem]" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/60 rounded-tr-[2rem]" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary/60 rounded-bl-[2rem]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/60 rounded-br-[2rem]" />
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 opacity-60">
             <div className="flex items-center gap-2">
                <Bell className="h-3 w-3 text-primary" />
                <span className="text-[8px] font-black tracking-widest uppercase">Proximity Alerts: On</span>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-[8px] font-black tracking-widest uppercase">Encryption Active</span>
             </div>
          </div>
        </div>
      </div>

      {/* INTERFACE CONTROLS */}
      <div className="absolute top-8 left-0 right-0 z-40 px-8 space-y-6">
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="flex bg-black/80 backdrop-blur-2xl p-1.5 rounded-[1.8rem] border border-white/10 shadow-2xl">
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[1.2rem] text-[9px] font-black uppercase italic tracking-[0.2em] transition-all",
                viewMode === 'map' ? "bg-primary text-white" : "text-white/40"
              )}
            >
              <MapIcon className="h-3 w-3" /> Map
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[1.2rem] text-[9px] font-black uppercase italic tracking-[0.2em] transition-all",
                viewMode === 'list' ? "bg-primary text-white" : "text-white/40"
              )}
            >
              <List className="h-3 w-3" /> Signals
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[1.2rem] text-[9px] font-black uppercase italic tracking-[0.2em] transition-all",
                viewMode === 'history' ? "bg-primary text-white" : "text-white/40"
              )}
            >
              <History className="h-3 w-3" /> History
            </button>
          </div>
          
          <Avatar className="h-12 w-12 border-2 border-primary/40 p-1 bg-black pointer-events-auto">
            <AvatarImage src="https://picsum.photos/seed/lab-user/100/100" className="rounded-full" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </header>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
          {filters.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-full whitespace-nowrap text-[9px] font-black uppercase italic tracking-widest transition-all border",
                activeFilter === filter ? "bg-white text-black border-white" : "bg-black/60 text-white/40 border-white/10"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="h-full pt-32">
        {viewMode === 'map' ? (
          <div className="relative h-full w-full">
            {isLoaded && (activeFilter === 'All' || activeFilter === 'Users') && MOCK_USERS.map((user) => (
              <div 
                key={user.id}
                className="absolute transition-all duration-700 animate-in fade-in zoom-in"
                style={{ left: user.location.x, top: user.location.y }}
              >
                <button 
                  onClick={() => handleMarkerClick(user)}
                  className="group flex flex-col items-center hover:scale-110 transition-transform"
                >
                  <div className="p-1.5 rounded-[1.4rem] bg-white/10 glass border-white/20">
                    <Avatar className="h-12 w-12 rounded-[1.2rem]">
                      <AvatarImage src={user.avatar} className="object-cover" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-2 px-2 py-0.5 rounded-[0.5rem] glass text-[7px] font-black uppercase italic">
                    {user.name.split(' ')[0]}
                  </div>
                </button>
              </div>
            ))}

            {isLoaded && (activeFilter === 'All' || activeFilter === 'Places') && MOCK_PLACES.map((place) => (
              <div 
                key={place.id}
                className="absolute transition-all duration-700 animate-in fade-in zoom-in"
                style={{ left: place.location.x, top: place.location.y }}
              >
                <button 
                  onClick={() => { setSelectedPlace(place); setSelectedUser(null); }}
                  className="group flex flex-col items-center hover:scale-110 transition-transform"
                >
                  <div className="p-2 rounded-full bg-primary/20 border border-primary/40 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="mt-2 px-2 py-0.5 rounded-[0.5rem] glass text-[7px] font-black uppercase italic text-primary">
                    {place.name}
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : viewMode === 'list' ? (
          <div className="px-8 h-full overflow-y-auto no-scrollbar pb-48 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80 italic mb-6">Nearby Signal Discovery</h2>
            {MOCK_USERS.map((user) => (
              <div 
                key={user.id} 
                className="glass rounded-[2rem] p-6 flex items-center gap-6 cursor-pointer border-white/10 hover:border-primary/30 transition-all"
                onClick={() => handleMarkerClick(user)}
              >
                <Avatar className="h-16 w-16 rounded-[1.5rem]">
                  <AvatarImage src={user.avatar} className="object-cover" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="font-black italic uppercase text-xs tracking-widest">{user.name}</h3>
                  <div className="flex items-center gap-4 text-[8px] text-white/40 uppercase font-bold">
                    <span>{user.distance} Prox</span>
                    <span className="text-primary">{user.telemetry.activity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-8 h-full overflow-y-auto no-scrollbar pb-48 space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80 italic mb-6">Location History</h2>
            {MOCK_HISTORY.map((entry) => (
              <div key={entry.id} className="glass rounded-[1.5rem] p-4 flex justify-between items-center border-white/5">
                <div>
                  <h3 className="text-[10px] font-black uppercase italic text-white/90">{entry.placeName}</h3>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest mt-1">{entry.timestamp}</p>
                </div>
                <Badge variant="outline" className="text-[7px] border-primary/20 text-primary uppercase italic">
                  {entry.duration}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTION HUD PANEL */}
      {selectedUser && (
        <div className="absolute bottom-32 left-8 right-8 z-50 animate-in slide-in-from-bottom-20">
          <div className="glass rounded-[2.5rem] p-6 relative overflow-hidden border-white/10 shadow-2xl">
            <button className="absolute top-4 right-4 text-white/40" onClick={() => setSelectedUser(null)}><X className="h-5 w-5" /></button>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 rounded-[1.5rem] border border-white/10">
                <AvatarImage src={selectedUser.avatar} className="object-cover" />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-black italic uppercase text-lg tracking-tight">{selectedUser.name}</h3>
                  <p className="text-[9px] text-primary uppercase font-bold tracking-widest">{selectedUser.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-xl h-10 bg-primary text-[10px] font-black uppercase italic">Establish Link</Button>
                  <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-white/5"><MessageSquare className="h-5 w-5 text-white/60" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPlace && (
        <div className="absolute bottom-32 left-8 right-8 z-50 animate-in slide-in-from-bottom-20">
          <div className="glass rounded-[2.5rem] p-6 relative overflow-hidden border-primary/20 shadow-2xl">
            <button className="absolute top-4 right-4 text-white/40" onClick={() => setSelectedPlace(null)}><X className="h-5 w-5" /></button>
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MapPin className="h-10 w-10" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-black italic uppercase text-lg tracking-tight">{selectedPlace.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black">{selectedPlace.rating}</span>
                    <span className="text-[8px] text-white/40 uppercase ml-2">{selectedPlace.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-xl h-10 bg-primary text-[10px] font-black uppercase italic" onClick={toggleRoute}>
                    {showRoute ? "Cancel Route" : "Get Directions"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS */}
      <div className="absolute bottom-32 right-8 flex flex-col gap-4 z-40">
        <button 
          className="h-12 w-12 rounded-xl glass border-white/10 flex items-center justify-center hover:bg-primary/10 transition-all shadow-xl"
          onClick={handleRecenter}
        >
          <Crosshair className="h-6 w-6 text-primary" />
        </button>
        <button 
          className={cn(
            "h-12 w-12 rounded-xl border flex items-center justify-center transition-all shadow-xl",
            showRoute ? "bg-primary border-primary text-white" : "glass border-white/10 text-white/60"
          )}
          onClick={toggleRoute}
        >
          <Route className="h-6 w-6" />
        </button>
        <button className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
          <Navigation className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  );
}
