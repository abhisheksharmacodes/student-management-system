import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { action } from 'src/theme/core';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Students',
    path: '/students',
    icon: icon('ic-user'),
    onClick: () => {
      console.log('Navigating to Students');
    },
  },
  {
    title: 'Log out',
    path: '/sign-in',
    icon: icon('ic-lock'),
    onClick: () => {
      console.log('Logging out');
    },
  }
];

// // Example component to render the navigation items
// import React from 'react';
// import { useHistory } from 'react-router-dom';

// const NavItem = ({ title, path, icon, onClick }) => {
//   const history = useHistory();

//   const handleClick = () => {
//     if (onClick) onClick();
//     history.push(path);
//   };

//   return (
//     <div onClick={handleClick}>
//       {icon}
//       <span>{title}</span>
//     </div>
//   );
// };

// export const NavDashboard = () => (
//   <div>
//     {navData.map((item) => (
//       <NavItem key={item.title} {...item} />
//     ))}
//   </div>
// );
