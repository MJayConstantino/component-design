import React, {useEffect}from "react";
import { Member } from "@/types/member.type";
import MemberCard from "@/components/Member/MemberCard";
import { useCreateMember } from "@/hooks/Members/useCreateMember";
import { useFetchMembers } from "@/hooks/Members/useFetchMembers";
import { useDeleteMember } from "@/hooks/Members/useDeleteMember";
import { useUpdateMember } from "@/hooks/Members/useUpdateMember";
import CreateMemberDialog from "@/components/Member/CreateMemberDialog";

const Act3Page: React.FC = () => {
  const { createMember, error: createError } = useCreateMember();
  const { members, fetchMembers, } = useFetchMembers();
  const { deleteMember, error: deleteError } = useDeleteMember();
  const { updateMember, error: updateError } = useUpdateMember();

  useEffect(() => {
    fetchMembers();
  }, []); 

  const handleCreateMember = async (member: Member) => {
    await createMember(member);
    fetchMembers();
  };

  const handleDeleteMember = async (id: string) => {
    await deleteMember(id);
    fetchMembers();
  };

  const handleUpdateMember = async (id: string, member: Member) => {
    await updateMember(id, member);
    fetchMembers();
  };

  return (
    <div className="h-screen w-screen bg-gray-800">
      <header className="flex bg-lime-500 justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Member Management</h1>
        <CreateMemberDialog onSubmit={handleCreateMember} />
      </header>

      <div className="p-10">
        <h2 className="text-xl font-bold mb-2 text-white">Members List</h2>
        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onDelete={handleDeleteMember}
                onUpdate={handleUpdateMember}
              />
            ))}
          </div>
        ) : (
          <p>No members found.</p>
        )}
      </div>

      {(createError || deleteError || updateError) && (
        <p className="text-red-500 mt-4">
          {createError || deleteError || updateError}
        </p>
      )}
    </div>
  );
};

export default Act3Page;
