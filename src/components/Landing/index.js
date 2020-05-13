import { withFirebase } from "../Firebase";
import React, { useState, useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel'

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

  //return users.map(user => <div style={{ textAlign: "center", paddingTop: "6rem" }}>{user.name}</div>)
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div class="cd-example">
      <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel" style={{ paddingTop: '2.9rem' }}>
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="500" xmlns="http://www.w3.org/2000/svg" aria-label="Placeholder: First slide" preserveAspectRatio="xMidYMid slice" role="img"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#555" dy=".3em"></text></svg>
            <div class="carousel-caption d-none d-md-block">

              <h5 style={{ color: 'black', fontWeight: 'bold' }}>TOP 3 Users</h5>
              {users.map((user) => (
                < p > Name: {user.name}<br></br>
                    Score: {user.score}<br></br>
                    Interest: {user.interest}<br></br>
                    Role: {user.role}<br></br>
                    Contact: {user.email}
                </p>
              ))}
            </div>
          </div>
          <div class="carousel-item">
            <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="500" xmlns="http://www.w3.org/2000/svg" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" role="img"><title>Placeholder</title><rect width="100%" height="100%" fill="#666" /><text x="50%" y="50%" fill="#444" dy=".3em"></text></svg>

            <div class="carousel-caption d-none d-md-block">
              <h5 style={{ color: 'black', fontWeight: 'bold' }}>TOP 3 Projects</h5>
              {groups.map(groups => (
                <p>{groups.name}</p>))}
            </div>
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div >
  )
}

/*
export function ControlledCarousel() {
  const [index, setIndex] = useState(0);
 
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
 
  return (
    
}
*/

const Landing = withFirebase(LandingBase);

export default Landing;

