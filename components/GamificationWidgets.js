
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Plus, Star } from 'lucide-react';

export const LeaderboardWidget = ({ currentUser }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // In a real app, this would be a proper query. 
    // For now, we mock friends or fetch top global users
    const { data } = await supabase
      .from('profiles')
      .select('username, xp, avatar_url, league_tier')
      .order('xp', { ascending: false })
      .limit(5);
    
    setLeaders(data || []);
    setLoading(false);
  };

  return (
    <Card className="bg-white/5 border-white/10 h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Ranking (Liga {currentUser?.league_tier || 'Bronze'})
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6">
            <Users className="w-4 h-4 text-white/50" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaders.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-white/30 w-4">{index + 1}</div>
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-[10px] text-white/40">{user.league_tier || 'Bronze'}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">{user.xp?.toLocaleString()} XP</span>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4 text-xs border-white/10 hover:bg-white/5">
            <Plus className="w-3 h-3 mr-2" /> Convidar Amigos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
