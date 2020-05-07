import React, { useState, useEffect } from "react";
import { withAuthUser } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { GroupDetail } from "../Group/detail";
const InvitationBase = ({ authUser, firebase }) => {
  const [invitations, setInvitations] = useState([]);
  const getAllInvitations = () => {
    const { pendingGroups } = authUser;
    if (pendingGroups) {
      pendingGroups.forEach((group) => {
        group.get().then((ref) => {
          setInvitations((prev) => [...prev, { id: ref.id, ...ref.data() }]);
        });
      });
    }
  };
  useEffect(() => {
    setInvitations([],getAllInvitations());
    
  }, [authUser.pendingGroups? authUser.pendingGroups.length: 0]);
  const ShowInvitations = () => {
    if (invitations && invitations.length>0) {
      return invitations.map((groupData) => (
        <GroupDetail groupData={groupData} firebase={firebase} invite={true} authUser={authUser}/>
      ));
    }
    return <div></div>;
  };
  return <ShowInvitations />;
};

export const Invitation = compose(withAuthUser, withFirebase)(InvitationBase);
