import React from 'react';
// import './Dashboard.css';

function Dashboard({ title, description, stats }) {
    return (
        <div className="dashboard">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="stats">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-box">
                        <h2>{stat.title}</h2>
                        <p>{stat.description}</p>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
