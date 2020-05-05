import React, { Component } from 'react';
import { InfoConsumer } from '../Context/Context';


class Home extends Component {
  render() {
    return (
      <InfoConsumer>
        {value => {
          return <h2>{value}</h2>
        }}
      </InfoConsumer>
    );
  }
}

export default Home;
