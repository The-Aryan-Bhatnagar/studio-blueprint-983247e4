import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFullscreenAds = () => {
  return useQuery({
    queryKey: ["fullscreen-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .eq("position", "fullscreen")
        .order("priority", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data;
    },
  });
};
