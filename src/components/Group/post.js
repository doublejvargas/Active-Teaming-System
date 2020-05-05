import React, { Component } from 'react'

export default function Post(props) {
    return (
      <div className="col-10 col-md-8 col-lg-7">
        <div className="card mb-4 shadow">
          <div className="card-body card-text">
            { props.content }
          </div>
          <div className="card-footer small text-muted text-right">
            by&nbsp;&nbsp;{props.sender}
            <br/>{ props.posttime }
          </div>
        </div>
      </div>
    );
  }
