import { withFirebase } from "../Firebase";
import React, { useState, useEffect } from "react";

const LandingBase = ({ firebase }) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    firebase
      .getTopRankedUsers()
      .get()
      .then((userRefs) => {
        const users = [];
        userRefs.forEach((ref) => {
          const id = ref.id;
          const data = ref.data();
          users.push({ id, ...data });
        });
        setUsers(users);
      });
  }, []);

  useEffect(() => {
    firebase
      .getTopRankedGroups()
      .get()
      .then((groupRefs) => {
        const groups = [];
        groupRefs.forEach((ref) => {
          const id = ref.id;
          const data = ref.data();
          groups.push({ id, ...data });
        });
        setGroups(groups);
      });
  }, [users]);

  return <div>landing</div>;
};
const Landing = withFirebase(LandingBase);
export default Landing;
