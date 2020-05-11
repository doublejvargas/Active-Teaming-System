import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export const Evaluation = ({ authUser }) => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    getAllGroups();
  }, []);

  const getAllGroups = async () => {
    const { groupsAssigned } = authUser;
    if (groupsAssigned && groupsAssigned.length > 0) {
      const groups = [];
      for (let i = 0; i < groupsAssigned.length; ++i) {
        await groupsAssigned[i].get().then((res) => {
          const id = res.id;
          const data = res.data();
          groups.push({ id, ...data });
        });
      }
      setGroups(groups);
    }
  };

  return (
    <>
      {groups.length > 0 ? (
        <div>
          {groups.map((group) => (
            <div>
              group name: {group.name}
              <Link to={`/group/${group.id}`}>
                <button>Go</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>no data</div>
      )}
    </>
  );
};
