
'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, MapPin, Users2, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const COMMUNITIES = [
  {
    id: 'c1',
    name: 'Brooklyn Tech Hub',
    members: 1200,
    type: 'Public',
    location: 'DUMBO, NY',
    image: 'https://picsum.photos/seed/comm1/600/300',
    description: 'Local developers, designers and tech enthusiasts.',
    category: 'Tech'
  },
  {
    id: 'c2',
    name: 'Morning Runners Club',
    members: 450,
    type: 'Public',
    location: 'Prospect Park',
    image: 'https://picsum.photos/seed/comm2/600/300',
    description: 'Early morning cardio and coffee sessions.',
    category: 'Fitness'
  },
  {
    id: 'c3',
    name: 'Secret Supper Society',
    members: 85,
    type: 'Private',
    location: 'Hidden Venues',
    image: 'https://picsum.photos/seed/comm3/600/300',
    description: 'Exclusive underground dining experiences.',
    category: 'Food'
  }
];

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredCommunities = useMemo(() => {
    return COMMUNITIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleJoin = (id: string, name: string) => {
    const isJoined = joinedIds.includes(id);
    if (isJoined) {
      setJoinedIds(prev => prev.filter(i => i !== id));
      toast({ title: "Left Squad", description: `You left ${name}.` });
    } else {
      setJoinedIds(prev => [...prev, id]);
      toast({ title: "Joined Squad", description: `Welcome to ${name}!` });
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background pb-24">
      <header className="px-4 pt-8 pb-4 space-y-6 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Communities</h1>
          <Button 
            size="icon" 
            className="rounded-2xl bg-primary h-11 w-11 shadow-lg shadow-primary/20 transition-all active:scale-90"
            onClick={() => toast({ title: "Create Community", description: "Restricted to Level 5 users." })}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search nearby squads..." 
            className="pl-12 h-12 glass border-none rounded-2xl bg-secondary/30 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="p-4 space-y-8">
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Suggested for you</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {filteredCommunities.map((comm) => {
              const isJoined = joinedIds.includes(comm.id);
              return (
                <Card key={comm.id} className="min-w-[220px] bg-secondary/20 border-none glass overflow-hidden rounded-[2.5rem] transition-all">
                  <CardContent className="p-0">
                    <div className="relative h-28">
                      <Image src={comm.image} alt={comm.name} fill className="object-cover" data-ai-hint="community" />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black italic uppercase truncate">{comm.name}</h3>
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-white/50">
                          <Users2 className="h-3 w-3 text-primary" />
                          {comm.members + (isJoined ? 1 : 0)} Members
                        </div>
                      </div>
                      <Button 
                        onClick={() => toggleJoin(comm.id, comm.name)}
                        className={cn(
                          "w-full h-10 text-[10px] font-black uppercase italic tracking-widest rounded-xl transition-all active:scale-95",
                          isJoined 
                            ? "bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500 hover:text-white" 
                            : "bg-primary text-white shadow-lg shadow-primary/20"
                        )}
                      >
                        {isJoined ? <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Joined</span> : "Join Squad"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Local Network Activity</h2>
          <div className="space-y-4">
            {filteredCommunities.map((comm) => (
              <Card key={comm.id} className="bg-secondary/10 border-none glass rounded-[2.5rem] overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform">
                <CardContent className="p-0 flex items-stretch">
                  <div className="relative w-32 shrink-0">
                    <Image src={comm.image} alt={comm.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
                  </div>
                  <div className="p-6 flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black italic uppercase tracking-tighter">{comm.name}</h3>
                      {comm.type === 'Private' ? (
                        <Lock className="h-3 w-3 text-primary" />
                      ) : (
                        <Globe className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                      {comm.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/60">
                        <MapPin className="h-3 w-3 text-primary" />
                        {comm.location}
                      </div>
                      <Badge className="bg-white/5 border border-white/10 text-[8px] font-black uppercase italic px-2 py-0.5">
                        {comm.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCommunities.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="inline-block p-4 rounded-full bg-secondary/30">
                  <Search className="h-8 w-8 text-white/20" />
                </div>
                <p className="text-sm text-white/40 font-black italic uppercase">No squads found matching your query</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
