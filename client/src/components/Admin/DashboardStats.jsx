import React from 'react';
import PropTypes from 'prop-types';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-app-card rounded-xl border border-app-card-border shadow-sm p-5 flex items-center space-x-4 transition-colors"
        >
          <div className={`${stat.color} p-3 rounded-xl flex-shrink-0`}>
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-app-muted">{stat.name}</p>
            <p className="text-2xl font-bold text-app-text mt-0.5">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

DashboardStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default DashboardStats;