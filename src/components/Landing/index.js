import { withFirebase } from "../Firebase";
import React, { useState, useEffect } from "react";

const LandingBase = ({ firebase }) => {
  const [data, setData] = useState({ users: [], groups: [] });

  useEffect(() => {
    const users = [];
    const getUsers = async () => {
      await firebase
        .getTopRankedUsers()
        .get()
        .then((userRefs) => {
          userRefs.forEach((ref) => {
            const id = ref.id;
            const data = ref.data;
            users.push({ id, ...data });
          });
        });
    };
    const groups = [];
    const getGroups = async () => {
      await firebase
        .getTopRankedGroups()
        .get()
        .then((groupRefs) => {
          groupRefs.forEach((ref) => {
            const id = ref.id;
            const data = ref.data;
            groups.push({ id, ...data });
          });
        });
    };
    getUsers();
    getGroups();
    setData({ users, groups });
  }, []);

  console.log(data);
  return <div>landing</div>;
};
const Landing = withFirebase(LandingBase);
export default Landing;
