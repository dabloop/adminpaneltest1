import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/free-solid-svg-icons'; // Adjust this according to your usage

import './Dashboard.css'
function Dashboard({ title, description, stats, icon }) {
    return ( 
        <div className="dashboard">
            <h1> 
                <FontAwesomeIcon icon={icon} style={{ marginRight: '18px' }} />
                {title}
            </h1>
            <p>{description}</p>
            <br />
            <br />
            <div className="stats">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-box">
                        <h2><FontAwesomeIcon icon={stat.icon} style={{ marginRight: '18px' }}/>{stat.title}</h2>
                        <br />
                        <hr className='styled-hr' />
                        <br />
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
