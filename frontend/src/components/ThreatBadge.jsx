import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaShieldAlt } from 'react-icons/fa';

// ThreatBadge — color-coded severity indicator for cybersecurity mode
const ThreatBadge = ({ level }) => {
  const config = {
    safe: {
      icon: <FaCheckCircle />,
      text: 'Safe',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    low: {
      icon: <FaShieldAlt />,
      text: 'Low Risk',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    warning: {
      icon: <FaExclamationTriangle />,
      text: 'Warning',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    suspicious: {
      icon: <FaExclamationTriangle />,
      text: 'Suspicious',
      classes: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    critical: {
      icon: <FaTimesCircle />,
      text: 'Critical',
      classes: 'bg-red-50 text-red-700 border-red-200',
    },
    malicious: {
      icon: <FaTimesCircle />,
      text: 'Malicious',
      classes: 'bg-red-50 text-red-700 border-red-200',
    },
  };

  const { icon, text, classes } = config[level] || config.safe;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-bold ${classes}`}>
      {icon}
      {text}
    </span>
  );
};

export default ThreatBadge;
