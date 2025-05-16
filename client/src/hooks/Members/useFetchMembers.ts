import { useState } from "react";
import { Member } from "@/types/member.type";

export const useFetchMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/members");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch members");
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { members, fetchMembers, isLoading, error };
};